// src/components/QueryList.js

import React from 'react';

const QueryList = ({ queries, onUpvote, currentUserId }) => {
  if (!queries || queries.length === 0) {
    return <p>No queries available.</p>;
  }

  return (
    <div className="query-list">
      {queries.map((query, index) => (
        <div className="query-item" key={index}>
          <p>{query.text}</p>
          <p>Upvotes: {query.upvotes}</p>
          <button onClick={() => onUpvote(query.text)}>Upvote</button>
        </div>
      ))}
    </div>
  );
};

export default QueryList;
