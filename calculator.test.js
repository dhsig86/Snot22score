/**
 * @jest-environment jsdom
 */

describe('getScoreColor', () => {
  const { getScoreColor } = require('./calculator');

  test('returns green for low scores', () => {
    expect(getScoreColor(10)).toEqual({ fontColor: 'green', backgroundColor: '#d4edda' });
  });

  test('returns yellow for medium scores', () => {
    expect(getScoreColor(50)).toEqual({ fontColor: 'darkgoldenrod', backgroundColor: '#fff3cd' });
  });

  test('returns red for high scores', () => {
    expect(getScoreColor(100)).toEqual({ fontColor: 'red', backgroundColor: '#f8d7da' });
  });

  test('uses green for boundary score 36', () => {
    expect(getScoreColor(36)).toEqual({ fontColor: 'green', backgroundColor: '#d4edda' });
  });

  test('uses yellow for boundary scores 37 and 74', () => {
    expect(getScoreColor(37)).toEqual({ fontColor: 'darkgoldenrod', backgroundColor: '#fff3cd' });
    expect(getScoreColor(74)).toEqual({ fontColor: 'darkgoldenrod', backgroundColor: '#fff3cd' });
  });

  test('uses red for boundary score 75', () => {
    expect(getScoreColor(75)).toEqual({ fontColor: 'red', backgroundColor: '#f8d7da' });
  });
});

function setupDOM() {
  document.body.innerHTML = `
    <button id="startButton"></button>
    <button id="prevButton"></button>
    <button id="nextButton"></button>
    <button id="calculateButton"></button>
    <button id="exportButton"></button>
    <button id="backButton"></button>
    <button id="resetButton"></button>
    <button id="restartButton"></button>
    <div id="spinner"></div>
    <div id="resultContainer"></div>
    <form id="snot-22-form">
      <select name="question1"><option value="1" selected>1</option></select>
      <select name="question2"><option value="2" selected>2</option></select>
      <input type="checkbox" class="importance-rating" value="Symptom A" />
      <input type="checkbox" class="importance-rating" value="Symptom B" />
      <input type="checkbox" class="importance-rating" value="Symptom C" />
      <input type="checkbox" class="importance-rating" value="Symptom D" />
      <input type="checkbox" class="importance-rating" value="Symptom E" />
      <input type="checkbox" class="importance-rating" value="Symptom F" />
    </form>
    <div id="result"></div>
    <input id="patientName" />
    <input id="patientAge" />
    <div id="nameError"></div>
    <div id="ageError"></div>
    <div class="navigation-buttons"></div>
    <div id="progress-bar"></div>
    <div class="progress-step" data-group="1"></div>
    <div id="group1" class="question-group"></div>
    <div id="introduction"></div>
  `;
}

describe('checkbox limitations', () => {
  beforeEach(() => {
    jest.resetModules();
    setupDOM();
    window.alert = jest.fn();
    window.scrollTo = jest.fn();
    require('./calculator');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('allows selecting at most five checkboxes', () => {
    const checkboxes = document.querySelectorAll('.importance-rating');
    checkboxes.forEach(cb => {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    });
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    expect(checkedCount).toBe(5);
    expect(window.alert).toHaveBeenCalled();
  });
});

describe('result display', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    setupDOM();
    window.alert = jest.fn();
    window.scrollTo = jest.fn();
    require('./calculator');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows selected symptoms in the result', () => {
    const checkboxes = document.querySelectorAll('.importance-rating');
    checkboxes[0].checked = true;
    checkboxes[0].dispatchEvent(new Event('change'));
    checkboxes[1].checked = true;
    checkboxes[1].dispatchEvent(new Event('change'));

    const form = document.getElementById('snot-22-form');
    form.dispatchEvent(new Event('submit'));
    jest.runAllTimers();

    const result = document.getElementById('result');
    expect(result.style.display).toBe('block');
    expect(result.innerHTML).toContain('Symptom A');
    expect(result.innerHTML).toContain('Symptom B');
  });
});
