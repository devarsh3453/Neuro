/**
 * NeuroTrace AI Engine — Phase 3
 * Reasoning Score Module (Cosine Similarity)
 */

// Unused dependency removed for Jest compatibility
const stopword = require('stopword');

/**
 * Tokenizes text, removes punctuation, and filters out stopwords.
 * @param {string} text 
 * @returns {string[]} Cleaned array of words.
 */
function tokenize(text) {
  if (!text) return [];
  
  // Lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  // Remove stopwords
  return stopword.removeStopwords(words);
}

/**
 * Builds a Term Frequency (TF) vector for a given words array against a vocabulary.
 * @param {string[]} words 
 * @param {string[]} vocabulary 
 * @returns {number[]} TF vector.
 */
function buildTFVector(words, vocabulary) {
  const totalWords = words.length;
  if (totalWords === 0) return new Array(vocabulary.length).fill(0);

  return vocabulary.map(vocabWord => {
    const count = words.filter(w => w === vocabWord).length;
    return count / totalWords;
  });
}

/**
 * Calculates the cosine similarity between two numeric vectors.
 * @param {number[]} vec1 
 * @param {number[]} vec2 
 * @returns {number} Similarity (0 to 1).
 */
function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;

  return dotProduct / (mag1 * mag2);
}

/**
 * Evaluates the reasoning score of a student's text compared to an ideal text.
 * @param {string} studentText 
 * @param {string} idealText 
 * @returns {number|null} Reasoning score (0-100) or null.
 */
function calculateReasoningScore(studentText, idealText) {
  if (!studentText || !idealText) return null;

  const studentTokens = tokenize(studentText);
  const idealTokens = tokenize(idealText);

  // Too short to evaluate meaningfully
  if (studentTokens.length < 3) return 5;

  // Build vocabulary (unique tokens from both)
  const vocabulary = Array.from(new Set([...studentTokens, ...idealTokens]));

  // Build TF vectors
  const studentVector = buildTFVector(studentTokens, vocabulary);
  const idealVector = buildTFVector(idealTokens, vocabulary);

  // Calculate similarity
  const similarity = cosineSimilarity(studentVector, idealVector);

  return Math.round(similarity * 100);
}

/**
 * Returns a human-readable label for a given reasoning score.
 * @param {number} score 
 * @returns {string} Label (Strong, Good, Partial, Weak, or Not Provided).
 */
function getReasoningLabel(score) {
  if (score === null || score === undefined) return "Not Provided";

  if (score >= 75) return "Strong";
  if (score >= 50) return "Good";
  if (score >= 25) return "Partial";
  return "Weak";
}

module.exports = {
  calculateReasoningScore,
  getReasoningLabel
};
