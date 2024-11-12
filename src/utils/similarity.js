// src/utils/similarity.js

import { preprocessQuery } from './preprocessing';

// Function to calculate similarity scores
export const calculateSimilarityScores = (inputTokens, queries) => {
  return queries.map((query) => {
    const queryTokens = preprocessQuery(query.text);
    const matchingTokens = inputTokens.filter((token) =>
      queryTokens.includes(token)
    );
    const score = matchingTokens.length;
    return { query, score };
  });
};

// Function to get the top N recommendations
export const getTopRecommendations = (similarityScores, topN = 3) => {
  const sortedQueries = similarityScores
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  const topRecommendations = sortedQueries.slice(0, topN).map((item) => item.query);
  return topRecommendations;
};

// Cosine Similarity Function for Collaborative Filtering
export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};
