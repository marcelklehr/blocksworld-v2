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


var slider_rating_trials = [
  // {
  //   picture: "stimuli/img/group/ac1_ll.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
  // {
  //   picture: "stimuli/img/group/ac1_lu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: text_sliders.ac,
  //   question2: text_sliders.a,
  //   question3: text_sliders.c,
  //   question4: text_sliders.none,
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/ac1_ul.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/ac1_hl.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
  // {
  //   picture: "stimuli/img/group/ac1_hu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  // question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  // question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  // question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  // question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  // question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/ac2_uu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/independent_lu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  // question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  // question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  // question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  // question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  // question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
  // {
  //   picture: "stimuli/img/group/independent_lh.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/independent_uu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
  //   icon1: id2Icon.ac,
  //   icon2: id2Icon.a,
  //   icon3: id2Icon.c,
  //   icon4: id2Icon.none,
  //   question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
  //   question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
  //   question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
  //   question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
  //   question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  },
  // {
  //   picture: "stimuli/img/group/independent_hu.jpg",
  //   QUD: "Please indicate how likely you think the represented events will occur.",
    // icon1: id2Icon.ac,
    // icon2: id2Icon.a,
    // icon3: id2Icon.c,
    // icon4: id2Icon.none,
    // question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.test),
    // question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.test),
    // question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.test),
    // question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.test),
    // question: '',
  //   optionLeft: "impossible",
  //   optionRight: "certain"
  // },
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
    question: '',
    optionLeft: "impossible",
    optionRight: "certain"
  }

];

// adapt path to pictures depending on colour group in each trial
// add group and id separately
let n = slider_rating_trials.length;
_.map(slider_rating_trials, function (trial) {
  let group = _.sample(["group1", "group2"]);
  trial.picture = trial.picture.replace("group", group);
  trial.group = group;
  let id = trial.picture.split("/")
  trial.id = id[id.length - 1].slice(0, -4);
});

// PRE-TEST for steepness / edge
let pretest_trial = function(angle, dir){
  return {QUD: "Please answer the question below by moving the slider.",
          question: '',
          picture: "stimuli/img/pretest/ramp-side/" + dir + "-" + angle.toString() + "-group.jpg",
          question: 'Do you think the <b>group</b> block will fall?',
          optionLeft: "impossible",
          optionRight: "certain",
          id: '', question1: '', question2: '', question3: '', question4: '',
          icon1: '', icon2: '', icon3: '', icon4: '',
          response1: '', response2: '', response3: '', response4: '',
          expected: '', group: '',	picture1: '',	picture2: '',
          noticed_steepness: '',	noticed_ball: ''
        };
}
var pretest_trials = [];
PRETEST_ANGLES.forEach(function(angle){
  pretest_trials.push(pretest_trial(angle, "horiz"))
  pretest_trials.push(pretest_trial(angle, "vert"))
})

let sides = ["left", "right"];
pretest_trials = _.shuffle(pretest_trials);
_.map(pretest_trials, function (trial, i) {
  let color = _.sample(BLOCK_COLS.test);
  trial.picture = trial.picture.replace("group", color);
  let side = i % 2 === 0 ? sides[0] : sides[1];
  trial.picture = trial.picture.replace("side", side);
  trial.question = trial.question.replace("group", color);
  let id = trial.picture.split("/")
  trial.id = id[id.length - 1].slice(0, -4);
});
// console.log(_.map(pretest_trials, 'id'))


// TRAINING TRIALS (some with buttons some with sliders)
let train_slider_trials = [
  {
    picture: "",
    QUD: "Please indicate how likely you think the represented events will occur.",
    icon1: id2IconTrain.ac,
    icon2: id2IconTrain.a,
    icon3: id2IconTrain.c,
    icon4: id2IconTrain.none,
    question1: abbreviateQuestion(text_sliders.ac, BLOCK_COLS_SHORT.train),
    question2: abbreviateQuestion(text_sliders.a,  BLOCK_COLS_SHORT.train),
    question3: abbreviateQuestion(text_sliders.c,  BLOCK_COLS_SHORT.train),
    question4: abbreviateQuestion(text_sliders.none,  BLOCK_COLS_SHORT.train),
    question: '',
    optionLeft: "impossible",
    optionRight: "certain",
    expected: ''
  }
];

// the data of the training stimuli is always the same, buttons are always shown
// in same order
let TRAIN_TRIALS = [];
let train_ids = _.map(TrainStimuli.list_all, 'id');
train_ids
  .forEach(function (id) {
    let data = {
      QUD: 'Which block(s) do you think will fall? Click on RUN to see!',
      icon1: id2IconTrain.ac,
      icon2: id2IconTrain.a,
      icon3: id2IconTrain.c,
      icon4: id2IconTrain.none,
      question1: text_train_buttons.short.ac,
      question2: text_train_buttons.short.a,
      question3: text_train_buttons.short.c,
      question4: text_train_buttons.short.none,
      question: '',
      expected: '',
      optionLeft: 'impossible',
      optionRight: 'certain'
    };
    TRAIN_TRIALS.push(data);
  });
// let icons_train = Object.values(id2IconTrain)
// train_slider_trials = shuffleQuestionsAllTrials(icons_train, train_slider_trials);

TRAIN_TRIALS = TRAIN_TRIALS.concat(train_slider_trials);
