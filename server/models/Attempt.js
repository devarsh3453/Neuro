const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },

  // Behavioral tracking fields (captured by frontend)
  timeToFirstInput: { type: Number, default: 0 }, // ms before student first typed/clicked
  editCount:        { type: Number, default: 0 }, // how many times student changed their answer
  totalTime:        { type: Number, default: 0 }, // total seconds spent on the question

  finalAnswer:   { type: String,  required: true },
  isCorrect:     { type: Boolean, required: true },
  reasoningText: { type: String,  default: '' },  // student's optional explanation of thinking

  // Cognitive analysis fields (populated by AI engine in Phase 3 — null until then)
  hesitationScore:  { type: Number, default: null },
  confidenceScore:  { type: Number, default: null },
  impulsivityScore: { type: Number, default: null },
  reasoningScore:   { type: Number, default: null },
  cognitivePattern: { type: String, default: null }, // 'guessing' | 'careful' | 'low-confidence' | 'strong-understanding'
  feedback:         { type: String, default: null },

  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', attemptSchema);
