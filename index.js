var allShapes = ['triangle', 'square', 'circle', 'diamond'];
var allBackgrounds = ['bisected', 'half full', 'quarter full', 'blank', 'single dot'];

function generateShapeProblem(n) {
  var unusedShapes = allShapes.slice();
  var unusedBackgrounds = allBackgrounds.slice()
  var usedShapes = pickRandom(n, unusedShapes);
  var usedBackgrounds = pickRandom(n, unusedBackgrounds);
  var cells = [];
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      cells.push({
        shape: usedShapes[i],
        background: usedBackgrounds[j],
      });
    }
  }
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
  var possibilities =
    cartesianProduct([
        problem.unusedShapes.slice(),
        problem.usedBackgrounds.slice(),
    ])
    .concat(cartesianProduct([
        problem.usedShapes.slice(),
        problem.unusedBackgrounds.slice(),
    ]))
    .concat(cartesianProduct([
        problem.usedShapes.slice(),
        problem.usedBackgrounds.slice(),
    ]));
  var wrong = possibilities
    .map(function(answer) {
      return {
        shape: answer[0],
        background: answer[1],
      };
    })
    .filter(function(answer) {
      return !(answer.shape === problem.answer.shape
        && answer.background === problem.answer.background);
    });
  return pickRandom(n, wrong);
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
