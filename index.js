var allShapes = ['triangle', 'square', 'circle', 'diamond', 'rectangle'];
var allBackgrounds = ['single line', 'half full', 'quarter full', 'blank', 'cross'];

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

function renderShapeProblemAsText(problem) {
  return '<table>' + problem.matrix.map(renderMatrixRow).join('') + '</tr></table>';

  function renderMatrixRow(row) {
    return '<tr>' + row.map(renderMatrixCell).join('') + '</tr>';
  }

  function renderMatrixCell(cell) {
    if (cell === problem.answer) {
      return '<td><em>???</em></td>';
    } else {
      return '<td>' + renderShapeAsText(cell) + '</td>';
    }
  }
}

function renderShapeProblemAsGraphics(problem) {
  return '<table>' + problem.matrix.map(renderMatrixRow).join('') + '</tr></table>';

  function renderMatrixRow(row) {
    return '<tr>' + row.map(renderMatrixCell).join('') + '</tr>';
  }

  function renderMatrixCell(cell) {
    if (cell === problem.answer) {
      return '<td><em>???</em></td>';
    } else {
      console.log(cell);
      return '<td>' + renderShapeAsGraphics(cell) + '</td>';
    }
  }
}

function renderAnswersAsText(answers) {
  var shuffledAnswers = pickRandom(answers.length, answers.slice());
  return '<ol>' + shuffledAnswers.map(renderAnswer).join('') + '</ol>';

  function renderAnswer(answer) {
    return '<li>a ' + renderShapeAsText(answer) + '</li>';
  }
}

function renderAnswersAsGraphics(answers) {
  var shuffledAnswers = pickRandom(answers.length, answers.slice());
  return '<ol class="graphics">' + shuffledAnswers.map(renderAnswer).join('') + '</ol>';

  function renderAnswer(answer) {
    return '<li>' + renderShapeAsGraphics(answer) + '</li>';
  }
}

function renderShapeAsText(shape) {
  return '<em>' + shape.shape + '</em> with a <em>' + shape.background + '</em> background';
}

function renderShapeAsGraphics(shape) {
  var background = '', mask = '', outline = '';

  if (shape.shape === 'triangle') {
    mask = '<path d="M 50 0 L 0 100 L 100 100 Z" />';
    outline = '<path class="shape" d="M 50 1 L 1 99 L 99 99 Z" />';
  } else if (shape.shape === 'square') {
    mask = '<rect x="5" y="5" width="90" height="90" />';
    outline = '<rect class="shape" x="6" y="6" width="88" height="88" />';
  } else if (shape.shape === 'circle') {
    mask = '<circle cx="50" cy="50" r="50" />';
    outline = '<circle class="shape" cx="50" cy="50" r="49" />';
  } else if (shape.shape === 'diamond') {
    mask = '<path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" />';
    outline = '<path class="shape" d="M 50 1 L 99 50 L 50 99 L 1 50 Z" />';
  } else if (shape.shape === 'rectangle') {
    mask = '<rect x="25" y="0" width="50" height="100" />';
    outline = '<rect class="shape" x="25" y="1" width="50" height="98" />';
  }

  if (shape.background === 'single line') {
    background = '<path class="background" d="M 0 50 H 100 Z" clip-path="url(#mask)" />';
  } else if (shape.background === 'half full') {
    background = '<rect class="background" x="0" y="50" width="100" height="50" clip-path="url(#mask)" />';
  } else if (shape.background === 'quarter full') {
    background = '<rect class="background" x="50" y="50" width="50" height="50" clip-path="url(#mask)" />';
  } else if (shape.background === 'cross') {
    background = '<path class="background" d="M 0 0 L 100 100 Z M 100 0 L 0 100 Z" clip-path="url(#mask)" />';
  }

  return '<svg width="100" height="100">'
    + '<defs><clipPath id="mask">' + mask + '</clipPath></defs>'
    + background + outline
    + '</svg>';
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
document.write('<center>');
document.write(renderShapeProblemAsGraphics(problem));
document.write('<p>Find the missing shape! Is it:</p>');
document.write(renderAnswersAsGraphics(answers));
document.write('</center>');
