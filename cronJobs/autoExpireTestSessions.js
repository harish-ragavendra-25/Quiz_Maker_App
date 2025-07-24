const cron = require('node-cron');
const testSessionModel = require('../models/testSessionModel');

const autoExpireTestSessions = () => {
  cron.schedule('*/10 * * * * *', async () => {
    const now = new Date();

    try {
      const result = await testSessionModel.updateMany(
        {
          endTime: { $lt: now },
          status: 'pending'
        },
        {
          $set: {
            status: 'expired',
            submittedAt: now,
            durationTaken: 0,
            score: 0
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[${now.toISOString()}] 🔒 Auto-expired ${result.modifiedCount} sessions`);
      }

    } catch (err) {
      console.error('🚨 CRON job error:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
};

module.exports = autoExpireTestSessions;