// In this file you can specify the trial data for your experiment
var color_vision_test = [
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the <b>BLUE</b> block on the <b>upper</b> picture?",
    picture: "stimuli/img/color_vision_green_blue.png",
    option1: "yes",
    option2: "no",
    expected: "no",
    id: 'color-vision-green-blue'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the <b>GREEN</b> block on the <b>upper</b> picture?",
    picture: "stimuli/img/color_vision_blue_green.png",
    option1: "yes",
    option2: "no",
    expected: "no",
    id: 'color-vision-blue-green'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the <b>BLUE</b> block on the <b>lower</b> picture?",
    picture: "stimuli/img/color_vision_green_blue.png",
    option1: "yes",
    option2: "no",
    expected: "yes",
    id: 'color-vision-green-blue'
  },
  {
    QUD: "Please click on the button with the correct answer.",
    question: "Is the <b>GREEN</b> block on the <b>lower</b> picture?",
    picture: "stimuli/img/color_vision_blue_green.png",
    option1: "yes",
    option2: "no",
    expected: "yes",
    id: 'color-vision-blue-green'
  }
]
// color vision with dropdown choice
const color_vision_trials = [
    {
        picture: 'stimuli/img/color_vision_green_blue.png',
        QUD: "What's the color of the <b>upper</b> block on the picture?",
        question_left_part: "The upper block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'green',
        id: 'green-blue'
    },
    {
        picture: "stimuli/img/color_vision_blue_green.png",
        QUD: "What's the color of the <b>upper</b> block on the picture?",
        question_left_part: "The upper block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'blue',
        id: 'blue-green'
    },
    {
        picture: "stimuli/img/color_vision_blue.png",
        QUD: "What's the color of the block on the picture?",
        question_left_part: "The block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'blue',
        id: 'blue'
    },
    // {
    //     picture: "stimuli/img/color_vision_red.png",
    //     QUD: "What's the color of the block on the picture?",
    //     question_left_part: "The block is ",
    //     question_right_part: ".",
    //     option1: 'black',
    //     option2: 'blue',
    //     option3: 'green',
    //     option4: 'grey',
    //     option5: 'purple',
    //     option6: 'red',
    //     option7: 'yellow',
    //     expected: 'red',
    //     id: 'red'
    // },
    {
        picture: "stimuli/img/color_vision_green.png",
        QUD: "What's the color of the block on the picture?",
        question_left_part: "The block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'green',
        id: 'green'
    },
    // {
    //     picture: "stimuli/img/color_vision_yellow.png",
    //     QUD: "What's the color of the block on the picture?",
    //     question_left_part: "The block is ",
    //     question_right_part: ".",
    //     option1: 'black',
    //     option2: 'blue',
    //     option3: 'green',
    //     option4: 'grey',
    //     option5: 'purple',
    //     option6: 'red',
    //     option7: 'yellow',
    //     expected: 'yellow',
    //     id: 'yellow'
    // },
    {
        picture: "stimuli/img/color_vision_red_yellow.png",
        QUD: "What's the color of the <b>upper</b> block on the picture?",
        question_left_part: "The upper block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'red',
        id: 'red-yellow'
    },
    {
        picture: "stimuli/img/color_vision_yellow_red.png",
        QUD: "What's the color of the <b>upper</b> block on the picture?",
        question_left_part: "The upper block is ",
        question_right_part: ".",
        option1: 'black',
        option2: 'blue',
        option3: 'green',
        option4: 'grey',
        option5: 'purple',
        option6: 'red',
        option7: 'yellow',
        expected: 'yellow',
        id: 'yellow-red'
    }
];

// ----- TEST TRIALS PROBABILITIES (ex.1)---- //
let test_ids = [];
_.map(PRIORS_IDS, function(ids, key){
    ids = ids.map(function(val){return key + "_" + val});
    test_ids = test_ids.concat(ids)
});

var slider_rating_trials = [];
test_ids.forEach(function(id) {
    slider_rating_trials.push({
      id: id,
      picture: "stimuli/img/group/" + id + ".png",
      QUD: "Task 1: Please indicate how likely you think the shown events will occur.",
      icon1: id2IconTest.ac,
      icon2: id2IconTest.a,
      icon3: id2IconTest.c,
      icon4: id2IconTest.none,
      question1: abbreviateQuestion(text_test_sliders.ac, BLOCK_COLS_SHORT.test),
      question2: abbreviateQuestion(text_test_sliders.a,  BLOCK_COLS_SHORT.test),
      question3: abbreviateQuestion(text_test_sliders.c,  BLOCK_COLS_SHORT.test),
      question4: abbreviateQuestion(text_test_sliders.none,  BLOCK_COLS_SHORT.test),
      optionLeft: "impossible",
      optionRight: "certain",
      expected: ''
    });
});
// adapt path to pictures depending on colour group in each trial
// add group and id separately
let n = slider_rating_trials.length;
// here I changed code to save changes into slider_rating_trials 22.5. Malin
_.map(slider_rating_trials, function (trial) {
  let group = _.sample(["group1", "group2"]);
  trial.picture = trial.picture.replace("group", group);
  trial.group = group;
});

// ----- TRAINING TRIALS (Buttons) for exp1 + exp2 ---- //
// the data of the training stimuli is always the same,
// the 4 buttons are always shown in same order
let TRAIN_TRIALS = [];
let train_ids = _.map(TrainStimuli.list_all, 'id');
let QUD = ANIM_ANSWERS == "sliders" ?
  "Please indicate how likely you think the shown events will occur. Click on RUN to see!" :
  "Which block(s) do you think will fall? Click on RUN to see!";
train_ids
  .forEach(function (id) {
    let comment = ''
    // if(id == 'ssw0') {comment = 'Note: the red block fell off another block.'}
    let data = {
      QUD: QUD,
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
      optionLeft: 'impossible',
      optionRight: 'certain',
      group: '',
      picture: '',
      comment: comment
    };
    TRAIN_TRIALS.push(data);
  });

// one of the training trials is used with sliders/fridge view as in test phase
// instead of buttons
let id_slider = 'ind2';
let train_trials_cloned = _.cloneDeep(TRAIN_TRIALS)
TRAIN_SLIDER_TRIALS = _.filter(train_trials_cloned, function(trial){
  return trial.id == id_slider
});
TRAIN_SLIDER_TRIALS[0].QUD =
  "Task 1: Please indicate how likely you think the shown events will occur.";
TRAIN_SLIDER_TRIALS[0].picture = "stimuli/img/train_slider_fridge/" + id_slider + "_test_colors.jpg";
TRAIN_SLIDER_TRIALS[0].icon1 = id2IconTest.ac
TRAIN_SLIDER_TRIALS[0].icon2 = id2IconTest.a
TRAIN_SLIDER_TRIALS[0].icon3 = id2IconTest.c
TRAIN_SLIDER_TRIALS[0].icon4 = id2IconTest.none
TRAIN_SLIDER_TRIALS[0].question1 = text_test_buttons.short.ac
TRAIN_SLIDER_TRIALS[0].question2 = text_test_buttons.short.a
TRAIN_SLIDER_TRIALS[0].question3 = text_test_buttons.short.c
TRAIN_SLIDER_TRIALS[0].question4 = text_test_buttons.short.none
TRAIN_SLIDER_TRIALS[0].group = "group1"

let INSTRUCTION_SLIDER = [{
  picture: '',
  optionLeft: "impossible",
  optionRight: "certain",
  icon1: id2IconTest.ac,
  icon2: id2IconTest.a,
  icon3: id2IconTest.c,
  icon4: id2IconTest.none,
  question1: text_test_buttons.short.ac,
  question2: text_test_buttons.short.a,
  question3: text_test_buttons.short.c,
  question4: text_test_buttons.short.none,
  expected: '',
  group: '',
  // QUD: `Let us assume, that you are pretty <b>certain</b> that the <b>red
  // block</b> falls, but <b>rather uncertain whether or not</b> the <b>yellow
  // block</b> also falls.
  // <br />
  // The following slider positions are an example for representing these beliefs.`,
  QUD: `In the next training trial, we ask you to indicate <b>how likely</b> you think certain
  blocks <b>will or will not fall</b> by moving the sliders below the respective
  icons.
   <br />
   <br />
  The more certain you are that an event <b>will</b> occur (e.g. both blocks
    will fall), the more you should position the corresponding slider towards the
  <b>right end</b> (<i>will happen</i>) and the more certain you are that it
  <b>will not</b> occur, the more you should position its slider towards the
  <b>left end</b> (<i>will not happen</i>).
  When you are rather <b>uncertain whether or not</b> an event will occur, you should position the corresponding slider in the center, around 0.5.
  <br/>
  <br />
  Here is an example which indicates that you are quite <b>certain</b> that the <b>red</b>
  block <b>will fall</b> (2 lower sliders where <i>red does not fall</i> rated <i>unlikely</i>), but <b>uncertain</b> whether or not the <b>yellow</b> block falls (2 upper sliders where red falls and yellow falls/does not fall have a <i>similar, moderate value</i>).
  <br />
  `,
  question: `Note that your estimates <b>do not necessarily</b> have to <i>sum to 1</i>
  as we are interested in your ratings relative to each other. Also note that you
  will <b>not</b> get feedback about what happens anymore.`
  // question: `Alternatively, the <b>same beliefs</b> can also be represented by setting
  // <b>the upper two sliders to roughly 0.50</b> and the <b>lower two sliders</b>
  // again to <b>small values near 0</b>.
  // Either way is fine - it only depends on your preferences.
  // <br />
  // Please click on <b>CONTINUE</b> to get to the last trial of the training phase.`
}];
// ----- FRIDGE TRIALS ---- //
// fridge trials have the same input data slider_rating_trials
let fridge_trials = _.cloneDeep(slider_rating_trials)
fridge_trials = _.map(fridge_trials, function (trial, i) {
  ['question1', 'question2', 'question3', 'question4',
   'optionLeft', 'optionRight', 'expected'].forEach(function(key){
    trial[key] = '';
  });
  trial.QUD = "Task 2: Please build the best sentence such that another person's<br/> slider ratings match yours as much as possible.",
  trial.sentence = "";
  trial = _.omit(trial, ['icon1', 'icon2', 'icon3', 'icon4']);
  return trial
});


let fridge_ex = Object.assign({}, fridge_trials[0])
fridge_ex.picture = "stimuli/img/train_slider_fridge/ind2_test_colors.jpg";
fridge_ex.id = id_slider
const TRAIN_FRIDGE_TRIALS = [fridge_ex];





// PRE-TEST for steepness / edge
// let pretest_trial = function(angle, dir){
//   return {QUD: "Please answer the question below by moving the slider.",
//           picture: "stimuli/img/pretest/ramp-side/" + dir + "-" + angle.toString() + "-group.jpg",
//           question: 'Do you think the <b>group</b> block will fall?',
//           optionLeft: "will not happen",
//           optionRight: "will happen",
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
