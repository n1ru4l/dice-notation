import { DiceRule } from '../rules/types';
import random from '../util/random';
import withPlugins from '../withPlugins';
import { CoreTokenTypes } from '../tokens';

interface CountSpecificNumberToken {
  count: number;
  numSides: number;
  targetNum: number;
}

const countSpecificNumberPlugin: DiceRule<CountSpecificNumberToken> = {
  regex: /\d+d\d+t\d+/,
  typeConstant: 'CountRoll',
  tokenize: raw => {
    const [count, rest] = raw.split('d');
    const [numSides, targetNum] = rest.split('t');
    return {
      count: parseInt(count),
      numSides: parseInt(numSides),
      targetNum: parseInt(targetNum),
    };
  },
  roll: ({ count, numSides }) =>
    new Array(count).fill(0).map(() => random(1, numSides)),
  calculateValue: (token, rolls) =>
    rolls.filter(roll => roll === token.targetNum).length,
};

describe('plugins', () => {
  it('should support custom plugins', () => {
    const testRoll = '10d1t1';
    const { roll, tokenize } = withPlugins(countSpecificNumberPlugin);
    const { result, rollTotals, rolls } = roll(testRoll);
    expect(result).toEqual(10);
    expect(rolls).toHaveLength(1);
    expect(rolls[0]).toHaveLength(10);
    expect(rollTotals).toHaveLength(1);
    expect(rollTotals[0]).toEqual(10);
    const tokens = tokenize(testRoll);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toEqual(CoreTokenTypes.DiceRoll);
  });
});
