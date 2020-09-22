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
  text: `In this experiment you are shown pictures of different arrangements of
          blocks.
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
  A block is considered to <b>fall</b> as soon as it <b>drops off a platform or
  off another block</b>.
  <br/>
  The colored blocks represent common toy blocks <b>without</b> any special or
  unexpected properties and the different colors do <b>not have</b> any meaning.
     <br />
     <br />
  After you selected one of the four buttons (which will make their
  border turn green), click on <b>RUN</b> to see what happens.
  The button of the event that occurred will turn light green.
  <br/>
  After that, you will be able to proceed to the next trial by clicking on <b>NEXT</b>.`,
  buttonText: "CONTINUE"
});

const instructions_train_sliders = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_train_sliders",
  title: "Instructions Training",
  text: `For each presented scene we ask you to think about which blocks will
  fall. We will ask you to indicate <b>how surprised</b> you would be when
  certain blocks fell/did not fall by moving the sliders below the respective
  icons.
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
  A block is considered to <b>fall</b> as soon as it <b>drops off a platform or
  off another block</b>.
  <br/>
  The colored blocks represent common toy blocks <b>without</b> any special or
  unexpected properties and the different colors do <b>not have</b> any meaning.
     <br />
     <br />
  After you moved all four sliders, (the circle on top of the slider will turn
    green at clicking), please click on <b>RUN</b> to see what happens.
  The picture of the event that occurred will be highlighted in green.
  <br/>
  After that, you will be able to proceed to the next trial by clicking on
  <b>NEXT</b>.`,
  buttonText: "CONTINUE"
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
  The more certain you are that an event (e.g. both blocks fall) <b>will</b> occur,
  the more you should position the corresponding slider towards the
  <b>right end</b> (<i>certain</i>/1) and the more certain you are that it
  <b>will not</b> occur, the more you should position its slider towards the
  <b>left end</b> (<i>will not happen</i>).
  <br />
  When you are rather <b>uncertain whether or not</b> an event will occur, you should position the corresponding slider somewhere close to the center around 0.50.
  <br />
  <br />
  Note, that your estimates <b>may</b>, but <b>do not have to</b> sum up to 1.
  <br />
  <br />
  From now on, you won't get feedback anymore about what will actually happen.
  <br />
  That means, after you have moved all four sliders (they turn green when moved
  and clicked to fix its new position), you will directly proceed
  to the next trial by clicking on <b>NEXT</b>.
  <br />
  Please click on <b>CONTINUE</b> to see an example.
  `,
  buttonText: "continue"
});

const instructions_fridge = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_fridge",
  title: "Instructions Test Phase",
  text: `Great - we'll now proceed to the test phase of the experiment.
          Again, you will be shown scenes of different block arrangements.
          However, this time, we ask you to <b>build a sentence</b> that you think is the <b>most natural</b> and <b>most informative utterance</b> to describe what you think happens in the scene.
          <br />
          <br />
          <b>A few things to note</b>:
          <br />
          <b>1</b>. We ask you to concatenate words into a <b>grammatical sentence</b>
          by clicking on their corresponding buttons.
          <br />
          <b>2</b>. At each position in the sentence, you can only select words
          on buttons that are highlighted (by an orange frame).
          <br/>
          <b>3</b>. You always have the possibility to <b>make corrections</b> by clicking on <b>DELETE LAST WORD</b> in the lower right of the screen.
          <br />
          <b>4</b>. After you have built the sentence (shown word by word in a box in the lower left), click on <b>SUBMIT SENTECE</b> to continue (not clickable for all combinations, e.g. if ungrammatical).
          <br />
          <b>5</b>. If you think that a different sentence, that you couldn't built with the available words, would describe the scene more naturally, click on <b>USE MY OWN WORDS</b> and type it into the box that will appear in the lower left corner.
          By clicking on <b>NEXT SCENE</b>, your sentence <b>will be submitted and</b>
          you will directly <b>get to the next trial</b>.
          <br />
          Otherwise, click on <b>NEXT SCENE</b> right away to continue straight with the next trial.
          <br />
          <br />
          There will be one example trial next before we start with the actual test phase.`,
  buttonText: "continue with example trial"
});


const instructions_test = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_test",
  title: "Instructions Test Phase",
  text: `Great -  we'll now proceed to the test phase of the experiment.
    <br />
    Again, you will be shown scenes of different block arrangements.
    As in the previous trial, we will ask you to indicate <b>how likely</b> you
    think certain blocks <b>will or will not fall</b> (<i>left: impossible event,
    right: certain event</i>). Also, <b>you will not get feedback</b> anymore about
    what will actually happen.
    <br />
    Only after you have given your estimate for all four sliders by moving them
    (all circles have to be green), you will be able proceed to the next trial.
    <br />
    <br />
    <b>Please note and keep in mind</b>:
    <br />
    <b>1</b>. Your estimates <b>may</b>, but <b>do not have to</b> <i>sum to 1</i>.
    <br />
    <b>2</b>. A block is considered to <b>fall</b> as soon as it <b>drops</b> from
    a platform or from another block - that is, a block does not necessarily need
    to fall to the ground in order to count as falling.
    <br/>
    <b>3</b>. The colored blocks all have <b>the same properties</b>; the colors
    are only used to distinguish them.
      </br>
      </br>
    We will now start with the test phase which comprises <b>18</b> scenes in total.`,
  buttonText: "start test phase"
});

const instructions_fridge_reminder = magpieViews.view_generator("instructions", {
  trials: 1,
  name: "instructions_fridge_reminder",
  title: "Please remember",
  text: `<b>1</b>. A block is considered to <b>fall</b> as soon as it <b>drops</b>
    from a platform or from another block - that is, a block does not necessarily
    need to fall to the ground in order to count as falling.
    <br/>
    <b>2</b>. The colored blocks all have <b>the same properties</b>; the colors
    are only used to distinguish them.
    <br/>
    <b>3</b>. The blocks represent common toy blocks <b>without</b> any
    special or unexpected properties.
    </br>
    </br>
    We will now start with the test phase which comprises in total <b>18</b> scenes of
    block arrangements and <b>8</b> simple color questions in between.
    `,
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
//          special or unexpected properties and they are only distinguishable by
//          their color.
//              <br />
//              <br />
//          After you selected one of the four buttons (whose border will turn green),
//          you may click on RUN to see what actually happens. If you were wrong,
//          the selected button will turn red and the correct one will turn light
//          green.
//          Then, you can proceed to the next trial.`,
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
