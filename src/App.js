// src/App.js

import React, { useState, useEffect } from 'react';
import QueryForm from './components/QueryForm';
import QueryRecommendation from './components/QueryRecommendation';
import QueryList from './components/QueryList';
import UserLogin from './components/UserLogin';
import LoadingScreen from './components/LoadingScreen'; // Import the LoadingScreen component
import { queries as initialQueries } from './data/queries';
import {
  buildUserItemMatrix,
  findSimilarUsers,
  recommendQueries,
} from './utils/collaborativeFiltering';
import { preprocessQuery } from './utils/preprocessing';
import {
  calculateSimilarityScores,
  getTopRecommendations,
} from './utils/similarity';
import './styles.css'; // Import your global styles

function App() {
  // State variables
  const [queries, setQueries] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [contentBasedRecommendations, setContentBasedRecommendations] = useState([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New state for loading screen

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const storedQueries = localStorage.getItem('queries');
      let queriesData = initialQueries;
      if (storedQueries) {
        try {
          const parsedQueries = JSON.parse(storedQueries);
          if (Array.isArray(parsedQueries) && parsedQueries.length > 0) {
            queriesData = parsedQueries;
          }
        } catch (error) {
          console.error('Error parsing stored queries:', error);
        }
      }
      setQueries(queriesData);

      const storedUpvotes = localStorage.getItem('userUpvotes');
      let upvotesData = [];
      if (storedUpvotes) {
        try {
          const parsedUpvotes = JSON.parse(storedUpvotes);
          if (Array.isArray(parsedUpvotes)) {
            upvotesData = parsedUpvotes;
          }
        } catch (error) {
          console.error('Error parsing stored upvotes:', error);
        }
      }
      setUserUpvotes(upvotesData);
    };

    loadData();
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('queries', JSON.stringify(queries));
  }, [queries]);

  useEffect(() => {
    localStorage.setItem('userUpvotes', JSON.stringify(userUpvotes));
  }, [userUpvotes]);

  // Generate collaborative recommendations when data and userId are available
  useEffect(() => {
    if (currentUserId && queries.length > 0) {
      generateCollaborativeRecommendations(currentUserId);
    }
  }, [currentUserId, userUpvotes, queries]);

  // Handle user login
  const handleLogin = (userId) => {
    setCurrentUserId(userId);
    setMessage('');
    // Clear recommendations
    setContentBasedRecommendations([]);
    setCollaborativeRecommendations([]);
  };

  // Handle user logout
  const handleLogout = () => {
    setCurrentUserId('');
    setContentBasedRecommendations([]);
    setCollaborativeRecommendations([]);
    setMessage('');
  };

  // Handle query submission
  const handleQuerySubmit = (query) => {
    const userId = currentUserId;

    // Check if the query already exists (case-insensitive)
    if (!queries.some((q) => q.text.toLowerCase() === query.toLowerCase())) {
      const newQuery = { text: query, upvotes: 0 };
      setQueries((prevQueries) => [...prevQueries, newQuery]);
      setMessage('Your query has been submitted.');
    } else {
      setMessage('');
    }

    // Update user upvotes
    if (!userUpvotes.some((u) => u.userId === userId && u.queryText.toLowerCase() === query.toLowerCase())) {
      setUserUpvotes((prevUserUpvotes) => [
        ...prevUserUpvotes,
        { userId, queryText: query, upvote: 1 },
      ]);
    }

    // Generate content-based recommendations
    generateContentBasedRecommendations(query);
  };

  // Handle upvoting queries
  const handleUpvote = (queryText) => {
    if (!currentUserId) {
      alert('Please log in to upvote queries.');
      return;
    }

    // Check if the current user has already upvoted this query
    const hasUserUpvoted = userUpvotes.some(
      (upvote) =>
        upvote.userId === currentUserId && upvote.queryText.toLowerCase() === queryText.toLowerCase()
    );

    if (!hasUserUpvoted) {
      // Update the queries upvotes
      setQueries((prevQueries) =>
        prevQueries.map((query) => {
          if (query.text.toLowerCase() === queryText.toLowerCase()) {
            return { ...query, upvotes: query.upvotes + 1 };
          } else {
            return query;
          }
        })
      );

      // Add the upvote to userUpvotes
      setUserUpvotes((prevUserUpvotes) => [
        ...prevUserUpvotes,
        { userId: currentUserId, queryText: queryText, upvote: 1 },
      ]);
    } else {
      alert('You have already upvoted this query.');
    }
  };

  // Generate content-based recommendations
  const generateContentBasedRecommendations = (inputQuery) => {
    if (queries.length === 0) {
      setContentBasedRecommendations([]);
      return;
    }

    const inputTokens = preprocessQuery(inputQuery);
    const similarityScores = calculateSimilarityScores(inputTokens, queries);
    const topRecommendations = getTopRecommendations(similarityScores);
    setContentBasedRecommendations(topRecommendations);
  };

  // Generate recommendations using collaborative filtering
  const generateCollaborativeRecommendations = (userId) => {
    const userQueries = userUpvotes.filter(
      (upvote) => upvote.userId === userId
    );

    if (userQueries.length < 4) {
      // For new users, we might not have enough data for collaborative filtering
      setCollaborativeRecommendations([]);
    } else {
      // Use Collaborative Filtering
      const { matrix, users, items } = buildUserItemMatrix(userUpvotes, queries);
      const similarUsers = findSimilarUsers(userId, matrix, users).slice(0, 3);
      const recommendations = recommendQueries(
        userId,
        matrix,
        similarUsers,
        queries,
        users,
        items
      );
      setCollaborativeRecommendations(recommendations);
    }
  };

  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Sort queries in descending order of upvotes
  const sortedQueries = [...queries].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="App">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : !currentUserId ? (
        <UserLogin onLogin={handleLogin} />
      ) : (
        <>
          {/* Header */}
          <div className="header">
            <p>Welcome, {currentUserId}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {/* Main content container */}
          <div className="main-content">
            <div className="glass-container">
              {/* Center the QueryForm */}
              <QueryForm onSubmit={handleQuerySubmit} />

              {/* Update the message display */}
              {message && <p className="submission-message">{message}</p>}

              {/* Display Content-Based Recommendations */}
              <div className="section">
                <h2>Recommended Queries</h2>
                <QueryRecommendation recommendations={contentBasedRecommendations} />
              </div>

              {/* Display Collaborative Filtering Recommendations */}
              <div className="section">
                <h2>Queries That You May Like</h2>
                <QueryRecommendation recommendations={collaborativeRecommendations} />
              </div>

              {/* All Queries */}
              <div className="section">
                <h2>All Queries</h2>
                <QueryList
                  queries={sortedQueries}
                  onUpvote={handleUpvote}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;