const { 
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
} = require('./index');

console.log('--- Hesitation Detection Module Test ---');
const hesitationTests = [
  { input: 500,   expected: 10  },
  { input: 1500,  expected: 25  },
  { input: 2500,  expected: 40  },
  { input: 4000,  expected: 55  },
  { input: 6000,  expected: 70  },
  { input: 10000, expected: 85  },
  { input: 15000, expected: 100 },
  { input: null,  expected: null},
];
hesitationTests.forEach(({ input, expected }) => {
  const score = calculateHesitationScore(input);
  const label = getHesitationLabel(score);
  const status = score === expected ? 'PASSED' : 'FAILED';
  console.log(`Input: ${input === null ? 'null' : input + 'ms'} → Score: ${score} → Label: ${label} → Test ${status}`);
});

console.log("\n--- Confidence Estimation Module Test ---");
const confidenceTests = [
  { input: 0, expected: 95 },
  { input: 1, expected: 75 },
  { input: 2, expected: 55 },
  { input: 3, expected: 35 },
  { input: 4, expected: 20 },
  { input: 5, expected: 10 },
  { input: 7, expected: 10 },
  { input: null, expected: null },
  { input: -1, expected: null },
];
confidenceTests.forEach(({ input, expected }) => {
  const score = calculateConfidenceScore(input);
  const label = getConfidenceLabel(score);
  const status = score === expected ? 'PASSED' : 'FAILED';
  console.log(`EditCount: ${input === null ? 'null' : input} → Score: ${score} → Label: ${label} → Test ${status}`);
});

console.log("\n--- Impulsivity Scoring Module Test ---");
const impulsivityTests = [
  { time: 5,   correct: false, expected: 95 },
  { time: 5,   correct: true,  expected: 30 },
  { time: 15,  correct: false, expected: 75 },
  { time: 15,  correct: true,  expected: 20 },
  { time: 30,  correct: false, expected: 50 },
  { time: 30,  correct: true,  expected: 15 },
  { time: 60,  correct: false, expected: 35 },
  { time: 60,  correct: true,  expected: 10 },
  { time: null, correct: true, expected: null },
  { time: 10,  correct: null,  expected: null },
  { time: -5,  correct: true,  expected: null },
];
impulsivityTests.forEach(({ time, correct, expected }) => {
  const score = calculateImpulsivityScore(time, correct);
  const label = getImpulsivityLabel(score);
  const status = score === expected ? 'PASSED' : 'FAILED';
  console.log(`Time: ${time === null ? 'null' : time}s | Correct: ${correct} → Score: ${score} → Label: ${label} → Test ${status}`);
});

console.log("\n--- Reasoning Score Module Test ---");
const idealText = "Binary search works by repeatedly dividing the search space in half. Each step eliminates half the remaining elements, so the number of steps grows logarithmically with input size, giving O(log n) complexity.";
const reasoningTests = [
  { label: "Strong match", student: "Binary search divides the search space in half each time, eliminating half the elements, which gives logarithmic O(log n) complexity", minExpected: 60 },
  { label: "Partial match", student: "Binary search is faster than linear search because it splits the array", minExpected: 20 },
  { label: "Weak match", student: "I guessed the answer", minExpected: 0 },
  { label: "Too short", student: "log n", expected: 5 },
  { label: "Empty string", student: "", expected: null },
  { label: "Null input", student: null, expected: null },
];
reasoningTests.forEach((t) => {
  const score = calculateReasoningScore(t.student, idealText);
  const label = getReasoningLabel(score);
  let status = 'FAILED';
  if (t.expected !== undefined) status = score === t.expected ? 'PASSED' : 'FAILED';
  else if (t.minExpected !== undefined) status = score >= t.minExpected ? 'PASSED' : 'FAILED';
  console.log(`Label: ${t.label} → Score: ${score} → Label: ${label} → Test ${status}`);
});

console.log("\n--- Cognitive Pattern Classifier Test ---");
const patternTests = [
  { label: "Strong understanding", h: 25, c: 95, i: 10, r: 80, expected: "strong-understanding" },
  { label: "Careful thinker", h: 70, c: 75, i: 20, r: 45, expected: "careful-thinker" },
  { label: "Guessing", h: 10, c: 55, i: 95, r: 15, expected: "guessing" },
  { label: "Low confidence", h: 40, c: 20, i: 30, r: 40, expected: "low-confidence" },
  { label: "Rushing", h: 25, c: 55, i: 75, r: 35, expected: "rushing" },
  { label: "Struggling", h: 85, c: 35, i: 40, r: 20, expected: "struggling" },
  { label: "Insufficient data", h: null, c: null, i: null, r: null, expected: "insufficient-data" },
];
patternTests.forEach((t) => {
  const pattern = classifyCognitivePattern(t.h, t.c, t.i, t.r);
  const description = getPatternDescription(pattern);
  const status = pattern === t.expected ? "PASSED" : "FAILED";
  console.log(`Label: ${t.label} → Pattern: ${pattern} → Test ${status}`);
});

console.log("\n--- Feedback Generator Test ---");
const feedbackTests = [
  {
    label: "Strong understanding - correct",
    input: {
      isCorrect: true,
      cognitivePattern: "strong-understanding",
      hesitationScore: 25,
      confidenceScore: 95,
      impulsivityScore: 10,
      reasoningScore: 80,
      questionSubject: "Data Structures"
    }
  },
  {
    label: "Guessing - incorrect",
    input: {
      isCorrect: false,
      cognitivePattern: "guessing",
      hesitationScore: 10,
      confidenceScore: 55,
      impulsivityScore: 95,
      reasoningScore: 15,
      questionSubject: "Algorithms"
    }
  },
  {
    label: "Struggling - incorrect",
    input: {
      isCorrect: false,
      cognitivePattern: "struggling",
      hesitationScore: 85,
      confidenceScore: 20,
      impulsivityScore: 40,
      reasoningScore: 25,
      questionSubject: "JavaScript"
    }
  },
  {
    label: "Insufficient data",
    input: {
      isCorrect: true,
      cognitivePattern: "insufficient-data",
      hesitationScore: null,
      confidenceScore: null,
      impulsivityScore: null,
      reasoningScore: null,
      questionSubject: "General"
    }
  },
];
feedbackTests.forEach((t) => {
  const feedback = generateFeedback(t.input);
  const status = (feedback && (feedback !== "" || t.input.cognitivePattern === "insufficient-data")) ? "PASSED" : "FAILED";
  console.log(`Label: ${t.label}`);
  console.log(`Feedback: ${feedback}`);
  console.log(`Test ${status}`);
  console.log("----------------------------------------");
});
