const db = require("../models");
const User = db.user;

// Fetch subscribed user tokens dynamically
const fetchSubscribedUserTokens = async () => {
  try {
    // Find users who enabled notifications and have a valid FCM token
    const users = await User.find({ notificationsEnabled: true });
    const tokens = users
      .map((user) => user.fcmToken) // Extract FCM tokens
      .filter((token) => token); // Exclude null/undefined tokens

    return tokens; // Return the list of valid tokens
  } catch (error) {
    console.error("Error fetching subscribed user tokens:", error);
    return [];
  }
};

module.exports = { fetchSubscribedUserTokens };
