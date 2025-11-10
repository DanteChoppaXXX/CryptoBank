const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Simulated BTC/USD exchange rate (static for now)
const BTC_RATE = 68000;

/**
 * ✅ Simulate a deposit (TEST MODE)
 * Triggered from the frontend using httpsCallable()
 */
exports.simulateDeposit = functions.https.onCall(async (data, context) => {
  const { userId, amountUSD } = data;

  if (!userId || !amountUSD) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing userId or amountUSD"
    );
  }

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "User not found");
  }

  const amountBTC = (amountUSD / BTC_RATE).toFixed(6);
  const txRef = db.collection("transactions").doc();

  // Add new deposit transaction
  await txRef.set({
    userId,
    type: "Deposit",
    amountUSD,
    amountBTC,
    address: "dummy_btc_address_for_testing",
    status: "Success",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Increment user's USD balance
  await userRef.update({
    balanceUSD: admin.firestore.FieldValue.increment(amountUSD),
  });

  return { success: true, message: "Deposit simulated successfully" };
});

/**
 * ✅ Simulate a withdrawal (TEST MODE)
 * Mimics a real BTC transfer confirmation delay
 */
exports.simulateWithdraw = functions.https.onCall(async (data, context) => {
  const { userId, btcAddress, amountUSD } = data;

  if (!userId || !btcAddress || !amountUSD) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing userId, btcAddress, or amountUSD"
    );
  }

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "User not found");
  }

  const currentBalance = userDoc.data().balanceUSD || 0;

  if (currentBalance < amountUSD) {
    throw new functions.https.HttpsError("failed-precondition", "Insufficient funds");
  }

  const amountBTC = (amountUSD / BTC_RATE).toFixed(6);
  const txRef = db.collection("transactions").doc();

  // Create a pending withdrawal transaction
  await txRef.set({
    userId,
    type: "Withdraw",
    amountUSD,
    amountBTC,
    address: btcAddress,
    status: "Pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Deduct from balance
  await userRef.update({
    balanceUSD: admin.firestore.FieldValue.increment(-amountUSD),
  });

  // Simulate blockchain confirmation after 3 seconds
  setTimeout(async () => {
    await txRef.update({ status: "Success" });
  }, 3000);

  return { success: true, message: "Withdrawal simulated successfully" };
});

