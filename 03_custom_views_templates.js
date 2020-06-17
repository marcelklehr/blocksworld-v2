// In this file you can create your own custom view templates

// A view template is a function that returns a view,
// this functions gets some config (e.g. trial_data, name, etc.) information as input
// A view is an object, that has a name, CT (the counter of how many times this view occurred in the experiment),
// trials the maximum number of times this view is repeated
// and a render function, the render function gets CT and the magpie-object as input
// and has to call magpie.findNextView() eventually to proceed to the next view (or the next trial in this view),
// if it is an trial view it also makes sense to call magpie.trial_data.push(trial_data) to save the trial information
const animation_view1 = {
  name: "animation",
  title: "title",
  CT: 0, //is this the start value?
  trials: NB_TRAIN_TRIALS - 1,
  data: "",
  // The render function gets the magpie object as well as the current trial
  // in view counter as input
  render: function (CT, magpie) {
    let html_answers = htmlButtonAnswers();
    let animation = showAnimationInTrial(CT, html_answers);

    let cleared = false;
    Events.on(animation.engine, 'afterUpdate', function (event) {
      if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
        clearWorld(animation.engine, animation.render, stop2Render = false);
        cleared = true;
      }
    });
    let id_bttn_selected;
    TRAIN_BTTN_IDS.forEach(function (id) {
      $('#' + id)
        .on('click', function (e) {
          var parent = document.getElementById('TrainButtons');
          let selected = parent.getElementsByClassName("selected");
          let nb_selected = selected.length;
          if (nb_selected === 1) {
            TRAIN_BTTN_IDS.forEach(function (bttn) {
              $('#' + bttn)
                .hasClass('selected') ?
                $('#' + bttn)
                .removeClass('selected') : null;
            })
          }
          $('#' + id)
            .addClass('selected');
          id_bttn_selected = id;
          nb_selected = 1;
          toggleNextIfDone($('#runButton'), true);
        });
    });

    let animationStarted = false;
    let id_button_correct;
    $('#runButton')
      .on('click', function (e) {
        if (!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          $(".selected")
            .off("click");
          $(".unselected")
            .off("click");

          let c = SHUFFLED_TRAIN_STIMULI[CT].id
          id_button_correct = ["independent_3"].includes(c) ? "none" : ['independent_1', "uncertain_0", "independent_0"].includes(c) ? "a" : ["uncertain_1", "uncertain_2", "uncertain_3"].includes(c) ? "c" : "ac";
          $('#' + id_button_correct)
            .addClass("correct");
          id_bttn_selected !== id_button_correct ?
            $('#' + id_bttn_selected)
            .addClass('incorrect') : null;
        }
      });

    $("#buttonNextAnimation")
      .on("click", function () {
        const RT = Date.now() - animation.startTime; // measure RT before anything else
        if (!cleared) {
          clearWorld(animation.engine, animation.render, stop2Render = false);
        }
        let data = getButtonResponse();
        let trial_data = Object.assign(data, {
          trial_name: 'animation_buttons',
          trial_number: CT + 1,
          RT: RT,
          id: SHUFFLED_TRAIN_STIMULI[CT].id
        });

        let copied = Object.assign({}, TRAIN_TRIALS[CT])
        copied.icon1 = iconHtml2Utterance(copied.icon1)
          .short;
        copied.icon2 = iconHtml2Utterance(copied.icon2)
          .short;
        copied.icon3 = iconHtml2Utterance(copied.icon3)
          .short;
        copied.icon4 = iconHtml2Utterance(copied.icon4)
          .short;
        copied.expected = id_button_correct === "ac" ? 'response1' :
          id_button_correct === "a" ? 'response2' :
          id_button_correct === "c" ? 'response3' :
          id_button_correct === "none" ? 'response4' : '';

        trial_data = magpieUtils.view.save_config_trial_data(
          copied,
          trial_data
        );
        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      });
  }
};

const animation_view2 = {
  name: "animation",
  title: "title",
  CT: NB_TRAIN_TRIALS - 1, //is this the start value?
  trials: 1,
  data: "",
  // The render function gets the magpie object as well as the current trial
  // in view counter as input
  render: function (CT, magpie) {
    let html_answers = htmlSliderAnswers(TRAIN_TRIALS[CT])
    let animation = showAnimationInTrial(CT, html_answers, progress_bar = false);

    let cleared = false;
    Events.on(animation.engine, 'afterUpdate', function (event) {
      if (!cleared && animation.engine.timing.timestamp >= DURATION_ANIMATION) {
        clearWorld(animation.engine, animation.render, stop2Render = false);
        cleared = true;
      }
    });
    addCheckSliderResponse($('#runButton'));
    DEBUG ? addKeyToMoveSliders($("#runButton")) : null;

    let animationStarted = false;
    $('#runButton')
      .on('click', function (e) {
        if (!animationStarted) {
          animationStarted = true;
          runAnimation(animation.engine);
          toggleNextIfDone($("#buttonNextAnimation"), true);
          //selected answers can't be changed anymore
          _.range(1, 5)
            .forEach(function (i) {
              document.getElementById("response" + i)
                .disabled = true;
            });
        }
      });
    $("#buttonNextAnimation")
      .on("click", function () {
        const RT = Date.now() - animation.startTime; // measure RT before anything else
        if (!cleared) {
          clearWorld(animation.engine, animation.render, stop2Render = false);
        }
        let data = getSliderResponse();
        let trial_data = Object.assign(data, {
          trial_name: 'animation_slider',
          trial_number: CT + 1,
          RT: RT,
          id: SHUFFLED_TRAIN_STIMULI[CT].id
        });
        var copied = Object.assign({}, TRAIN_TRIALS[CT]);
        copied.icon1 = iconHtml2Utterance(copied.icon1)
          .short;
        copied.icon2 = iconHtml2Utterance(copied.icon2)
          .short;
        copied.icon3 = iconHtml2Utterance(copied.icon3)
          .short;
        copied.icon4 = iconHtml2Utterance(copied.icon4)
          .short;
        copied.expected = ''; // sliders dont have an expected outcome!

        trial_data = magpieUtils.view.save_config_trial_data(
          copied,
          trial_data
        );
        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      });
  }
};


// generate a new multi_slider
const multi_slider_generator = {
  stimulus_container_gen: function (config, CT) {
    return `<div class='magpie-view'>
        <h2 class='stimulus'>${config.data[CT].QUD}</h5>
        <div class='stimulus'>
          <img src=${config.data[CT].picture} class ='picture'>
        </div>
      </div>`;
  },

  answer_container_gen: function (config, CT) {
    return htmlSliderAnswers(config.data[CT]) +
      `<button id='buttonNext' class='grid-button magpie-view-button'>Next scene</button>`;
  },

  handle_response_function: function (
    config,
    CT,
    magpie,
    answer_container_generator,
    startingTime
  ) {
    $(".magpie-view")
      .append(answer_container_generator(config, CT));
    let button = $("#buttonNext");
    // function for debugging - if "y" is pressed, the slider will change
    if (DEBUG) {
      addKeyToMoveSliders(button);
      console.log(config.data[CT].id)
    }
    addCheckSliderResponse(button);
    button.on("click", function () {
      const RT = Date.now() - startingTime; // measure RT before anything else
      let responseData = getSliderResponse();
      let trial_data = Object.assign(responseData, {
        trial_name: config.name,
        trial_number: CT + 1,
        RT: RT
      });

      var copied = Object.assign({}, config.data[CT]);
      copied.icon1 = iconHtml2Utterance(copied.icon1)
        .short;
      copied.icon2 = iconHtml2Utterance(copied.icon2)
        .short;
      copied.icon3 = iconHtml2Utterance(copied.icon3)
        .short;
      copied.icon4 = iconHtml2Utterance(copied.icon4)
        .short;

      trial_data = magpieUtils.view.save_config_trial_data(
        copied,
        trial_data
      );
      magpie.trial_data.push(trial_data);
      magpie.findNextView();
    });
  }
};


const custom_posttest_generator = {
  answer_container_gen: function (config, CT) {
    const quest = magpieUtils.view.fill_defaults_post_test(config);
    return `<form>
                    <p class='magpie-view-text'>
                        <label for="age">${quest.age.title}:</label>
                        <input type="number" name="age" min="18" max="110" id="age" />
                    </p>
                    <p class='magpie-view-text'>
                        <label for="gender">${quest.gender.title}:</label>
                        <select id="gender" name="gender">
                            <option></option>
                            <option value="${quest.gender.male}">${quest.gender.male}</option>
                            <option value="${quest.gender.female}">${quest.gender.female}</option>
                            <option value="${quest.gender.other}">${quest.gender.other}</option>
                        </select>
                    </p>
                    <p class='magpie-view-text'>
                        <label for="education">${quest.edu.title}:</label>
                        <select id="education" name="education">
                            <option></option>
                            <option value="${quest.edu.graduated_high_school}">${quest.edu.graduated_high_school}</option>
                            <option value="${quest.edu.graduated_college}">${quest.edu.graduated_college}</option>
                            <option value="${quest.edu.higher_degree}">${quest.edu.higher_degree}</option>
                        </select>
                    </p>
                    <p class='magpie-view-text'>
                        <label for="languages" name="languages">${quest.langs.title}:<br /><span>${quest.langs.text}</</span></label>
                        <input type="text" id="languages"/>
                    </p>
                    <p class="magpie-view-text">
                        <label for="ramp1">Did you notice that in those trials, where a ball was present, the incline of the ramp was of different steepness?</label>
                        <textarea name="ramp1" id="ramp1" rows="1" cols="40"></textarea>
                    </p>
                    <p class="magpie-view-text">
                        <label for="comments">${quest.comments.title}</label>
                        <textarea name="comments" id="comments" rows="6" cols="40"></textarea>
                    </p>

                    <button id="next" class='magpie-view-button'>${config.button}</button>
            </form>`
  },

  handle_response_function: function (config, CT, magpie, answer_container_generator, startingTime) {
    $(".magpie-view")
      .append(answer_container_generator(config, CT));

    $("#next")
      .on("click", function (e) {
        // prevents the form from submitting
        e.preventDefault();

        // records the post test info
        magpie.global_data.age = $("#age")
          .val();
        magpie.global_data.gender = $("#gender")
          .val();
        magpie.global_data.education = $("#education")
          .val();
        magpie.global_data.languages = $("#languages")
          .val();
        magpie.global_data.comments = $("#comments")
          .val()
          .trim();
        magpie.global_data.noticed_steepness = $("#ramp1")
          .val();
        magpie.global_data.endTime = Date.now();
        magpie.global_data.timeSpent =
          (magpie.global_data.endTime -
            magpie.global_data.startTime) /
          60000;

        // moves to the next view
        magpie.findNextView();
      });
  }
};

// generate a new fridge view
const fridge_generator = {
  stimulus_container_gen: function (config, CT) {
    return `<div class='magpie-view'>
      <h1 class='stimulus'>
      ${config.data[CT].QUD}
      </h1>
      <div class='stimulus'>
      <img src=${config.data[CT].picture}>
      </div>
      </div>`;
  },


  answer_container_gen: function (config, CT) {

    let start_words = _.flatten(shownNext('S'));

    function return_word_array(array, color) {
      return array.map((word, index) => {
          let clickable = start_words.includes(word) ? ' ' : ' not-clickable ';
          return (
            `<div class="word ` + color + clickable + `"id=` +
            word.replace(/\s/g, '') + ` >
            <p> ` +
            word +
            ` </p>
          </div>`
          ); + `</div> `
        })
        .join('')
    }
    let wordArray1 = ["maybe", "likely", "probably", "only", "rather"]
    let wordArray2 = ["not", "neither", "nor", "no", "won't", "but"]
    let wordArray3 = ["if", "and", "or", "to", "due to", "because of", "the"]
    let wordArray4 = ["block", "blocks", "green", "blue", "red", "yellow", "both"]
    let wordArray5 = ["fall", "falls", "will", "cause", "causes", "make", "makes", "do", "does"]

    return `<div class = "fix-box"> <div class="fridge">` +
      // return_word_array(wordArray1, "magpie-view-button green") +
      // return_word_array(wordArray2, "red") + return_word_array(wordArray3, "blue") + return_word_array(wordArray4, "purple") +
      // return_word_array(wordArray5, "orange") +
      return_word_array(word_groups[0].words, "magpie-view-button green") +
      return_word_array(word_groups[1].words, word_groups[1].col) +
      return_word_array(word_groups[2].words, word_groups[2].col) +
      return_word_array(word_groups[3].words, word_groups[3].col) +
      return_word_array(word_groups[4].words, word_groups[4].col) +
      return_word_array(word_groups[5].words, word_groups[5].col) +
      `</div>
      <br><br/>
      <div class ="sentence selected1" style = "font-size: 20px"> Your sentence:
        <span class = "selected-words" id ="sentence"> ${config.data[CT].sentence} </span>
      </div>
      <button id='buttonDelete' class='magpie-view-button delete-word'> delete last word </button>
      <br><br/>
      <br><br/>
      <button id='buttonSubmit' class='magpie-view-button grid-button submit-sentence '> submit sentence</button>
      <div class = "magpie-nodisplay custom-sentence sentence" >
        <p class="magpie-view-text">
          <label for="custom-text" style = "font-size: 20px"> Your custom sentence: </label>
          <input type="text" id="custom-text" name="textbox-input" cols = 50 class='magpie-response-text selected-words'>
        </p>
      </div>
      <div class = "buttons">
        <button id ='customWords' class="magpie-view-button custom-words magpie-nodisplay"> Use my own words </button>
        <button id='buttonNext' class='magpie-view-button magpie-nodisplay'>Next scenario</button>
      </div>
      <br><br/>

    </div>`;
  },

  handle_response_function: function (
    config,
    CT,
    magpie,
    answer_container_generator,
    startingTime
  ) {
    $(".magpie-view")
      .append(answer_container_generator(config, CT));
    let button = $("#buttonNext");
    let submitbutton = $("#buttonSubmit");

    let sentence_array = [];
    let sentence = "";
    let custom_sentence = "";

    let textInput = $("#custom-text");

    // each word which is pressed is saved in an array to build the sentence
    $(".word")
      .click(function () {
        var value = $(this)
          .text()
          .replace(/(\r\n|\n|\r)/gm, " ")
          .trim();
        sentence_array.push(value)

        update_clickables(value);

        $(".selected-words")
          .append(" " + value)
        // console.log(sentence_array);
        // console.log(config.data[CT].sentence);
        sentence = sentence_array.toString()
          .replace(/,/g, " ");
        //sentence = sentence.replace(/,/, " ");
        // console.log(sentence.replace(/,/, " "));

        checkBuildSentence(sentence_array, submitbutton)
        //sentence = sentence.replace(/,/, " ");
        // console.log(sentence);
      });

    $(".delete-word")
      .click(function () {
        sentence_array.pop();
        var sentence = sentence_array.join(" ")

        $(".selected-words")
          .empty();

        $(".selected-words")
          .append(sentence);

        config.data[CT].sentence = sentence;

        let value = _.last(sentence_array)

        update_clickables(value);

        checkBuildSentence(sentence_array, submitbutton);
      });


    $("#customWords")
      .on("click", function () {

        const minChars = config.data[CT].min_chars === undefined ? 10 : config.data[CT].min_chars;

        $(".custom-sentence")
          .removeClass("magpie-nodisplay");

        submitbutton.addClass("grid-button");
        // $("#customWords")
        //   .addClass("magpie-nodisplay");

        // attaches an event listener to the textbox input
        textInput.on("keyup", function () {
          //document.getElementById('custom-text').value = " ";
          //textInput.value = ' ';
          // if the text is longer than (in this case) 10 characters without the spaces
          // the 'next' button appears
          if (textInput.val()
            .trim()
            .length > minChars) {
            console.log(textInput.val());
            submitbutton.removeClass("grid-button");
          } else {
            submitbutton.addClass("grid-button");
          }
        });

        custom_sentence = document.getElementById('custom-text');
        console.log(custom_sentence);
      });




    // function for debugging - if "y" is pressed, the slider will change
    // if (magpie.deploy.deployMethod === "debug") {
    //   addShortCut2SelectAnswers(sentence, button);
    // }

    //addCheckResponseFunctionality(button);

    submitbutton.on("click", function () {
      $("#buttonNext")
        .removeClass("magpie-nodisplay")
      $("#customWords")
        .removeClass("magpie-nodisplay");
      toggleNextIfDone($("#customWords"), true);
      buttonDelete
      submitbutton.addClass("magpie-nodisplay");
      $("#buttonDelete")
        .addClass("magpie-nodisplay");
      $(".selected1")
        .addClass("magpie-nodisplay");
    });

    button.on("click", function () {
      const RT = Date.now() - startingTime; // measure RT before anything else
      // let responseData = saveTrialQA();
      let trial_data = {
        trial_name: config.name,
        trial_number: CT + 1,
        response: sentence, //config.sentence_array, //sentence, //sentence_array,
        custom_response: custom_sentence.value,
        // response: responseData.responses,
        // utterances: responseData.questions,
        RT: RT
      };
      trial_data = magpieUtils.view.save_config_trial_data(
        config.data[CT],
        trial_data
      );
      magpie.trial_data.push(trial_data);
      magpie.findNextView();
    });
  }
};
