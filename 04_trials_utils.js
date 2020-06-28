// TRAINING TRIALS
// data for animations
pseudoRandomTrainTrials = function(){
  let stimuli = Array(15).fill('');
  let trials = Array(15).fill('');
  // dont start with uncertain3, ac2, ac3
  let unc = _.shuffle(_.values(TrainStimuli.map_category.uncertain));
  let unc012 = _.filter(unc, function(obj){
    return obj.id != "uncertain3"
  });
  let unc3 = TrainStimuli.map_category.uncertain.uncertain3;

  let ramp = _.shuffle(_.values(TrainStimuli.map_category.ramp));

  let if2 = _.shuffle(_.values(TrainStimuli.map_category.if2));
  let ind_ac = _.shuffle([TrainStimuli.map_category.independent.ind0,
                          TrainStimuli.map_category.independent.ind1,
                          if2[0]]);
  let if1 = _.shuffle(_.values(TrainStimuli.map_category.if1));

  // uncertain3 shall not be directely after ac2 or ac3 (in these trials nothing
  // happens)
  let i_ac23 = [];
  [1, 5, 8, 11].forEach(function(idx, i){
    stimuli[idx] = if1[i];
    trials[idx] = getTrialById(TRAIN_TRIALS, if1[i].id);
    (if1[i].id == "ac2" || if1[i].id == "ac3") ? i_ac23.push(idx) : null;
  });
  let indices = _.without([2, 6, 9, 12], i_ac23[0] + 1, i_ac23[1] + 1);
  stimuli[indices[0]] = unc3;
  trials[indices[0]] = getTrialById(TRAIN_TRIALS, 'uncertain3');

  i_ac23.concat([indices[1]]).forEach(function(idx, i){
    stimuli[idx] = unc012[i]
    trials[idx] = getTrialById(TRAIN_TRIALS, unc012[i].id);
  });

  [3, 4].forEach(function(idx, i){
    stimuli[idx] = ramp[i];
    trials[idx] = getTrialById(TRAIN_TRIALS, ramp[i].id);
  });
  [0, 7, 10].forEach(function(idx, i){
    stimuli[idx] = ind_ac[i]
    trials[idx] = getTrialById(TRAIN_TRIALS, ind_ac[i].id);
  })
  stimuli[13] = if2[1];
  trials[13] = getTrialById(TRAIN_TRIALS, if2[1].id);

  stimuli[14] = TrainStimuli.map_category.independent.ind2
  trials[14] = getTrialById(TRAIN_TRIALS, "ind2");

  return {stimuli_data: stimuli, trial_data: trials}
}

let training = pseudoRandomTrainTrials()
const SHUFFLED_TRAIN_STIMULI = training.stimuli_data;
const SHUFFLED_TRAIN_TRIALS = training.trial_data;
// const SHUFFLED_TRAIN_STIMULI = TrainStimuli.list_all;

// TEST TRIALS //
sequencePriors = function(){
  return {
    'if1': _.shuffle(['hh', 'uh', 'uu', 'lh']),
    'if2': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll']),
    'independent': _.shuffle(['hl', 'hh', 'ul', 'uh', 'll'])
  }
}
pseudoRandomTypes = function() {
  // 4 x if1 trials - 5 x if2 trials - 5 x independent trials
  let order = _.random(0, 1) == 0 ? ['independent', 'if1', 'if2'] :
    ['if2', 'if1', 'independent'];
  let trials = _.reduce(_.range(1,3), function(memo, val){
    return memo.concat(memo);
  }, order);
  trials = trials.concat(_.without(order, 'if1'));
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
