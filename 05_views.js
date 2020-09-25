// In this file you can instantiate your views
// We here first instantiate wrapping views, then the trial views

/** Wrapping views below

* Obligatory properties

    * trials: int - the number of trials this view will appear
    * name: string

*Optional properties
    * buttonText: string - the text on the button (default: 'next')
    * text: string - the text to be displayed in this view
    * title: string - the title of this view

    * More about the properties and functions of the wrapping views - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#wrapping-views

*/

// Every experiment should start with an intro view. Here you can welcome your participants and tell them what the experiment is about
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: "intro",
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `Thank you for your participation in our study!
         Your anonymous data makes an important contribution to our understanding of human language use.
          <br />
          <br />
          Legal information:
          By answering the following questions, you are participating in a study
          being performed by scientists from the University of Osnabrueck.
          <br />
          <br />
          You must be at least 18 years old to participate.
          <br />
          <br />
          Your participation in this research is voluntary.
          You may decline to answer any or all of the following questions.
          You may decline further participation, at any time, without adverse consequences.
          <br />
          <br />
          Your anonymity is assured; the researchers who have requested your
          participation will not receive any personal information about you.
          `,
  buttonText: "begin the experiment"
});

// const instructions_color_vision = magpieViews.view_generator("instructions", {
//   trials: 1,
//   name: "instructions_color_vision",
//   title: "General Instructions",
//   text: `In this experiment you are shown pictures of different arrangements of
//           blocks.
//          <br />
//          <br />
//          The experiment consists of two phases, a <b>training</b> and a <b>testing</b> phase.
//          In total, you will need about <b>15 minutes</b> to finish it.
//          <br/>
//          <br/>
//          We will start the training phase with a few simple questions concerning
//          the color of the blocks that we will show you in the experiment.
//          Please click on <b>CONITINUE</b> to proceed with the questions.`,
//   buttonText: "continue"
// });

const instructions_general = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_general",
  title: "General Instructions",
  text: `In this experiment you are shown different arrangements of blocks.
         <br />
         <br />
         The experiment consists of two phases, a <b>training</b> and a <b>testing</b> phase.
         In total, you will need about <b>15 minutes</b> to finish it.
         <br/>
         <br/>
         We will now start the training phase which consists of <b>15</b>
         trials. You will see block arrangements similar to those you will be
         shown later in the test phase, such that you are able to <b>develop
         intuitions</b> about the <b>physical properties</b> and get familiar
         with the stimuli.
         <br/>
         <br/>
         <b>Please note</b>:
         <br/>
         We recommend to use <b>Full Screen Mode</b> throughout the experiment
         (usually switched on/off with F11). However, depending on your device and browser, you may still need to scroll down to see all buttons.`,
  buttonText: "Go to Training instructions"
});


// For most tasks, you need instructions views
const instructions_train = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train",
  title: "Instructions Training",
  text: `For each presented scene you will be asked to <b>indicate whether you
  think that most likely both, none or respectively only one of two colored
  blocks will fall</b> (there may be other blocks with different colors than the
  two colored blocks asked for) by clicking on the button with the respective icon.
  <br />
  A falling block is represented by a skewed rectangle and a block that
  does not fall is represented by a rectangle with a line below.
  Here is an exemplary icon for the event:
  <br/>
  <i>The <b>green</b> block <b>falls</b>, but the <b>yellow</b> block
  <b>does not fall</b></i>.
  <br/>
  <br/>
  <img src='stimuli/img/icons/green.png'/>
  <img src='stimuli/img/icons/not-yellow.png' />
  <br/>
  <br/>
  <b>Please note</b>:
  <br/>
  A block is considered to <b>fall</b> as soon as it <b>drops off a platform</b> or
  <b>off another block</b> - that is, a block does not
  necessarily need to fall to the ground in order to count as falling.
  <br/>
  The colored blocks represent common toy blocks <b>without</b> any special
  properties and the different colors do <b>not have</b> any meaning.
     <br />
     <br />
  After you selected one of the four buttons (which will make their
  border turn green), click on <b>RUN</b> to see what happens.
  The button of the event that occurred will turn light green.
  <br/>
  After that, you will be able to proceed with the next trial by clicking on <b>NEXT</b>.`,
  buttonText: "CONTINUE"
});

const instructions_train_sliders = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train_sliders",
  title: "Instructions Training",
  text: `For each presented scene we would like to know <b>how likely</b> you
  think it is that certain blocks will or will not fall.
  <br/>
  For this purpose, your task will be to <b>adjust a slider</b> (left: <i>impossible event</i>,
    right: <i>certain event</i>) for <b>each of four events</b>, each represented by a different icon.
  <br />
  A falling block is represented by a skewed rectangle and a block that
  does not fall is represented by a rectangle with a line below, e.g.
  the following icon represents the event
  <br/>
  '<i>The <b>green</b> block <b>falls</b>, but the <b>yellow</b> block
  <b>does not fall</b></i>':
  <br/>
  <br/>
  <img src='stimuli/img/icons/green.png'/>
  <img src='stimuli/img/icons/not-yellow.png' />
  <br/>
  <br/>
  <b>Please note</b>:
  <br/>
  A block is considered to <b>fall</b> as soon as it <b>drops off a platform</b> or
  <b>off another block</b> - that is, a block does <b>not
  necessarily</b> need to fall to the ground in order to count as falling.
  <br/>
  The blocks represent common toy blocks <b>without</b> any special properties
  and the different colors do <b>not have</b> any meaning.
     <br />
     <br />
  After you moved all four sliders, (the circle on top of the slider will turn
  green at clicking), you will be able to click on <b>RUN</b> to see what happens.
  <br/>
  The slider of the event that occurred will be highlighted in green.
  After that, you will be able to go to the next trial by clicking on
  <b>NEXT SCENE</b>.`,
  buttonText: "start training"
});

const instructions_train3 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train3",
  title: "Instructions Training",
  text: `In the next training trial, we ask you to indicate <b>how likely</b> you think certain
  blocks <b>will or will not fall</b> by moving the sliders below the respective
  icons.
   <br />
   <br />
  The more certain you are that an event <b>will</b> occur, the more you should
  position the corresponding slider towards the
  <b>right end</b> (<i>certain</i>/1) and the more certain you are that it
  <b>will not</b> occur, the more you should position its slider towards the
  <b>left end</b> (<i>will not happen</i>).
  <br />
  When you are rather <b>uncertain whether or not</b> an event will occur, you
  should position the corresponding slider somewhere close to the center around
  0.50.
  <br />
  <br />
  Note, that your estimates <b>may</b>, but <b>do not have to</b> sum up to 1.
  <br />
  <br />
  From now on, you won't get feedback anymore about what will actually happen.
  <br />
  That means, after you have moved all four sliders (they turn green when moved
  and clicked to fix its new position), you will directly proceed with the next
  trial by clicking on <b>NEXT</b>.
  <br />
  Please click on <b>CONTINUE</b> to see an example.
  `,
  buttonText: "continue"
});

const instructions_fridge = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_fridge",
  title: "General Instructions Test Phase",
  text: `Great - we will now proceed with the test phase of the experiment.
  You will see pictures of different block arrangements that we now ask you to
  describe.
  More concretely, your task is to <b>produce the sentence</b> that <b>best
  describes</b> which blocks you think will fall.
  <br />
  <br />
  For this, imagine another person who does not see the picture that you see but
  four sliders as those that you adjusted in the training phase.
  The task of this other person is to to adjust the sliders - <b>based on the
  sentence that you produced</b> - such that they <b>best resemble</b> what you
  think happens in the picture.
  <br/>
  To put it another way, the other person's slider ratings should be as close as
  possible to how your ratings would look like.
  <br/>
  <br/>
  The sentences that you can produce are <b>limited</b>: you will see a <b>set of
  words</b> which we ask you to <b>concatenate by clicking</b> on them.
  <br />
  <br />
  <b>You will be able to produce the following types of sentences</b>:
  <br/>
  <b>1.</b> <b>simple assertions</b>, e.g. <i>The green block
  falls</i>, <i>The blue block does not fall</i>, ...
  <br/>
  <b>2.</b> <b>simple assertions</b> combined with <b>'probably'</b>, e.g.
  <i>The green block probably falls</i>, ...
  <br/>
  <b>3.</b> <b>conjunctions</b>, e.g. <i>The green block and the blue block fall</i>,
  <i>The blue block falls but the green block does not fall</i>, ...
  <br/>
  <b>4.</b> <b>conditionals</b>, e.g. <i>If the green block falls, the blue block
  falls as well</i>, <i>If the green block does not fall, the blue block falls
  </i>, ...`,
  buttonText: "continue"
});
const instructions_fridge_procedure = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_fridge_procedure",
  title: "Procedure Test Phase",
  text: `<b>1</b>. Only the <b>highlighted</b> words (orange frame) are <b>clickable</b>;
  these differ depending on the position in the sentence that you are
  about to produce.
  <br/>
  <b>2</b>. <b>Corrections</b> can be made by clicking on
  <b>DELETE LAST WORD</b> in the lower right of the screen.
  <br />
  <b>3</b>. When you have produced a grammatical sentence (<i>not all
    grammatical sentences are producable!</i>), which is shown
  word by word in a box in the lower left, you will be able to click on
  <b>SUBMIT SENTENCE</b> to continue.
  <br />
  <b>4</b>. If you think there is a sentence that better describes
  what happens in the scene, please click on <b>USE MY OWN WORDS</b> and
  type it into the box that will appear in the lower left corner.
  <br/>
  By clicking on <b>NEXT SCENE</b>, your sentence <b>will be saved and
  you will directly get to the next trial</b>.
  <br/>
  <b>5</b>. If you think that there is no better sentence for describing
  what happens in the scene, click on <b>NEXT SCENE</b>
  right away to continue straight with the next trial.
  <br />
  <br />
  There will be one example trial next before we start with the actual test phase.`,
  buttonText: "go to example trial"
});


const instructions_test = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_test",
  title: "Instructions Test Phase",
  text: `Great -  we'll now proceed with the test phase of the experiment.
    <br />
    As in the training phase, you will be shown scenes of different block
    arrangements and we will ask you to indicate <b>how likely</b> you
    think certain blocks will or will not fall (left: <i>impossible</i>
    event, right: <i>certain</i> event).
    The only difference is that <b>you will not get feedback</b> anymore about
    what will happen.
    <br />
    <br />
    <b>Please keep in mind</b>:
    <br />
    <b>1</b>. A block is considered to <b>fall</b> as soon as it <b>drops off
    a platform</b> or <b>off another block</b> - that is, a block does
    <b>not necessarily</b> need to fall to the ground in order to count as falling.
    <br/>
    <b>2</b>. The colors do not have any meaning, all colored blocks represent
    <b>common toy blocks</b>, they all have <b>the same properties</b> and they
    <b>behave as in the training trials</b>.
    <br/>
    <b>3</b>. Only after you have adjusted all four sliders (all circles on the
    sliders have to be green!), you will be able to proceed with the next trial.
      </br>
      </br>
    We will now start with the test phase which comprises in total <b>18</b>
    scenes of block arrangements and <b>8</b> simple color questions in between.`,
  buttonText: "start test phase"
});

const instructions_fridge_reminder = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_fridge_reminder",
  title: "Please remember",
  text: `<b>1</b>. A block is considered to <b>fall</b> as soon as it <b>drops
    off a platform</b> or <b>off another block</b> - that is, a block does not
    necessarily need to fall to the ground in order to count as falling.
    <br/>
    <br/>
    <b>2</b>. The colors do not have any meaning, all colored blocks represent
    <b>common toy blocks</b>, they all have <b>the same properties</b> and they
    <b>behave as in the training trials</b>.
    <br/>
    <br/>
    <b>3</b>. The sentence that you produce is given as <b>hint to another
    person</b> who has to adjust four sliders (as you did in the training phase)
    , such that this <b>other person's slider ratings most closely resemble to what
    you think happens</b> in the scene, that is to how your slider ratings would look
    like.
    <br/>
    <br/>
    We will now start with the test phase which comprises in total <b>18</b>
    scenes of block arrangements and <b>8</b> simple color questions in between.`,
  buttonText: "start test phase"
});

const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: "post_test",
  title: "Additional information",
  text: "Answering the following questions is optional, but your answers will help us analyze our results.",
  comments_question: 'Further comments'
});


// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: "thanks",
  title: "Thank you very much for taking part in this experiment!",
  prolificConfirmText: "Press the button"
});


// const dropdown_choice_custom = magpieViews.view_generator('dropdown_choice', {
//   trials: color_vision_trials.length,
//   name: "color-vision",
//   data: _.shuffle(color_vision_trials)
// }, {
//   stimulus_container_generator: dropdown_choice_generator.stimulus_container_gen,
//   answer_container_generator: dropdown_choice_generator.answer_container_gen,
//   handle_response_function: dropdown_choice_generator.handle_response_function
// });

const sentence_choice_custom = magpieViews.view_generator("sentence_choice", {
  trials: color_vision_test.length,
  name: "color-vision",
  data: _.shuffle(color_vision_test)
}, {
  stimulus_container_generator: function (config, CT) {
    return `<div class='magpie-view'>
    <h1 class='magpie-view-title'>${config.title}</h1>
    <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
    <div class='magpie-view-stimulus-container'>
      <img src="${config.data[CT].picture}" class = "img"/>
    </div>
  </div>`;
  }
});

// experimental phase trials Experiment1
const multiple_slider = magpieViews.view_generator(
  "slider_rating", {
    // This will use all trials specified in `data`, you can use a smaller value
    // (for testing), but not a larger value
    trials: TEST_TRIALS.length,
    // name should be identical to the variable name
    name: "multiple_slider",
    data: TEST_TRIALS
  },
  // you can add custom functions at different stages through a view's life cycle
  {
    stimulus_container_generator: multi_slider_generator.stimulus_container_gen,
    answer_container_generator: multi_slider_generator.answer_container_gen,
    handle_response_function: multi_slider_generator.handle_response_function
  }
);

const multiple_slider_train = magpieViews.view_generator(
  "slider_rating", {
    trials: TRAIN_SLIDER_TRIALS.length,
    name: "multiple_slider_train",
    data: TRAIN_SLIDER_TRIALS
  },
  {
    stimulus_container_generator: multi_slider_generator.stimulus_container_gen,
    answer_container_generator: multi_slider_generator.answer_container_gen,
    handle_response_function: multi_slider_generator.handle_response_function
  }
)

const instruction_slider_example = magpieViews.view_generator(
  "slider_rating", {
    trials: 1,
    name: "instruction_slider_example",
    data: INSTRUCTION_SLIDER
  }, {
    stimulus_container_generator: multi_slider_generator.example_text_container_gen,
    answer_container_generator: multi_slider_generator.example_answer_container_gen,
    handle_response_function: multi_slider_generator.example_handle_response_function
  }
);

// const fridge_view = magpieViews.view_generator(
//   "slider_rating", {
//     trials: FRIDGE_TRIALS.length,
//     name: "fridge_view",
//     data: FRIDGE_TRIALS
//   }, {
//     stimulus_container_generator: fridge_generator.stimulus_container_gen,
//     answer_container_generator: fridge_generator.answer_container_gen,
//     handle_response_function: fridge_generator.handle_response_function
//   }
// );

fridge_view = function(boundaries){
  let view = magpieViews.view_generator(
    "slider_rating", {
      trials: boundaries[1] - boundaries[0],
      name: "fridge_view" + boundaries.join(""),
      data: FRIDGE_TRIALS.slice(boundaries[0], boundaries[1])
    }, {
      stimulus_container_generator: fridge_generator.stimulus_container_gen,
      answer_container_generator: fridge_generator.answer_container_gen,
      handle_response_function: fridge_generator.handle_response_function
    }
  );
  return(view)
}

let fridge_views = [];
_.map([[0,2], [2, 4], [4, 6], [6, 8], [8, 10], [10, 12], [12, 14], [14, 16], [16, 18]], function(arr){
  fridge_views.push(fridge_view(arr));
});


color_vision_view = function(idx){
  let dropdown_choice_custom = magpieViews.view_generator('dropdown_choice', {
    trials: 1,
    name: "color-vision" + idx,
    data: [COLOR_VISION_TRIALS[idx]]
  }, {
    stimulus_container_generator: dropdown_choice_generator.stimulus_container_gen,
    answer_container_generator: dropdown_choice_generator.answer_container_gen,
    handle_response_function: dropdown_choice_generator.handle_response_function
  });
  return(dropdown_choice_custom)
}

let color_vision_views = [];
_.map(_.range(0,8), function(idx){
  color_vision_views.push(color_vision_view(idx));
});

const fridge_train = magpieViews.view_generator(
  "slider_rating", {
    trials: TRAIN_FRIDGE_TRIALS.length,
    name: "fridge_train",
    data: TRAIN_FRIDGE_TRIALS
  }, {
    stimulus_container_generator: fridge_generator.stimulus_container_gen,
    answer_container_generator: fridge_generator.answer_container_gen,
    handle_response_function: fridge_generator.handle_response_function
  }
);

// const instructions_pretest = magpieViews.view_generator("instructions", {
//   trials: 1,
//   name: "instructions_pretest",
//   title: "Instructions Test Phase",
//   text: `In this short experiment, we ask you to indicate <b>how likely</b> you think
//   a shown toy block <b>will or will not fall</b> by moving a slider.
//    <br />
//   The larger your belief is that the block <b>will</b> fall,
//   the more you should position the slider towards the right end (<i>certainly</i>/100%).
//   <br />
//   The larger your belief is that it <b>will not</b> fall, the more you
//   should position the slider towards its left (<i>impossible</i>/0%).
//   <br/>
//   If you are quite <b>undecided</b> whether or not the block will fall, but you judge
//   it <i>a bit <b>more</b> likely that it <b>won't</b></i> fall, you should for instance move the slider a bit to the left.
//     <br />
//     <br />
//   Click on the <b>NEXT</b> button, which will appear after you have given your estimate by changing the position of the slider, to proceed with the next trial.
//   `
// });
//
// const instructions_train_pretest = magpieViews.view_generator("instructions", {
//   trials: 1,
//   name: "instructions_train_pretest",
//   title: "Instructions Train Phase",
//   text: `We will now start with the training phase
//           which consists of 8 trials. You will see block arrangements such that
//           you are able to develop intuitions about the physical properties and get
//           familiar with the stimuli.
//           <br/>
//           <br/>
//         For each presented scene you will be asked to indicate which of the
//          colored blocks you think will fall by clicking on the button with the
//          respective icons.
//          A falling block is represented by a skewed rectangle
//         and a resting block that <i>does not fall</i> is represented by a rectangle
//         with a line below. Here is an exemplary icon for the event
//         <br/>
//         <i>The <b>green</b> block <b>falls</b>, but the <b>yellow</b> block
//         <b>does not fall</b></i>:
//         <br/>
//         <br/>
//         <img src='stimuli/img/icons/green.png'/>
//         <img src='stimuli/img/icons/not-yellow.png' />
//          <br/>
//          <br/>
//          A block is considered to <b><i>fall</i></b> <b>as soon as it <i>topples
//          over</i> or <i>drops</i> from a platform or from another block.</b>
//          <br/>
//          The colored blocks represent common toy blocks, they do not have any
//          special properties and they are only distinguishable by
//          their color.
//              <br />
//              <br />
//          After you selected one of the four buttons (whose border will turn green),
//          you may click on RUN to see what actually happens. If you were wrong,
//          the selected button will turn red and the correct one will turn light
//          green.
//          Then, you can proceed with the next trial.`,
//   buttonText: "CONTINUE"
// });

// const slider_rating_pretest = magpieViews.view_generator("slider_rating", {
//   trials: pretest_trials.length,
//   name: "pretest",
//   data: pretest_trials
// }, {
//   stimulus_container_generator: function (config, CT) {
//     return `<div class='magpie-view'>
//         <h1 class='magpie-view-title'>${config.title}</h1>
//         <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
//         <div class='stimulus' id='stimulus-pic'>
//           <img src=${config.data[CT].picture}>
//         </div>
//       </div>`;
//   }
// });
