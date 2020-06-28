// Here, you can define all custom functions, you want to use and initialize some variables

// You can determine global (random) parameters here

// Declare your variables here

/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// dec2hex :: Integer -> String
const dec2hex = function (dec) {
  return ("0" + dec.toString(16))
    .substr(-2);
};
// generateId :: Integer -> String
const generateID = function (len) {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, this.dec2hex)
    .join("");
};

// Error feedback if participants exceeds the time for responding
const time_limit = function (data, next) {
  if (typeof window.timeout === "undefined") {
    window.timeout = [];
  }
  // Add timeouts to the timeoutarray
  // Reminds the participant to respond after 5 seconds
  window.timeout.push(
    setTimeout(function () {
      $("#reminder")
        .text("Please answer more quickly!");
    }, 5000)
  );
  next();
};

// compares the chosen answer to the value of `option1`
// check_response = function (data, next) {
//   $("input[name=answer]")
//     .on("change", function (e) {
//       if (e.target.value === data.correct) {
//         alert("Your answer is correct! Yey!");
//       } else {
//         alert(
//           "Sorry, this answer is incorrect :( The correct answer was " +
//           data.correct
//         );
//       }
//       next();
//     });
// };
// custom parameters:
const DURATION_ANIMATION = 7000; // in ms
const KEY2SELECTANSWER = "y";

const NB_TRAIN_TRIALS = TrainStimuli.list_all.length;
const TRAIN_BTTN_IDS = [BLOCK_COLS_SHORT.train.join('')].concat(
  BLOCK_COLS_SHORT.train).concat(['none']);

// custom functions:
toggleNextIfDone = function (button, condition) {
  if (condition) {
    button.removeClass("grid-button");
  }
};

automaticallySelectAnswer = function (responseID, button2Toggle) {
  document.getElementById(responseID)
    .value = Math.floor(Math.random() * 101);
  $("#" + responseID)
    .addClass('replied');
}

addKeyToMoveSliders = function (button2Toggle) {
  let counter = 0;
  document.addEventListener("keydown", event => {
    var keyName = event.key;
    if (keyName === KEY2SELECTANSWER && counter <= 3) {
      var id_nb = counter + 1;
      automaticallySelectAnswer("response" + id_nb, button2Toggle);
      counter += 1;
    }
    toggleNextIfDone(button2Toggle, repliedAll());
    return keyName;
  });
}

repliedAll = function () {
  return ($("#response1")
    .hasClass('replied') &&
    $("#response2")
    .hasClass('replied') &&
    $("#response3")
    .hasClass('replied') &&
    $("#response4")
    .hasClass('replied'));
}

_checkSliderResponse = function (id, button2Toggle) {
  $("#" + id)
    .on("change", function () {
      $("#" + id)
        .addClass('replied');
      toggleNextIfDone(button2Toggle, repliedAll());
    });
}

addCheckSliderResponse = function (button2Toggle) {
  _.range(1, 5)
    .forEach(function (i) {
      _checkSliderResponse("response" + i, button2Toggle);
    });
}

abbreviateQuestion = function (question, symbols) {
  let q_words = [];
  question.split(' ')
    .forEach(function (w) {
      w = w.trim()
        .replace('<b>', '');
      w = w.replace('</b>', '');
      if (w === "will" || w === "not") {
        q_words.push(w)
      }
    });
  let w = q_words.join(' ')
  let q_short = w === 'will will' ? symbols.join('') :
    w === 'will will not' ? symbols[0] :
    w === 'will not will' ? symbols[1] : 'none';
  return q_short.toLowerCase();
}

iconHtml2Utterance = function (icon_html) {
  let words = icon_html.trim()
    .split('/');
  let utt1 = words[3].split('.')[0]
  let utt2 = words[6].split('.')[0]
  let utt;
  if (utt1.includes('not')) {
    utt = utt2.includes('not') ? 'none' : utt2[0]; //'not-blue-red';
  } else {
    utt = utt2.includes('not') ? utt1[0] : utt1[0] + utt2[0] // blue-not-red : 'blue-red';
  }
  return {
    short: utt,
    long: [utt1, utt2].join('-')
  };
}

getButtonResponse = function() {
  let responses = []
  let trial_data = {}
  TRAIN_BTTN_IDS.forEach(function(id, i){
    let response = $('#' + id).hasClass('selected');
    trial_data['response' + (i+1)] = response
    responses.push(response)
  });
  return Object.assign(trial_data, {
    'response': responses
  });
}

getSliderResponse = function () {
  let responses = [];
  let trial_data = {}
  _.range(1, 5)
    .forEach(function (i) {
      let response = $("#response" + i)
        .val();
      responses.push(response)
      trial_data['response' + i] = response
    });
  trial_data = Object.assign(trial_data, {
    'response': responses
  });
  return trial_data;
}


showAnimationInTrial = function (CT, html_answers, progress_bar = true) {
  let html_bar = progress_bar ? `<div class='progress-bar-container'>
       <div class='progress-bar'></div>
      </div>` : ``;
  const view_template = html_bar +
    `<div class='magpie-view-stimulus-grid'>
      <animationTitle class='stimulus'>
        <h1>${TRAIN_TRIALS[CT].QUD}</h1>
      </animationTitle>
      <animation id='animationDiv'></animation>
    </div>` +
    html_answers +
    htmlRunNextButtons();

  $('#main')
    .html(view_template);

  let stimulus = SHUFFLED_TRAIN_STIMULI[CT];
  if (DEBUG) {
    console.log(stimulus.id)
  }

  let worldElems = createWorld();
  let engine = worldElems.engine;
  let render = worldElems.render;
  let add_bottom = stimulus.id === "uncertain_2" ? false : true;
  addObjs2World(stimulus.objs, engine, add_bottom);
  show(engine, render);
  let startTime = Date.now();

  return {
    engine,
    render,
    startTime
  }
}


// new for fridge views//MALIN FRIDGE
checkBuildSentence = function (sentenceArray, poss_next, button2Toggle) {
  let verbs = GRAMMAR_VAR['V'].concat(GRAMMAR_VAR['V_I']);
  let has_block = sentenceArray.some(item => ['block', 'blocks'].includes(item));
  let has_verb = sentenceArray.some(item => verbs.includes(item));
  let next_is_conj =  GRAMMAR_VAR["CONJ"].every(item => poss_next.includes(item));
  let last_is_either = _.last(sentenceArray) == "either";
  // console.log('a: ' + a + ', b: ' + b  + ', c: ' + c);
  if(has_block && has_verb && (next_is_conj || last_is_either)) {
    toggleNextIfDone(button2Toggle, true);
  } else {
    button2Toggle.addClass("grid-button");
  }
}

update_clickables = function (lastSelected, submitted=false) {
  WORDS.forEach(function (word) {
    $("#" + word.replace(/\s/g, ''))
    .addClass('not-clickable');
  })
  if(!lastSelected) {
    lastSelected = 'S'
  }
  if (submitted) {
    return [];
  } else {
    let poss_words = shownNext(lastSelected);
    poss_words.forEach(function (word) {
      $("#" + word)
      .toggleClass('not-clickable');
    });
    return poss_words
  }
}

getTrialById = function(trials_all, id){
  let trial = _.filter(trials_all, function(trial){
    return trial.id == id
  })
  trial.length != 1 ? console.error('several trials with id ' + id) : null;
  return trial[0];
}
