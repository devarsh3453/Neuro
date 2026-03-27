const { classifyCognitivePattern } = require('../ai');

describe('Cognitive Pattern Classifier', () => {
  test('classifies strong-understanding correctly', () => {
    expect(classifyCognitivePattern(25, 95, 10, 80))
      .toBe('strong-understanding');
  });
  test('classifies guessing correctly', () => {
    expect(classifyCognitivePattern(10, 55, 95, 15))
      .toBe('guessing');
  });
  test('classifies low-confidence correctly', () => {
    expect(classifyCognitivePattern(40, 20, 30, 40))
      .toBe('low-confidence');
  });
  test('returns insufficient-data when all null', () => {
    expect(classifyCognitivePattern(null, null, null, null))
      .toBe('insufficient-data');
  });
  test('classifies struggling correctly', () => {
    expect(classifyCognitivePattern(85, 35, 40, 20))
      .toBe('struggling');
  });
});
