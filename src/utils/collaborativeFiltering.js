// src/utils/collaborativeFiltering.js

import { cosineSimilarity } from './similarity';

// Build User-Item Matrix
export const buildUserItemMatrix = (userUpvotes, queries) => {
  const users = Array.from(new Set(userUpvotes.map((u) => u.userId)));
  const items = queries.map((q) => q.text);

  const matrix = users.map((userId) => {
    return items.map((item) => {
      return userUpvotes.some(
        (upvote) =>
          upvote.userId === userId && upvote.queryText.toLowerCase() === item.toLowerCase()
      )
        ? 1
        : 0;
    });
  });

  return { matrix, users, items };
};

// Find Similar Users
export const findSimilarUsers = (currentUserId, matrix, users) => {
  const currentUserIndex = users.indexOf(currentUserId);
  const currentUserVector = matrix[currentUserIndex];

  const similarities = users.map((userId, index) => {
    if (userId !== currentUserId) {
      const similarity = cosineSimilarity(currentUserVector, matrix[index]);
      return { userId, similarity };
    } else {
      return null;
    }
  });

  return similarities
    .filter((item) => item !== null)
    .sort((a, b) => b.similarity - a.similarity);
};

// Recommend Queries
export const recommendQueries = (currentUserId, matrix, similarUsers, queries, users, items) => {
  const currentUserIndex = users.indexOf(currentUserId);
  const currentUserVector = matrix[currentUserIndex];

  const recommendations = [];

  similarUsers.forEach((user) => {
    const userIndex = users.indexOf(user.userId);
    const userVector = matrix[userIndex];

    userVector.forEach((value, itemIndex) => {
      if (value === 1 && currentUserVector[itemIndex] === 0) {
        const queryText = items[itemIndex];
        if (!recommendations.some((q) => q.text.toLowerCase() === queryText.toLowerCase())) {
          recommendations.push(queries.find((q) => q.text.toLowerCase() === queryText.toLowerCase()));
        }
      }
    });
  });

  return recommendations.slice(0, 3); // Return top 3 recommendations
};
