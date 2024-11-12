// src/utils/preprocessing.js

import nlp from 'compromise';

export const preprocessQuery = (query) => {
  // Convert to lowercase and remove punctuation
  let doc = nlp(query)
    .normalize({
      case: true,        // lowercase text
      punctuation: true, // remove punctuation
    });

  // Remove stop words
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
    'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of',
    'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with',
    'can', 'i', 'you', 'we', 'they', 'your', 'my', 'our',
  ]);

  let tokens = doc.terms().out('array');
  tokens = tokens.filter((token) => !stopWords.has(token));

  return tokens;
};
