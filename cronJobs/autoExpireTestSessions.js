const cron = require('node-cron');
const testSessionModel = require('../models/testSessionModel');
const questionModel = require('../models/questionModel');

const autoExpireTestSessions = () => {
  cron.schedule("*/10 * * * * *", async () => {
  console.log("⏰ Auto-submitting expired test sessions..."); 

  try {
    const expiredSessions = await testSessionModel.find({
      status: "pending",
      endTime: { $lte: new Date() }
    });

    for (const session of expiredSessions) {
      session.status = "completed";
      session.submittedAt = new Date();
      session.durationTaken = Math.floor((session.submittedAt - session.startedAt) / 60000);

      await session.save();
      console.log(`✅ Auto-submitted TestSession ${session._id}`);
    }
  } catch (err) {
      console.error("❌ Auto-submission error:", err);
    }
});
};

module.exports = autoExpireTestSessions;