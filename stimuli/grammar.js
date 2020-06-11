// let _ = require('../node_modules/underscore/underscore.js')

let placeholder = {
  'IF': ["if", "if and only if", "only if"],
  'DET_N': ['neither', 'nor'],
  'COL': ['green', 'blue'],
  'CONJ': ['and', 'but', 'because of'],
  'MOD': ['probably', 'likely', 'defenitely', 'maybe'],
  'V': ['make', 'cause', 'makes', 'causes']
}
let rules = {
 'S': ['MOD', 'IF', 'the', 'both', 'DET_N'], //start symbol
 'MOD': ['the', 'both'],
 'the': ['COL'],
 'IF': ['the'],
 'DET_N': ['the'],
 'COL': ['block'],
 'both': ['blocks'],
 'blocks': ['will', 'fall'],
 'block': ['to', 'will', 'and', 'but', 'does', 'falls', 'makes', 'causes'],
 'will': ['MOD', 'not', 'fall', 'make', 'cause'],
 'and': ['the'],
 'but': ['not', 'the'],
 'V': ['the']
}
// rather ?
// only without if?
// no?
// due to?
let word_groups = [
  {words: ["maybe", "likely", "probably", 'defenitely'], col: 'green'},
  {words: ["not", "neither", "nor", "but"], col: 'red'},
  {words: ["if and only if", "only if", "if", "and", "or",
                    "because of", "the"], col: 'blue'},
  {words: ["block", "blocks", "both"], col: 'purple'},
  {words: ["fall", "falls", "will", "cause", "causes", "make", "makes",
                    "does"], col: 'orange'},
  {words: ["green", "blue"], col: 'grey'}
];

let shownNext = function(last){
  let arr = Object.keys(rules).includes(last) ? rules[last] :
            Object.keys(placeholder).includes(last) ? placeholder[last] :
            rules[_.filter(Object.keys(placeholder), function(key){
              return placeholder[key].includes(last);
            })[0]];
//   console.log(arr)
  let symbols = _.reduce(arr, function(acc, val){
    return acc.concat(val == val.toLowerCase() ? val : placeholder[val]);
  }, []);
  return symbols
}
// let symbols = shownNext('S')
// // console.log(_.flatten(symbols))
// let i = _.random(0, symbols.length - 1)
// let selected = typeof(symbols[i]) == 'string' ? symbols[i] : _.sample(symbols[i]);
// console.log('selected: ' + selected)
// console.log(shownNext(selected))
