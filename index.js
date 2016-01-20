var allShapes = ['triangle', 'square', 'circle', 'diamond', 'rectangle'];
var allBackgrounds = ['bisected', 'half full', 'quarter full', 'blank', 'single dot'];

function generateShapeProblem(n) {
  var unusedShapes = allShapes.slice();
  var unusedBackgrounds = allBackgrounds.slice()
  var usedShapes = pickRandom(n, unusedShapes);
  var usedBackgrounds = pickRandom(n, unusedBackgrounds);
  var cells = cartesianProduct([
      usedShapes,
      usedBackgrounds,
  ]).map(makeAnswer);
  var answer = cells[randomInt(cells.length)];
  answer.correct = true;

  var matrix = [];
  for (var i = 0; i < n; i++) {
    matrix[i] = [];
    for (var j = 0; j < n; j++) {
      var x = randomInt(cells.length);
      matrix[i].push(cells.splice(x, 1)[0]);
    }
  }

  return {
    matrix: matrix,
    usedShapes: usedShapes,
    usedBackgrounds: usedBackgrounds,
    unusedShapes: unusedShapes,
    unusedBackgrounds: unusedBackgrounds,
    answer: answer,
  };
}

function generateWrongAnswers(n, problem) {
  var wrong =
    cartesianProduct([
        problem.unusedShapes,
        problem.usedBackgrounds,
    ])
    .concat(cartesianProduct([
        problem.usedShapes,
        problem.unusedBackgrounds,
    ]))
    .map(makeAnswer);

  var duplicates =
    cartesianProduct([
        problem.usedShapes,
        problem.usedBackgrounds,
    ])
    .map(makeAnswer)
    .filter(function(answer) {
      return !(answer.shape === problem.answer.shape
        && answer.background === problem.answer.background);
    });

  var numDuplicates = Math.floor(n/3);
  return pickRandom(n - numDuplicates, wrong).concat(pickRandom(numDuplicates, duplicates));
}

function makeAnswer(values) {
  return {
    shape: values[0],
    background: values[1],
  };
}

function renderShapeProblem(problem) {
  return '<table>' + problem.matrix.map(renderMatrixRow).join('') + '</tr></table>';

  function renderMatrixRow(row) {
    return '<tr>' + row.map(renderMatrixCell).join('') + '</tr>';
  }

  function renderMatrixCell(cell) {
    if (cell === problem.answer) {
      return '<td><em>???</em></td>';
    } else {
      return '<td>' + renderShape(cell) + '</td>';
    }
  }
}

function renderAnswers(answers) {
  var shuffledAnswers = pickRandom(answers.length, answers.slice());
  return '<ol>' + shuffledAnswers.map(renderAnswer).join('') + '</ol>';

  function renderAnswer(answer) {
    return '<li>a ' + renderShape(answer) + (answer.correct ? ' (correct)' : '') + '</li>';
  }
}

function renderShape(shape) {
  return '<em>' + shape.shape + '</em> with a <em>' + shape.background + '</em> background';
}

function pickRandom(n, from) {
  var result = [];
  for (var i = 0; i < n; i++) {
    var x = randomInt(from.length);
    result.push(from.splice(x, 1)[0]);
  }
  return result;
}

function randomInt(maxPlusOne) {
  return Math.floor(Math.random() * maxPlusOne);
}

// http://stackoverflow.com/a/29585704/945863
function cartesianProduct(a) {
  var i, j, l, m, a1, o = [];
  if (!a || a.length === undefined || a.length === 0) return a;

  a1 = a.splice(0,1);
  a = cartesianProduct(a);
  for (i = 0, l = a1[0].length; i < l; i++) {
    if (a && a.length) {
      for (j = 0, m = a.length; j < m; j++) {
        o.push([a1[0][i]].concat(a[j]));
      }
    } else {
      o.push([a1[0][i]]);
    }
  }
  return o;
}

var problem = generateShapeProblem(3);
var wrong = generateWrongAnswers(3, problem);
var answers = wrong.concat(problem.answer);
document.write(renderShapeProblem(problem));
document.write('<p>Find the missing shape! Is it:</p>');
document.write(renderAnswers(answers));
