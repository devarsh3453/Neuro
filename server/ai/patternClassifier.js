/**
 * NeuroTrace AI Engine — Phase 3
 * Cognitive Pattern Classifier
 */

/**
 * Classifies a student's cognitive pattern based on modular scores.
 * Checks patterns in a specific order and returns the first match.
 * 
 * @param {number} hesitationScore 
 * @param {number} confidenceScore 
 * @param {number} impulsivityScore 
 * @param {number} reasoningScore 
 * @returns {string} Pattern identifier.
 */
function classifyCognitivePattern(hesitationScore, confidenceScore, impulsivityScore, reasoningScore) {
  if (hesitationScore === null && confidenceScore === null && impulsivityScore === null && reasoningScore === null) {
    return "insufficient-data";
  }

  // Strong understanding — knows the material well
  if (confidenceScore >= 75 && impulsivityScore <= 30 && reasoningScore >= 50) {
    return "strong-understanding";
  }

  // Careful thinker — takes time, gets it right
  if (hesitationScore >= 55 && confidenceScore >= 55 && impulsivityScore <= 30) {
    return "careful-thinker";
  }

  // Guessing — fast, wrong, low reasoning
  if (impulsivityScore >= 75 && reasoningScore !== null && reasoningScore <= 30) {
    return "guessing";
  }

  // Struggling — high hesitation, low confidence
  if (hesitationScore >= 70 && confidenceScore <= 55) {
    return "struggling";
  }

  // Low confidence — keeps changing answers
  if (confidenceScore <= 35 && impulsivityScore <= 50) {
    return "low-confidence";
  }

  // Rushing — fast answers, not thinking enough
  if (impulsivityScore >= 50 && hesitationScore <= 40) {
    return "rushing";
  }


  // Default fallback
  return "needs-review";
}

/**
 * Returns a human-readable description for a given cognitive pattern.
 * @param {string} cognitivePattern 
 * @returns {string} Description.
 */
function getPatternDescription(cognitivePattern) {
  switch (cognitivePattern) {
    case "strong-understanding":
      return "You clearly understand this topic. Your answers are confident, well-reasoned, and not rushed.";
    case "careful-thinker":
      return "You take your time before answering and show good confidence. This is a strong learning style.";
    case "guessing":
      return "Your response pattern suggests guessing. Try reading the question carefully before selecting an answer.";
    case "low-confidence":
      return "You seem unsure of your answers and revise them often. Review this topic to build stronger foundations.";
    case "rushing":
      return "You are answering too quickly without fully thinking through the problem. Slow down and read carefully.";
    case "struggling":
      return "This topic seems challenging for you. Consider revisiting the fundamentals and asking for help.";
    case "needs-review":
      return "Your response pattern needs further analysis. Keep practicing this topic.";
    case "insufficient-data":
      return "Not enough data to determine a cognitive pattern for this attempt.";
    default:
      return "Pattern not recognised.";
  }
}

module.exports = {
  classifyCognitivePattern,
  getPatternDescription
};
