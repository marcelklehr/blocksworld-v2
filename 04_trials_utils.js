// TRAINING TRIALS
// data for animations
pseudoRandomTrainTrials = function(){
  let stimuli = Array(15).fill('');
  let trials = Array(15).fill('');
  let dict = TrainStimuli.map_category;
  // dont start with uncertain3, ac2, ac3, 'ssw1'
  let unc = _.shuffle(_.values(dict.uncertain));
  let unc012 = _.filter(unc, function(obj){
    return obj.id != "uncertain3"
  });
  let unc3 = dict.uncertain.uncertain3;

  let ramp = _.shuffle(_.values(dict.ramp));

  let if2 = ['ssw0', 'ssw1'];
  let ind_ac = _.shuffle([dict.independent.ind0,
                          dict.independent.ind1,
                          if2[0]]);
  // don't put ac2 and ac3 in "consequent" if1-trials (here nothing happens)
  let ac01 = _.shuffle([dict.if1.ac0, dict.if1.ac1]);
  let ac23 = _.shuffle([dict.if1.ac2, dict.if1.ac3]);
  let if1 = _.shuffle([ac01, ac23]);
  let i_ac23 = [];
  [1, 8].forEach(function(idx, i){
    stimuli[idx] = if1[0][i];
    trials[idx] = getTrialById(TRAIN_TRIALS, if1[0][i].id);
    (if1[0][i].id == "ac2" || if1[0][i].id == "ac3") ? i_ac23.push(idx) : null;
  });
  [5, 11].forEach(function(idx, i){
    stimuli[idx] = if1[1][i];
    trials[idx] = getTrialById(TRAIN_TRIALS, if1[1][i].id);
    (if1[1][i].id == "ac2" || if1[1][i].id == "ac3") ? i_ac23.push(idx) : null;
  });

  // uncertain3 shall not be directely after ac2 or ac3 (here nothing happens)
  let indices = _.without([2, 6, 9, 12], i_ac23[0] + 1, i_ac23[1] + 1);
  stimuli[indices[0]] = unc3;
  trials[indices[0]] = getTrialById(TRAIN_TRIALS, 'uncertain3');

  [indices[1], i_ac23[0]+1, i_ac23[1]+1].forEach(function(idx, i){
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

  stimuli[14] = dict.independent.ind2
  trials[14] = getTrialById(TRAIN_TRIALS, "ind2");

  return {stimuli_data: stimuli, trial_data: trials}
}

let training = pseudoRandomTrainTrials()
const SHUFFLED_TRAIN_STIMULI = training.stimuli_data;
const SHUFFLED_TRAIN_TRIALS = training.trial_data;
// const SHUFFLED_TRAIN_STIMULI = TrainStimuli.list_all;

// TEST TRIALS //
// generates sequence of test trial ids specified in PRIORS_IDS; if these
// change, order needs to be adapted here!
pseudoRandomTestTrials = function(){
  let trials = [];
  _.map(PRIORS_IDS, function(arr, key){
    arr = arr.slice(0,5); // take minimum nb of trials per type
    trials.push(_.map(arr, function(p){return(key + "_" + p)}));
  });
  let order = _.shuffle(trials);
  let ids = _.flatten(_.zip(order[0], order[1], order[2]));
  // add missing trials
  ids.push.apply(ids, ['if2_' + PRIORS_IDS.if2[5], 'if1_' + PRIORS_IDS.if1[5],
                       'if2_' + PRIORS_IDS.if2[6]]);
  return ids
}

// save trial data in specified pseudorandom order s.t. accessible in experiment
let shuffleTestTrials = function(trial_data){
  let shuffled_trials = [];
  let trial_ids = _.map(trial_data, 'id'); // data for all to be used test-ids
  const ids_sequence = pseudoRandomTestTrials();

  ids_sequence.forEach(function(id){
    let idx = _.indexOf(trial_ids, id)
    // let idx = _.lastIndexOf(test_ids, id)
    if(idx === -1) {
      let kind = id.slice(0, _.lastIndexOf(id, "_"));
      let ps = id.slice(_.lastIndexOf(id, "_") + 1);
      console.warn('Test trial with id: ' + id + ' not found. All test-ids to be used must be specified in PRIORS_IDS and considered in function *pseudoRandomTestTrials*!')
    }
    shuffled_trials.push(trial_data[idx]);
  });
  return shuffled_trials;
}
const TEST_TRIALS = shuffleTestTrials(slider_rating_trials);
const FRIDGE_TRIALS = shuffleTestTrials(fridge_trials);
const COLOR_VISION_TRIALS = _.shuffle(color_vision_trials);

if (DEBUG){
  let arr = _.map(TEST_TRIALS, 'id')
  let res = _.countBy(arr, function(id) {
    return id ? (id.includes('independent') ? 'ind' :
      id.includes('iff') ? 'iff' : 'ac') : 'undefined';
  });
  console.log(res)
}
