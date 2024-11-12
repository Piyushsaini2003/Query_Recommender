// src/components/QueryRecommendation.js

import React from 'react';

const QueryRecommendation = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return <p className="no-recommendations">No recommendations at this time.</p>;
  }

  return (
    <div className="query-list">
      {recommendations.map((query, index) => (
        <div className="query-item" key={index}>
          <p>{query.text}</p>
          <p>Upvotes: {query.upvotes}</p>
        </div>
      ))}
    </div>
  );
};

export default QueryRecommendation;
