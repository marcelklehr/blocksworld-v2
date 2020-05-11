// TRAINING TRIALS
pseudoRandomTrainTrials = function(){
  let order = Array(11).fill('');
  let cats = _.shuffle(["uncertain", "independent"])
  let order01 = _.shuffle([0, 1])
  let order23 = _.shuffle([2, 3])
  let order_iff = _.shuffle([0,1])

  order[0] = TrainStimuli.map_category["a_iff_c"]["a_iff_c_" + order_iff[0]]
  order[1] = TrainStimuli.map_category["independent"]["independent_"+order23[0]]
  order[2] = TrainStimuli.map_category["uncertain"]["uncertain_"+order23[0]]

  order[3] = TrainStimuli.map_category[cats[0]][cats[0] + "_" + order01[0]]
  order[4] = TrainStimuli.map_category[cats[1]][cats[1] + "_" + order01[0]]
  order[5] = TrainStimuli.map_category["a_iff_c"]["a_iff_c_" + order_iff[1]]
  order[6] = TrainStimuli.map_category[cats[0]][cats[0] + "_" + order01[1]]
  order[7] = TrainStimuli.map_category[cats[1]][cats[1] + "_" + order01[1]]

  order[8] = TrainStimuli.map_category["uncertain"]["uncertain_"+order23[1]]
  order[9] = TrainStimuli.map_category["a_implies_c"]["a_implies_c_0"]
  order[10] = TrainStimuli.map_category["independent"]["independent_"+order23[1]]

  return order
}
const SHUFFLED_TRAIN_STIMULI = pseudoRandomTrainTrials();

// TEST TRIALS //
// the different priors (do block a/b fall) are put in 3 different categories:
// x: [('lu'), 'hh', 'ul'], y: ['uh', 'll', ('hu')],
// z: ['lh'(not for a_iff_c), 'uu', 'hl'] (sorted such that always 2xl,2xh,2xu)
// for each trial type (a->c, a<->c, independent), each entry in the three
// categories x,y,z must occur exactly once: we sample one combination of x,y,z
// for each of the three trial types, e.g.:
// independent: x - y - z
// A->C :       x - z - y
// A<->C:       z - y - x
// (one column is one block)
// the fourth block contains one trial for A->C and one for independent.
let type_orders = {
  't0': ['x', 'z', 'y'], 't1': ['z', 'y', 'x'],
  't2': ['y', 'x', 'z'], 't3': ['x', 'y', 'z'],
  't4': ['z', 'x', 'y'], 't5': ['y', 'z', 'x']
}
categoriesPerBlock2Priors = function(category_order){
  let mapping = {'a_implies_c': ['hh', 'ul'],
                 'independent': ['uh', 'll'],
                 'a_iff_c': ['lh', 'uu', 'hl']}

  let trial_types = ['a_implies_c', 'independent', 'a_iff_c'];
  let trials = {};
  category_order.forEach(function(o, i){
    let arr = _.shuffle(mapping[TYPE_MAP[o]]);
    let tt = trial_types[i]
    if (o === "z") {
      arr = tt == "a_iff_c" ? _.without(arr, 'lh') : arr.slice(0,2);
    }
    trials[trial_types[i]] = arr
  })
  return(trials)
}
pseudoRandomPriors = function(){
  let combis = Object.values(type_orders)
  let categories_b123 = _.zip(_.sample(combis), _.sample(combis), _.sample(combis))//e.g.[[x,y,z], [y,x,x], [z,z,y]]
  let blocks = [];
  categories_b123.forEach(function(cats_block){
    blocks = blocks.concat(categoriesPerBlock2Priors(cats_block));
  })
  let ind = _.flatten(_.map(blocks, "independent"))
  let ac = _.flatten(_.map(blocks, "a_implies_c"))
  let ind4 = !ind.includes('lh') ? 'lh' : !ind.includes('uu') ? 'uu' : 'hl';
  let ac4 = !ac.includes('lh') ? 'lh' : !ac.includes('uu') ? 'uu' : 'hl';
  blocks.push({'independent': ind4, 'a_implies_c': ac4, 'a_iff_c': ''});
  let orders = {
    'a_implies_c': _.flatten(_.map(blocks, 'a_implies_c')),
    'a_iff_c': _.flatten(_.map(blocks, 'a_iff_c')),
    'independent': _.flatten(_.map(blocks, 'independent'))
  }
  orders.a_iff_c = _.without(orders.a_iff_c, '')
  return orders;
}
pseudoRandomTypes = function() {
  let mapping = {0: [0,1,3,4], 1: [1,2,4,5], 2:[0,2,3,5],
                 3: [0,2,3,4], 4: [0,1,3,4], 5: [1,2,4,5]}

  let pseudo_types = [_.sample(_.range(0,6))];
  _.range(0,5).forEach(function(i){
      let t = _.sample(mapping[pseudo_types[i]]);
      pseudo_types.push(t)
  })
  _.range(0,6).forEach(function(i){
    pseudo_types[i] = type_orders['t' + pseudo_types[i]]
  })
  let trials = _.flatten(pseudo_types)
  let last_trial = trials[trials.length -1]
  let last2 = last_trial == 'z' ? _.shuffle(['x', 'y']) :
      last_trial == 'x' ? ['y', 'x'] : ['x', 'y']

  trials = trials.concat(last2);
  trials = getRealTypes(trials);
  return trials
}
pseudoRandomTestTrials = function(){
  let trial_types = pseudoRandomTypes();
  let priors = pseudoRandomPriors();
  Relations.forEach(function(rel){
    let conditions = priors[rel]
    conditions.forEach(function(p, k){
      let i = _.indexOf(trial_types, rel)
      trial_types[i] = trial_types[i] + '_' + p
    })
  })
  return trial_types
}

// save trial data to make it accessible in magpie experiment
const shuffled_test_ids = pseudoRandomTestTrials();
let test_ids = _.map(slider_rating_trials, 'id');
let TEST_TRIALS = [];
shuffled_test_ids.forEach(function(id){
  let idx = _.indexOf(test_ids, id)
  TEST_TRIALS.push(slider_rating_trials[idx]);
});

if (DEBUG){
  let arr = _.map(TEST_TRIALS, 'id')
  let res = _.countBy(arr, function(id) {
    return id ? (id.includes('independent') ? 'ind' :
      id.includes('iff') ? 'iff' : 'ac') : 'undefined';
  });
  console.log(res)
}
