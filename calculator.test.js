const { getScoreColor } = require('./calculator');

describe('getScoreColor', () => {
  test('returns green for low scores', () => {
    expect(getScoreColor(10)).toEqual({ fontColor: 'green', backgroundColor: '#d4edda' });
  });

  test('returns yellow for medium scores', () => {
    expect(getScoreColor(50)).toEqual({ fontColor: 'darkgoldenrod', backgroundColor: '#fff3cd' });
  });

  test('returns red for high scores', () => {
    expect(getScoreColor(100)).toEqual({ fontColor: 'red', backgroundColor: '#f8d7da' });
  });
});
