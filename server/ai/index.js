// NeuroTrace AI Engine — Phase 3

const { 
  calculateHesitationScore, 
  getHesitationLabel 
} = require('./hesitationEngine');

const {
  calculateConfidenceScore,
  getConfidenceLabel
} = require('./confidenceEngine');

const {
  calculateImpulsivityScore,
  getImpulsivityLabel
} = require('./impulsivityEngine');

const {
  calculateReasoningScore,
  getReasoningLabel
} = require('./reasoningEngine');

const {
  classifyCognitivePattern,
  getPatternDescription
} = require('./patternClassifier');

const {
  generateFeedback
} = require('./feedbackEngine');

module.exports = {
  calculateHesitationScore,
  getHesitationLabel,
  calculateConfidenceScore,
  getConfidenceLabel,
  calculateImpulsivityScore,
  getImpulsivityLabel,
  calculateReasoningScore,
  getReasoningLabel,
  classifyCognitivePattern,
  getPatternDescription,
  generateFeedback
};
