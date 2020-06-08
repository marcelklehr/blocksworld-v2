// TRAINING TRIALS
pseudoRandomTrainTrials = function(){
  let order = Array(11).fill('');
  let cats = _.shuffle(["uncertain", "independent"])
  let order01 = _.shuffle([0, 1])
  let order23 = _.shuffle([2, 3])
  let order_iff = _.shuffle([0,1])

  order[0] = TrainStimuli.map_category["ac_2"]["ac_2_" + order_iff[0]]
  order[1] = TrainStimuli.map_category["independent"]["independent_"+order23[0]]
  order[2] = TrainStimuli.map_category["uncertain"]["uncertain_"+order23[0]]

  order[3] = TrainStimuli.map_category[cats[0]][cats[0] + "_" + order01[0]]
  order[4] = TrainStimuli.map_category[cats[1]][cats[1] + "_" + order01[0]]
  order[5] = TrainStimuli.map_category["ac_2"]["ac_2_" + order_iff[1]]
  order[6] = TrainStimuli.map_category[cats[0]][cats[0] + "_" + order01[1]]
  order[7] = TrainStimuli.map_category[cats[1]][cats[1] + "_" + order01[1]]

  order[8] = TrainStimuli.map_category["uncertain"]["uncertain_"+order23[1]]
  order[9] = TrainStimuli.map_category["ac_1"]["ac_1_0"]
  order[10] = TrainStimuli.map_category["independent"]["independent_"+order23[1]]

  return order
}
const SHUFFLED_TRAIN_STIMULI = pseudoRandomTrainTrials();

// TEST TRIALS //
sequencePriors = function(){
  return {
    'ac_1': _.shuffle(['hh', 'uh', 'uu', 'lh']),
    'ac_2': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll']),
    'independent': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll'])
  }
}
pseudoRandomTypes = function() {
  let order = _.random(0, 1) == 0 ? ['independent', 'ac_1', 'ac_2'] :
    ['ac_2', 'ac_1', 'independent'];
  let trials = _.reduce(_.range(1,3), function(memo, val){
    return memo.concat(memo);
  }, order);
  trials = trials.concat(_.without(order, 'ac_1'));
  return trials
}
pseudoRandomTestTrials = function(){
  let trial_types = pseudoRandomTypes();
  let priors = sequencePriors();
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
  let idx = _.lastIndexOf(test_ids, id)
  if(idx === -1) {
    let kind = id.slice(0, _.lastIndexOf(id, "_"));
    let ps = id.slice(_.lastIndexOf(id, "_") + 1);
      console.warn('Test trial with id: ' + id + ' not found.')
  }
  // console.log(id + ' ' + idx)
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
