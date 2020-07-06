// let _ = require('../node_modules/underscore/underscore.js')

const GRAMMAR_VAR = {
  "SUBJ": ["the green block", "the blue block"],
  "V": ["falls", "will fall", "will not fall", "might fall", "might not fall"],
  'CONJ': ["but", "or", "if", "and", "only"], // recursive + non-recursive
  'NEG': ["neither", "nor"],
  'ADV': ["as well"]
}

const GRAMMAR_RULE = {
  'S': ["if", "only", "SUBJ", "neither"],
  'SUBJ': ['CONJ', 'NEG', 'V'],
  'V': ['CONJ', 'NEG', 'SUBJ', 'ADV'],
  'CONJ': ['SUBJ', 'CONJ'],
  'NEG': ['SUBJ']
}
// "to fall"
// "will make"
// "will cause"
// "because of"

let WORD_GROUPS = [
  {words: GRAMMAR_VAR.SUBJ,
   col: 'black'
 },
  {
    words: GRAMMAR_VAR.V,
    col: 'orange'
  },
  {
    words: GRAMMAR_VAR.CONJ,
    col: 'blue'
  },
  {
    words: GRAMMAR_VAR.NEG,
    col: 'red'
  },
  {
    words: GRAMMAR_VAR.ADV,
    col: 'purple'
  }
];
let WORDS = _.flatten(_.map(_.values(WORD_GROUPS), 'words'));
// console.log(WORDS)

let shownNext = function (last, sentence='') {
  let arr = Object.keys(GRAMMAR_RULE)
    .includes(last) ? GRAMMAR_RULE[last] :
    Object.keys(GRAMMAR_VAR)
    .includes(last) ? GRAMMAR_VAR[last] :
    GRAMMAR_RULE[_.filter(Object.keys(GRAMMAR_VAR), function (key) {
      return GRAMMAR_VAR[key].includes(last);
    })[0]];
  //   console.log(arr)
  let symbols = _.reduce(arr, function (acc, val) {
    return acc.concat(val == val.toLowerCase() ? val : GRAMMAR_VAR[val]);
  }, []);
  // nor only possible if neither had been selected +
  // neither/nor only selectable once!
  symbols = !sentence.includes('neither') ? _.without(symbols, 'nor') :
    _.without(symbols, 'neither');
  symbols = sentence.includes('nor') ? _.without(symbols, 'nor') : symbols;
  // neither only at beginning
  symbols = sentence != '' ? _.without(symbols, 'neither') : symbols;
  return symbols
}
// let symbols = shownNext('S')
// let i = _.random(0, symbols.length - 1)
// let selected = typeof(symbols[i]) == 'string' ? symbols[i] : _.sample(symbols[i]);
