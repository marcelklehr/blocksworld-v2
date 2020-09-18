// In this file you initialize and configure your experiment using magpieInit

$("document")
  .ready(function () {
    // prevent scrolling when space is pressed
    window.onkeydown = function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    };

    // calls magpieInit
    // in debug mode this returns the magpie-object, which you can access in the console of your browser
    // e.g. >> window.magpie_monitor or window.magpie_monitor.findNextView()
    // in all other modes null will be returned
    window.magpie_monitor = magpieInit({
      // You have to specify all views you want to use in this experiment and the order of them
      views_seq: [
      intro,
      instructions_general,
      instructions_train,
      animation_view,

      // // Experiment 1
      // instruction_slider_example,
      // multiple_slider_train,
      // instructions_test,
      // multiple_slider,

      // Experiment 2
      instructions_fridge,
      fridge_train,
      instructions_fridge_reminder,
      fridge_views[0],
      color_vision_views[0],
      fridge_views[1],
      color_vision_views[1],
      fridge_views[2],
      color_vision_views[2],
      fridge_views[3],
      color_vision_views[3],
      fridge_views[4],
      color_vision_views[4],
      fridge_views[5],
      color_vision_views[5],
      fridge_views[6],
      color_vision_views[6],
      fridge_views[7],
      color_vision_views[7],
      fridge_views[8],
      post_test,
      thanks
    ],
      // Here, you can specify all information for the deployment
      deploy: {
        experimentID: "38",
        serverAppURL: "https://mcmpact.ikw.uni-osnabrueck.de/magpie/api/submit_experiment/",
        // Possible deployment methods are:
        // "debug" and "directLink"
        // As well as "MTurk", "MTurkSandbox" and "Prolific"
        deployMethod: "Prolific",
        contact_email: "britta.grusdt@uni-osnabrueck.de",
        prolificURL: "https://app.prolific.co/submissions/complete?cc=316E9218"
      },
      // Here, you can specify how the progress bar should look like
      progress_bar: {
        // list the view-names of the views for which you want a progress bar
        // multiple_slider.name,
        in: [animation_view.name].concat(_.map(color_vision_views, 'name').concat(
          _.map(fridge_views, 'name'))),
      // Possible styles are "default", "separate" and "chunks"
        style: "default",
        width: 100
      }
    });
  });
