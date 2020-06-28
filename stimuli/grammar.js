// let _ = require('../node_modules/underscore/underscore.js')

let GRAMMAR_VAR = {
  'DET_N': ['neither', 'nor'],
  'COL': ['green', 'blue'],
  'CONJ': ['and', 'but', 'because of'],
  'MOD': ['probably', 'might', 'defenitely', 'maybe', 'also', 'only'],
  'V_I': ['fall'],
  'V': ['falls'],
  'V_AUX_I': ['make', 'cause'],
  'V_AUX': ['makes', 'causes']
}
// mapping from token or placeholder (refers to all tokens of the placeholder)
// to list of words/placeholders that will be visible after the key token was
// selected
let GRAMMAR_RULE = {
  'S': ['MOD', 'if', 'the', 'both', 'DET_N'], //start symbol
  'MOD': ['the', 'both', 'if', 'V_AUX', 'V_AUX_I', 'V', 'V_I'],
  'the': ['COL'],
  'if': ['the', 'and'],
  'DET_N': ['the'],
  'COL': ['block', 'nor', 'CONJ'],
  'both': ['blocks'],
  'blocks': ['will', 'fall'],
  'block': ['to', 'will', 'nor', 'V', 'V_AUX', 'V_I', 'MOD', 'CONJ'],
  'will': ['MOD', 'not', 'V_I', 'V_AUX_I'],
  'not': ['V_I', 'V_AUX_I', 'the'],
  'and': ['the', 'MOD', 'V_AUX'],
  'but': ['not', 'the'],
  'V_I': ['CONJ', 'the', 'also', 'nor', 'if'],
  'V': ['CONJ', 'the', 'also', 'if'],
  'V_AUX_I': ['the'],
  'V_AUX': ['the'],
  'to': ['fall']
}

let word_groups = [
  {
    words: ["maybe", "might", "probably", 'defenitely', 'also', 'only'],
    col: 'green'
  },
  {
    words: ["not", "neither", "nor", "but"],
    col: 'red'
  },
  {
    words: ["if", "and", "or",
           "because of", "the"],
    col: 'blue'
  },
  {
    words: ["block", "blocks", "both"],
    col: 'purple'
  },
  {
    words: ["fall", "falls", "will", "cause", "causes", "make", "makes",
                    "to"],
    col: 'orange'
  },
  {
    words: ["green", "blue"],
    col: 'black'
  }
];
let WORDS = _.flatten(_.map(_.values(word_groups), 'words'));
// console.log(WORDS)

let shownNext = function (last) {
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
  return symbols
}
// let symbols = shownNext('S')
// console.log(_.flatten(symbols))
// let i = _.random(0, symbols.length - 1)
// let selected = typeof(symbols[i]) == 'string' ? symbols[i] : _.sample(symbols[i]);
// console.log('selected: ' + selected)
// console.log(shownNext(selected))
