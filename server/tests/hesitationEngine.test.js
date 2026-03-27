const { calculateHesitationScore, 
        getHesitationLabel } = require('../ai');

describe('Hesitation Engine', () => {
  
  describe('calculateHesitationScore', () => {
    test('returns 10 for very fast input (500ms)', () => {
      expect(calculateHesitationScore(500)).toBe(10);
    });
    test('returns 55 for moderate hesitation (4000ms)', () => {
      expect(calculateHesitationScore(4000)).toBe(55);
    });
    test('returns 100 for very high hesitation (15000ms)', () => {
      expect(calculateHesitationScore(15000)).toBe(100);
    });
    test('returns null for null input', () => {
      expect(calculateHesitationScore(null)).toBeNull();
    });
    test('returns null for undefined input', () => {
      expect(calculateHesitationScore(undefined)).toBeNull();
    });
  });

  describe('getHesitationLabel', () => {
    test('returns Low for score 10', () => {
      expect(getHesitationLabel(10)).toBe('Low');
    });
    test('returns Medium for score 55', () => {
      expect(getHesitationLabel(55)).toBe('Medium');
    });
    test('returns Very High for score 100', () => {
      expect(getHesitationLabel(100)).toBe('Very High');
    });
    test('returns Unknown for null', () => {
      expect(getHesitationLabel(null)).toBe('Unknown');
    });
  });
});
