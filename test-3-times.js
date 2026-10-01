const http = require("http");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({ status: res.statusCode, length: data.length, body: data });
      });
    }).on("error", reject);
  });
}

async function runTest() {
  console.log("==================================================");
  console.log("🚀 STARTING 3-ROUND SYSTEM VERIFICATION TEST");
  console.log("==================================================");

  const clientEndpoints = [
    { path: "/", name: "Home Page" },
    { path: "/about", name: "About Page" },
    { path: "/services", name: "Services Page" },
    { path: "/portfolio", name: "Portfolio Page" },
    { path: "/blog", name: "Blog Page" },
    { path: "/contact", name: "Contact Page" },
    { path: "/auth/login", name: "Login Page" },
    { path: "/auth/register", name: "Register Page" },
    { path: "/css/style.css", name: "Static CSS" }
  ];

  const apiEndpoints = [
    { path: "/api/health", name: "Health API" },
    { path: "/api/projects", name: "Projects API" },
    { path: "/api/services", name: "Services API" },
    { path: "/api/posts", name: "Posts API" },
    { path: "/api/testimonials", name: "Testimonials API" },
    { path: "/api/admin/dashboard", name: "Admin Dashboard API" }
  ];

  for (let round = 1; round <= 3; round++) {
    console.log(`\n--------------------------------------------------`);
    console.log(`🔄 [ROUND ${round}/3] Testing Backend API (Port 5000) & Frontend (Port 3000)`);
    console.log(`--------------------------------------------------`);

    // 1. Test Backend APIs
    for (const ep of apiEndpoints) {
      const res = await fetchUrl(`http://localhost:5000${ep.path}`);
      if (res.status !== 200) {
        throw new Error(`Round ${round}: Backend API ${ep.path} failed with status ${res.status}`);
      }
      console.log(`  [Backend API] ${ep.name} (http://localhost:5000${ep.path}) -> Status: ${res.status} OK (${res.length} bytes)`);
    }

    // 2. Test Frontend Pages (Port 3000)
    for (const page of clientEndpoints) {
      const res = await fetchUrl(`http://localhost:3000${page.path}`);
      if (res.status !== 200 || res.length < 50) {
        throw new Error(`Round ${round}: Client page ${page.path} failed with status ${res.status}`);
      }
      console.log(`  [Client View] ${page.name} (http://localhost:3000${page.path}) -> Status: ${res.status} OK (${res.length} bytes)`);
    }

    console.log(`✅ [ROUND ${round}/3] COMPLETED WITH 0 ERRORS!`);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n==================================================");
  console.log("🎉 ALL 3 ROUNDS PASSED PERFECTLY WITH ZERO ERRORS!");
  console.log("==================================================");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
