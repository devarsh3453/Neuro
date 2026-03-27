const { calculateConfidenceScore,
        getConfidenceLabel } = require('../ai');

describe('Confidence Engine', () => {

  describe('calculateConfidenceScore', () => {
    test('returns 95 for 0 edits', () => {
      expect(calculateConfidenceScore(0)).toBe(95);
    });
    test('returns 55 for 2 edits', () => {
      expect(calculateConfidenceScore(2)).toBe(55);
    });
    test('returns 10 for 5+ edits', () => {
      expect(calculateConfidenceScore(5)).toBe(10);
      expect(calculateConfidenceScore(7)).toBe(10);
    });
    test('returns null for null input', () => {
      expect(calculateConfidenceScore(null)).toBeNull();
    });
    test('returns null for negative input', () => {
      expect(calculateConfidenceScore(-1)).toBeNull();
    });
  });

  describe('getConfidenceLabel', () => {
    test('returns High for score 95', () => {
      expect(getConfidenceLabel(95)).toBe('High');
    });
    test('returns Very Low for score 10', () => {
      expect(getConfidenceLabel(10)).toBe('Very Low');
    });
    test('returns Unknown for null', () => {
      expect(getConfidenceLabel(null)).toBe('Unknown');
    });
  });
});
