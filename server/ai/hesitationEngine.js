/**
 * NeuroTrace AI Engine — Phase 3
 * Hesitation Detection Module
 */

/**
 * Calculates a hesitation score between 0 and 100 based on the time to first input.
 * @param {number} timeToFirstInput - Time in milliseconds.
 * @returns {number|null} Hesitation score or null if invalid input.
 */
function calculateHesitationScore(timeToFirstInput) {
  if (timeToFirstInput === null || timeToFirstInput === undefined || typeof timeToFirstInput !== 'number') {
    return null;
  }

  // Very fast, no hesitation
  if (timeToFirstInput <= 1000) return 10;
  
  // Quick response
  if (timeToFirstInput <= 2000) return 25;
  
  // Slight hesitation
  if (timeToFirstInput <= 3000) return 40;
  
  // Moderate hesitation
  if (timeToFirstInput <= 5000) return 55;
  
  // Notable hesitation
  if (timeToFirstInput <= 8000) return 70;
  
  // High hesitation
  if (timeToFirstInput <= 12000) return 85;
  
  // Very high hesitation
  return 100;
}

/**
 * Returns a human-readable label for a given hesitation score.
 * @param {number} score - Hesitation score (0-100).
 * @returns {string} Label (Low, Medium, High, Very High, or Unknown).
 */
function getHesitationLabel(score) {
  if (score === null || score === undefined) return "Unknown";

  if (score <= 25) return "Low";
  if (score <= 55) return "Medium";
  if (score <= 85) return "High";
  return "Very High";
}

module.exports = {
  calculateHesitationScore,
  getHesitationLabel
};
