// src/utils/userQueries.js

export const buildUserQueriesMap = (userUpvotes) => {
  const userQueries = {};
  userUpvotes.forEach(({ userId, queryText, upvote }) => {
    if (!userQueries[userId]) {
      userQueries[userId] = [];
    }
    userQueries[userId].push({ text: queryText, upvote });
  });
  return userQueries;
};
