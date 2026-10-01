require("dotenv").config();
const { connectDB } = require("./config/database");
const { User, Service, Project, Post, Testimonial, Contact } = require("./models");
const mongoose = require("mongoose");

async function runFourLoopTest() {
  console.log("==================================================");
  console.log("🚀 Starting MongoDB Atlas 4-Loop Connection & Operations Check");
  console.log("==================================================");

  try {
    await connectDB();
    console.log("Connected to MongoDB successfully. Now initiating 4-round verification...\n");

    for (let round = 1; round <= 4; round++) {
      console.log(`--- [ROUND ${round}/4] Testing Connection & Queries ---`);
      
      const readyState = mongoose.connection.readyState;
      const states = ["disconnected", "connected", "connecting", "disconnecting"];
      console.log(`Round ${round}: Connection ReadyState = ${readyState} (${states[readyState] || "unknown"})`);
      if (readyState !== 1) {
        throw new Error(`Round ${round} failed: MongoDB is not connected (readyState: ${readyState})`);
      }

      // Check ping on the database
      const adminDb = mongoose.connection.db.admin();
      const pingResult = await adminDb.ping();
      console.log(`Round ${round}: Ping response:`, pingResult);

      // Verify queries on all collections
      const [uCount, sCount, pCount, postCount, tCount, cCount] = await Promise.all([
        User.countDocuments(),
        Service.countDocuments(),
        Project.countDocuments(),
        Post.countDocuments(),
        Testimonial.countDocuments(),
        Contact.countDocuments(),
      ]);

      console.log(`Round ${round}: Verified Counts => Users: ${uCount}, Services: ${sCount}, Projects: ${pCount}, Posts: ${postCount}, Testimonials: ${tCount}, Contacts: ${cCount}`);

      // Verify a write and cleanup operation in each loop
      const testDoc = await Contact.create({
        name: `Test Runner Round ${round}`,
        email: `test_round_${round}@example.com`,
        subject: `Verification Round ${round}`,
        message: `Self-check message round ${round}`,
        status: "test"
      });

      await Contact.findByIdAndDelete(testDoc._id);
      console.log(`Round ${round}: CRUD write + delete self-check passed!`);
      console.log(`✅ [ROUND ${round}/4] PASSED WITHOUT ERROR\n`);

      // Small pause between loops to test stability over time
      await new Promise(res => setTimeout(res, 1000));
    }

    console.log("==================================================");
    console.log("🎉 ALL 4 ROUNDS COMPLETED SUCCESSFULLY WITH 0 ERRORS!");
    console.log("==================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test verification failed with error:", err);
    process.exit(1);
  }
}

runFourLoopTest();
