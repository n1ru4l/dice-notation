import { rollDice, roll } from '../index';
import { diceRollToken } from '../tokens';

describe('roll', () => {
  const cases: [string, number, number, number][] = [
    ['1d6', 1, 6, 12],
    ['1d12', 1, 12, 12],
    ['1d6 + 5', 6, 11, 12],
    ['4d6', 4, 36, 36],
    ['1d12 * 2d4 / 2', 1, 48, 200],
    ['1d4 + 1d4 + 1d4 + 1d4', 4, 16, 24],
    ['1d4 * (1d4 + 2)', 3, 24, 30],
    ['1d2', 1, 2, 10],

    // Constants to truly verify operator precedence
    ['2 + 3 * (4 + 2)', 20, 20, 1],
    ['2*2', 4, 4, 1],
    ['4*4 + 4 / 2 -10', 8, 8, 1],
    ['(2 + 2) * (3 * (3 - 1)) - (3 + 1)', 20, 20, 1],
    ['64 * (0-3) - 4008 / 5 + (0-328)', -1321.6, -1321.6, 1],
    ['2', 2, 2, 1],

    // Support for unary operators
    ['2 + -2', 0, 0, 1],
    ['-2 + 2', 0, 0, 1],
    ['+2 + 2', 4, 4, 1],
    ['-2 + -2', -4, -4, 1],
    ['2 * -2', -4, -4, 1],
    ['-2 * -2', 4, 4, 1],
    ['+2 / -2', -1, -1, 1],
    ['------2', 2, 2, 1],
    ['2 + ------2', 4, 4, 1],
    ['++++++2 + ------2', 4, 4, 1],
    ['-1d6 + -2d4', -14, -3, 20],
    ['+1d6 + +2d4', 3, 14, 20],
    ['+1d6 - +2d4', -7, 4, 20],
    ['-(1d6 + -6) - +(4 + 5)', -9, -4, 20],
  ];

  it.each(cases)('should correctly roll %s', (notation, min, max, repeats) => {
    for (let i = 0; i < repeats; i++) {
      const { result } = roll(notation);
      expect(result).toBeLessThanOrEqual(max);
      expect(result).toBeGreaterThanOrEqual(min);
    }
  });

  const errorCases: [string, string][] = [
    ['2 + *3', "Operator '*' may not be used as a unary operator"],
    ['2 + /3', "Operator '/' may not be used as a unary operator"],
  ];

  it.each(errorCases)('should correctly error on %s', (notation, error) => {
    expect(() => roll(notation)).toThrowError(error);
  });
});

describe('rollDice', () => {
  it('should handle rolls', () => {
    const tokens = [
      diceRollToken(1, 6, 0, ''),
      diceRollToken(5, 8, 0, ''),
      diceRollToken(2, 10, 0, ''),
      diceRollToken(4, 4, 0, ''),
    ];

    const result = rollDice(tokens);
    expect(result).toHaveLength(tokens.length);
    result.forEach((rolls, index) => {
      const { count } = tokens[index].detail;
      expect(rolls).toHaveLength(count);
    });
  });
});
