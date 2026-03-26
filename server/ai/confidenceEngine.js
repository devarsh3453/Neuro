/**
 * NeuroTrace AI Engine — Phase 3
 * Confidence Estimation Module
 */

/**
 * Calculates a confidence score between 0 and 100 based on the number of edits.
 * @param {number} editCount - Number of times the answer was changed.
 * @returns {number|null} Confidence score or null if invalid input.
 */
function calculateConfidenceScore(editCount) {
  if (editCount === null || editCount === undefined || typeof editCount !== 'number' || editCount < 0) {
    return null;
  }

  // Answered once, never changed — very confident
  if (editCount === 0) return 95;
  
  // Changed once — slightly uncertain
  if (editCount === 1) return 75;
  
  // Changed twice — moderate uncertainty
  if (editCount === 2) return 55;
  
  // Changed 3 times — low confidence
  if (editCount === 3) return 35;
  
  // Changed 4 times — very low confidence
  if (editCount === 4) return 20;
  
  // Changed 5+ times — extremely unconfident
  return 10;
}

/**
 * Returns a human-readable label for a given confidence score.
 * @param {number} score - Confidence score (0-100).
 * @returns {string} Label (High, Medium, Low, Very Low, or Unknown).
 */
function getConfidenceLabel(score) {
  if (score === null || score === undefined) return "Unknown";

  if (score >= 75) return "High";
  if (score >= 40) return "Medium";
  if (score >= 15) return "Low";
  return "Very Low";
}

module.exports = {
  calculateConfidenceScore,
  getConfidenceLabel
};
