import React from 'react';

const QueryComponent = ({ query, onUpvote }) => {
  return (
    <li>
      {query.text} (Upvotes: {query.upvotes.length})
      <button onClick={onUpvote}>Upvote</button>
    </li>
  );
};

export default QueryComponent;
