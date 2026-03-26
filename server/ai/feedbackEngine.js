/**
 * NeuroTrace AI Engine — Phase 3
 * Personalized Feedback Generator
 */

/**
 * Generates personalized feedback based on performance metrics and cognitive patterns.
 * 
 * @param {Object} data 
 * @param {boolean} data.isCorrect
 * @param {string} data.cognitivePattern
 * @param {number} data.hesitationScore
 * @param {number} data.confidenceScore
 * @param {number} data.impulsivityScore
 * @param {number} data.reasoningScore
 * @param {string} data.questionSubject
 * @returns {string} Feedback string.
 */
function generateFeedback({
  isCorrect,
  cognitivePattern,
  hesitationScore,
  confidenceScore,
  impulsivityScore,
  reasoningScore,
  questionSubject
}) {
  if (!cognitivePattern || cognitivePattern === "insufficient-data") {
    return "Complete more attempts to receive personalised feedback.";
  }

  // PART 1 — Opening
  let opening = isCorrect 
    ? "Great work getting this right! " 
    : "This one was tricky, but every attempt helps you learn. ";

  // PART 2 — Insight
  let insight = "";
  switch (cognitivePattern) {
    case "strong-understanding":
      insight = "You showed strong understanding with a confident, well-reasoned response. ";
      break;
    case "careful-thinker":
      insight = "You approached this carefully and thoughtfully, which is a great habit. ";
      break;
    case "guessing":
      insight = "Your response pattern suggests you may have guessed on this one. ";
      break;
    case "low-confidence":
      insight = "You revised your answer several times, which suggests some uncertainty. ";
      break;
    case "rushing":
      insight = "You answered very quickly — make sure you are reading the full question. ";
      break;
    case "struggling":
      insight = "This question seemed challenging based on your response pattern. ";
      break;
    case "needs-review":
      insight = "Your response pattern on this question needs further review. ";
      break;
  }

  // PART 3 — Advice
  let advice = "";
  if (reasoningScore !== null && reasoningScore >= 70) {
    advice = "Your reasoning was excellent — keep explaining your thinking like this.";
  } else if (reasoningScore !== null && reasoningScore >= 40) {
    advice = "Your reasoning shows partial understanding. Try to be more detailed in your explanations.";
  } else if (impulsivityScore >= 75) {
    advice = "Try slowing down — take at least 15 seconds to read and think before answering.";
  } else if (confidenceScore <= 20) {
    advice = `Review ${questionSubject} fundamentals to build more confidence on this topic.`;
  } else if (hesitationScore >= 85) {
    advice = "It is okay to take your time — trust your knowledge and commit to an answer.";
  } else if (reasoningScore !== null && reasoningScore < 40) {
    advice = "Practice explaining WHY your answer is correct — reasoning is a key part of deep learning.";
  } else {
    advice = `Keep practising ${questionSubject} to strengthen your understanding.`;
  }

  return `${opening}${insight}${advice}`;
}

module.exports = {
  generateFeedback
};
