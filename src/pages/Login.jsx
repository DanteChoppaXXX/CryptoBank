import React, { useEffect } from "react";

export default function LegacyLogin() {
  useEffect(() => {
    // Inject the required CSS files
    const cssFiles = [
      "assets/css/src/bootstrap/bootstrap.min.css",
      "assets/css/fontawesome.min.css",
      "assets/css/style.css",
      "assets/css/all.min.css",
      "assets/css/others.css",
    ];

    cssFiles.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });

    // Inject the JS files (Bootstrap, jQuery, etc.)
    const scripts = [
      "assets/js/lib/bootstrap.bundle.min.js",
      "assets/js/plugins/splide/splide.min.js",
      "assets/js/fontawesome.min.js",
      "assets/js/all.min.js",
      "assets/js/jquery.min.js",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
    });

    return () => {
      // Clean up when leaving the page
      cssFiles.forEach((href) => {
        const el = document.querySelector(`link[href="${href}"]`);
        if (el) el.remove();
      });
      scripts.forEach((src) => {
        const el = document.querySelector(`script[src="${src}"]`);
        if (el) el.remove();
      });
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <div class="authbody" style="background-image:url('assets/images/auth.jpg'); background-position:center; background-size:cover; height:100vh; overflow:hidden">
            <div class="appHeader no-border transparent position-absolute">
              <div class="left">
                <a href="register.html">
                  SIGN UP <i class="fas fa-sign-in-alt text-white"></i>
                </a>
              </div>
              <div class="pageTitle"></div>
              <div class="right">
                <div class="top-bar-item top-bar-item-full">
                  <select style="width: 50px; border-radius: 20px;">
                    <option value="">EN</option>
                    <option value="en|fr">FR</option>
                    <option value="en|es">ES</option>
                  </select>
                </div>
              </div>
            </div>

            <div id="appCapsule" class="cap" style="position:fixed;top:15%;left:0;right:0;width:480px;max-width:100%;margin:0 auto;">
              <div class="section mt-2 text-center">
                <img src="upload/444logo.png" width="150px" />
              </div>
              <div class="section mb-5 p-2">
                <form>
                  <div class="card" style="background:rgba(255,255,255,0.05);border:1px solid #30363d;border-radius:12px;">
                    <div class="card-body pb-1">
                      <div class="form-group basic">
                        <div class="input-wrapper">
                          <label class="label" for="email">Email or Username</label>
                          <input type="text" class="form-control" name="email" required />
                        </div>
                      </div>
                      <div class="form-group basic">
                        <div class="input-wrapper">
                          <label class="label" for="password">Password</label>
                          <input type="password" class="form-control" name="password" required />
                        </div>
                      </div>
                      <div class="form-group basic">
                        <div class="input-wrapper">
                          <a href="reset-password.html" class="text-primary">Forgot Password?</a> |
                          <a href="register.html" class="text-primary"> Register</a>
                        </div>
                      </div>
                      <input type="submit" class="btn btn-primary btn-block btn-lg" value="Sign In" />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `,
      }}
    />
  );
}

