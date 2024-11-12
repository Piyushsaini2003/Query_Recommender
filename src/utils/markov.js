// src/utils/markov.js

import { preprocessQuery } from './preprocessing';

export const buildTransitionMatrix = (preprocessedQueries) => {
  const transitions = {};
  preprocessedQueries.forEach(query => {
    const tokens = query.split(' ');
    tokens.forEach((token, index) => {
      if (index < tokens.length - 1) {
        const currentWord = token;
        const nextWord = tokens[index + 1];
        if (!transitions[currentWord]) transitions[currentWord] = {};
        if (!transitions[currentWord][nextWord]) transitions[currentWord][nextWord] = 0;
        transitions[currentWord][nextWord] += 1;
      }
    });
  });
  return transitions;
};

export const calculateProbabilities = (transitions) => {
  const transitionMatrix = {};
  Object.keys(transitions).forEach(currentWord => {
    const nextWords = transitions[currentWord];
    const total = Object.values(nextWords).reduce((sum, count) => sum + count, 0);
    transitionMatrix[currentWord] = {};
    Object.keys(nextWords).forEach(nextWord => {
      transitionMatrix[currentWord][nextWord] = nextWords[nextWord] / total;
    });
  });
  return transitionMatrix;
};

export const predictRelatedQueries = (inputQuery, transitionMatrix, allQueries) => {
  const tokens = preprocessQuery(inputQuery).split(' ');
  const lastWord = tokens[tokens.length - 1];
  const nextWords = transitionMatrix[lastWord];
  if (!nextWords) return [];
  const sortedNextWords = Object.entries(nextWords).sort((a, b) => b[1] - a[1]);
  const suggestions = sortedNextWords.map(([word]) => tokens.concat(word).join(' '));
  // Match suggestions with existing queries
  const matches = allQueries.filter(query => {
    const preprocessedQuery = preprocessQuery(query.text);
    return suggestions.some(suggestion => preprocessedQuery.includes(suggestion));
  });
  return matches.slice(0, 3);
};
