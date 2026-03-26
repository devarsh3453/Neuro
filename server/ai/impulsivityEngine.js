/**
 * NeuroTrace AI Engine — Phase 3
 * Impulsivity Scoring Module
 */

/**
 * Calculates an impulsivity score between 0 and 100 based on time and correctness.
 * @param {number} totalTime - Time in seconds.
 * @param {boolean} isCorrect - Whether the answer was correct.
 * @returns {number|null} Impulsivity score or null if invalid input.
 */
function calculateImpulsivityScore(totalTime, isCorrect) {
  if (totalTime === null || totalTime === undefined || typeof totalTime !== 'number' || totalTime < 0) {
    return null;
  }
  if (isCorrect === null || isCorrect === undefined || typeof isCorrect !== 'boolean') {
    return null;
  }

  // Very fast and WRONG — classic impulsive guessing
  if (totalTime < 10 && isCorrect === false) return 95;

  // Very fast and RIGHT — could be genuine knowledge
  if (totalTime < 10 && isCorrect === true) return 30;

  // Fast and WRONG — likely rushed
  if (totalTime < 20 && isCorrect === false) return 75;

  // Fast and RIGHT — probably knows it well
  if (totalTime < 20 && isCorrect === true) return 20;

  // Moderate time and WRONG — some thought but wrong
  if (totalTime < 40 && isCorrect === false) return 50;

  // Moderate time and RIGHT — normal careful answer
  if (totalTime < 40 && isCorrect === true) return 15;

  // Slow and WRONG — struggled but still wrong
  if (totalTime >= 40 && isCorrect === false) return 35;

  // Slow and RIGHT — took their time, got it right
  if (totalTime >= 40 && isCorrect === true) return 10;

  return null;
}

/**
 * Returns a human-readable label for a given impulsivity score.
 * @param {number} score - Impulsivity score (0-100).
 * @returns {string} Label (Very High, High, Medium, Low, or Unknown).
 */
function getImpulsivityLabel(score) {
  if (score === null || score === undefined) return "Unknown";

  if (score >= 75) return "Very High";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

module.exports = {
  calculateImpulsivityScore,
  getImpulsivityLabel
};
