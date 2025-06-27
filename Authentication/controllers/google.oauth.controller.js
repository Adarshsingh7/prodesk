const router = require("express").Router();
const passport = require("passport");
const session = require("express-session");

require("../config/passport");

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

router.use(passport.initialize());
router.use(passport.session());

router.get("/", (req, res) => {
  // res.send(`<a href="/auth/google">Login with Google</a>`);
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - Welcome Back</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
          <!-- Login Card -->
          <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <!-- Header -->
              <div class="text-center space-y-2">
                  <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
                  <p class="text-gray-500">Sign in to your account</p>
              </div>

              <!-- Google Login Button -->
              <a href="/auth/google">
                <button class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
              </a>

              <!-- Divider -->
              <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-300"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                      <span class="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
              </div>

              <!-- Email/Password Form -->
              <form class="space-y-4">
                  <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your email"
                      >
                  </div>

                  <div>
                      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                          type="password"
                          id="password"
                          name="password"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your password"
                      >
                  </div>

                  <!-- Remember me & Forgot password -->
                  <div class="flex items-center justify-between text-sm">
                      <label class="flex items-center">
                          <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                          <span class="ml-2 text-gray-600">Remember me</span>
                      </label>
                      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">Forgot password?</a>
                  </div>

                  <!-- Sign In Button -->
                  <button
                      type="submit"
                      class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                      Sign in
                  </button>
              </form>

              <!-- Sign up link -->
              <div class="text-center text-sm text-gray-600">
                  Don't have an account?
                  <a href="#" class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Sign up</a>
              </div>
          </div>
      </div>

      <script>
          // Simple form handling
          document.querySelector('form').addEventListener('submit', function(e) {
              e.preventDefault();
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;

              if (email && password) {
                  alert('Login functionality would be implemented here');
              }
          });

          // Google login handler
          document.querySelector('button[class*="Google"]').addEventListener('click', function() {
              alert('Google OAuth would be implemented here');
          });
      </script>
  </body>
  </html>`);
});

// Auth Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback Route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  },
);

// Profile Route (Protected)
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  console.log(req.user);
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile - ${req.user.displayName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <img
                            src="${req.user.photos[0].value}"
                            alt="${req.user.displayName}"
                            class="w-8 h-8 rounded-full"
                        >
                        <span class="text-sm font-medium text-gray-700">${req.user.displayName}</span>
                        <button class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <!-- Profile Header -->
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                <div class="px-6 pb-6">
                    <div class="flex items-center -mt-16">
                        <img
                            src="${req.user.photos[0].value}"
                            alt="${req.user.displayName}"
                            class="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                        >
                        <div class="ml-6 mt-16">
                            <h1 class="text-2xl font-bold text-gray-900">${req.user.displayName}</h1>
                            <p class="text-gray-600">${req.user.emails[0].value}</p>
                            <div class="flex items-center mt-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                    Email Verified
                                </span>
                                <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ${req.user.provider.charAt(0).toUpperCase() + req.user.provider.slice(1)} Account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Information Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Personal Information -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Personal Information
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Full Name</label>
                            <p class="mt-1 text-sm text-gray-900">${req.user.displayName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">First Name</label>
                            <p class="mt-1 text-sm text-gray-900">${req.user.name.givenName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Last Name</label>
                            <p class="mt-1 text-sm text-gray-900">${req.user.name.familyName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">User ID</label>
                            <p class="mt-1 text-sm text-gray-900 font-mono">${req.user.id}</p>
                        </div>
                    </div>
                </div>

                <!-- Account Information -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Account Information
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email Address</label>
                            <p class="mt-1 text-sm text-gray-900">${req.user.emails[0].value}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email Status</label>
                            <p class="mt-1 text-sm">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.user.emails[0].verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}">
                                    ${req.user.emails[0].verified ? "Verified" : "Not Verified"}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Authentication Provider</label>
                            <p class="mt-1 text-sm text-gray-900 capitalize">${req.user.provider}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <div class="mt-1 flex items-center space-x-3">
                                <img
                                    src="${req.user.photos[0].value}"
                                    alt="${req.user.displayName}"
                                    class="w-10 h-10 rounded-full"
                                >
                                <a
                                    href="${req.user.photos[0].value}"
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200"
                                >
                                    View Full Size
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Raw Data Section (for debugging) -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    Raw Profile Data
                </h2>
                <div class="bg-gray-50 rounded-lg p-4">
                    <pre class="text-xs text-gray-700 overflow-x-auto"><code>${JSON.stringify(req.user._json, null, 2)}</code></pre>
                </div>
            </div>
        </div>

        <script>
            // Add some interactivity
            document.querySelector('button[class*="Logout"]').addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    // In a real app, this would redirect to logout endpoint
                    alert('Logout functionality would be implemented here');
                }
            });

            // Profile picture click handler
            document.querySelectorAll('img[alt="${req.user.displayName}"]').forEach(img => {
                img.addEventListener('click', function() {
                    window.open(this.src, '_blank');
                });
            });
        </script>
    </body>
    </html>`,
  );
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
