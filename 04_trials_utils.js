// TRAINING TRIALS
pseudoRandomTrainTrials = function(){
  let trials = Array(15).fill('');
  // dont start with unc3, ac2, ac3
  let ids = _.shuffle(_.map(TrainStimuli.list_all, 'id'));
  let unc = _.shuffle(_.values(TrainStimuli.map_category.uncertain));
  let ramp = _.shuffle(_.values(TrainStimuli.map_category.ramp));

  let ac2 = _.shuffle(_.values(TrainStimuli.map_category.ac2));
  let ind_ac = _.shuffle([TrainStimuli.map_category.independent.ind0,
                          TrainStimuli.map_category.independent.ind1,
                          ac2[0]]);
  let ac1 = _.shuffle(_.values(TrainStimuli.map_category.ac1));

  [1, 5, 8, 11].forEach(function(idx, i){trials[idx] = ac1[i]});
  [2, 6, 9, 12].forEach(function(idx, i){trials[idx] = unc[i]});
  [3, 4].forEach(function(idx, i){trials[idx] = ramp[i]});
  [0, 7, 10].forEach(function(idx, i){trials[idx] = ind_ac[i]})
  trials[13] = ac2[1];
  trials[14] = TrainStimuli.map_category.independent.ind2
  return trials
}

// const SHUFFLED_TRAIN_STIMULI = pseudoRandomTrainTrials();
const SHUFFLED_TRAIN_STIMULI = TrainStimuli.list_all;
// TEST TRIALS //
sequencePriors = function(){
  return {
    'ac1': _.shuffle(['hh', 'uh', 'uu', 'lh']),
    'ac2': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll']),
    'independent': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll'])
  }
}
pseudoRandomTypes = function() {
  let order = _.random(0, 1) == 0 ? ['independent', 'ac1', 'ac2'] :
    ['ac2', 'ac1', 'independent'];
  let trials = _.reduce(_.range(1,3), function(memo, val){
    return memo.concat(memo);
  }, order);
  trials = trials.concat(_.without(order, 'ac1'));
  return trials
}


pseudoRandomTestTrials = function(){
  let trial_types = pseudoRandomTypes();
  let priors = sequencePriors();
  TRIAL_TYPES.forEach(function(rel){
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
