// In this file you can specify the trial data for your experiment
var color_vision_test = [
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the BLUE block on the right picture?",
    picture1: "stimuli/img/color_vision_test0.jpg",
    picture2: "stimuli/img/color_vision_test1.jpg",
    option1: "no",
    option2: "yes",
    expected: "yes",
    id: 'color-vision-test-test-blue'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the GREEN block on the right picture?",
    picture1: "stimuli/img/color_vision_test1.jpg",
    picture2: "stimuli/img/color_vision_test0.jpg",
    option1: "no",
    option2: "yes",
    expected: "yes",
    id: 'color-vision-test-test-green'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    picture1: "stimuli/img/color_vision_train0.jpg",
    picture2: "stimuli/img/color_vision_train1.jpg",
    option1: "no",
    option2: "yes",
    question: "Is the RED block on the left picture?",
    expected: "yes",
    id: 'color-vision-train-train-red'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    picture1: "stimuli/img/color_vision_train0.jpg",
    picture2: "stimuli/img/color_vision_train1.jpg",
    option1: "no",
    option2: "yes",
    question: "Is the YELLOW block on the left picture?",
    expected: "no",
    id: 'color-vision-train-train-yellow'
  }
]

// ----- TEST TRIALS PROBABILITIES (ex.1)---- //

var slider_rating_trials = [
  {
    picture: "stimuli/img/group/ac1_lh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac1_uu.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac1_uh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac1_hh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac2_ll.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac2_ul.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac2_hl.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac2_uh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/ac2_hh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/independent_ll.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/independent_ul.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/independent_uh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/independent_hl.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  },
  {
    picture: "stimuli/img/group/independent_hh.jpg",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2Icon.ac,
    icon2: id2Icon.a,
    icon3: id2Icon.c,
    icon4: id2Icon.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  }

];
// adapt path to pictures depending on colour group in each trial
// add group and id separately
let n = slider_rating_trials.length;
// here I changed code to save changes into slider_rating_trials 22.5. Malin
_.map(slider_rating_trials, function (trial) {
  let group = _.sample(["group1", "group2"]);
  trial.picture = trial.picture.replace("group", group);
  trial.group = group;
  let id = trial.picture.split("/")
  trial.id = id[id.length - 1].slice(0, -4);
});

// ----- TRAINING TRIALS (Buttons) for exp1 + exp2 ---- //
// the data of the training stimuli is always the same,
// the 4 buttons are always shown in same order
let TRAIN_TRIALS = [];
let train_ids = _.map(TrainStimuli.list_all, 'id');
train_ids
  .forEach(function (id) {
    let data = {
      QUD: 'Which block(s) do you think will fall? Click on RUN to see!',
      id: id,
      icon1: id2IconTrain.ac,
      icon2: id2IconTrain.a,
      icon3: id2IconTrain.c,
      icon4: id2IconTrain.none,
      question1: text_train_buttons.short.ac,
      question2: text_train_buttons.short.a,
      question3: text_train_buttons.short.c,
      question4: text_train_buttons.short.none,
      question: '',
      expected: TrainExpectations[id],
      optionLeft: '',
      optionRight: '',
      group: '',
      picture: ''
    };
    TRAIN_TRIALS.push(data);
  });

// one of the training trials is used with sliders/fridge view as in test phase instead of buttons
let id_slider = 'ind2';
TRAIN_SLIDER_TRIALS = _.filter(TRAIN_TRIALS, function(trial){
  return trial.id == id_slider
})
TRAIN_SLIDER_TRIALS[0].QUD =
  "Please indicate how likely you think the represented events will occur.";
TRAIN_SLIDER_TRIALS[0].picture = "stimuli/img/" + id_slider + ".jpg";
TRAIN_SLIDER_TRIALS[0].optionLeft = 'impossible';
TRAIN_SLIDER_TRIALS[0].optionRight = 'certain';

// ----- FRIDGE TRIALS ---- //
// fridge trials have the same input data slider_rating_trials
let FRIDGE_TRIALS = _.cloneDeep(slider_rating_trials)
FRIDGE_TRIALS = _.map(FRIDGE_TRIALS, function (trial, i) {
  ['question1', 'question2', 'question3', 'question4',
   'response3', 'response4',
   'optionLeft', 'optionRight', 'expected'].forEach(function(key){
    trial[key] = '';
  });
  trial.QUD = "How would you most naturally describe the following scene?";
  trial.sentence = "";
  trial = _.omit(trial, ['icon1', 'icon2', 'icon3', 'icon4']);
  return trial
});


let fridge_ex = Object.assign({}, FRIDGE_TRIALS[0])
fridge_ex.picture = "stimuli/img/fridge_example.jpg";
fridge_ex.id = id_slider
const FRIDGE_EXAMPLE_TRIALS = [fridge_ex];





// PRE-TEST for steepness / edge
// let pretest_trial = function(angle, dir){
//   return {QUD: "Please answer the question below by moving the slider.",
//           picture: "stimuli/img/pretest/ramp-side/" + dir + "-" + angle.toString() + "-group.jpg",
//           question: 'Do you think the <b>group</b> block will fall?',
//           optionLeft: "impossible",
//           optionRight: "certain",
//           id: '', question1: '', question2: '', question3: '', question4: '',
//           icon1: '', icon2: '', icon3: '', icon4: '',
//           response1: '', response2: '', response3: '', response4: '',
//           expected: '', group: '',	picture1: '',	picture2: '',
//           noticed_steepness: '',	noticed_ball: ''
//         };
// }
// var pretest_trials = [];
// PRETEST_ANGLES.forEach(function (angle) {
//   pretest_trials.push(pretest_trial(angle, "horiz"))
//   pretest_trials.push(pretest_trial(angle, "vert"))
// })
//
// let sides = ["left", "right"];
// pretest_trials = _.shuffle(pretest_trials);
// _.map(pretest_trials, function (trial, i) {
//   let color = _.sample(BLOCK_COLS.test);
//   trial.picture = trial.picture.replace("group", color);
//   let side = i % 2 === 0 ? sides[0] : sides[1];
//   trial.picture = trial.picture.replace("side", side);
//   trial.question = trial.question.replace("group", color);
//   let id = trial.picture.split("/")
//   trial.id = id[id.length - 1].slice(0, -4);
// });
