const DEBUG = false;
// var MODE = "color-vision"
// var MODE = "train"
// var MODE = "test"
// var MODE = "pretest"
var MODE = "experiment"

const SCENE = {w: 800, h: 400};
PROPS = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 20, 'move_to_roll': 4},
         'bottom': {'w': SCENE.w, 'h': 20},
         'seesaw': {'d_to_walls': 5,
                    'stick': {'w': 20, 'h': 95},
                    'plank': {'w': 220, 'h': 10},
                    'link': {'w': 5, 'h': 10}},
         'if1_ssw': {'stick': {'w': 20, 'h': 25}, 'plank': {'w': 300, 'h': 10}},
         'if1_base_ssw': {w: 80, h: 12}
       };

OPTS = {
  'walls': {isStatic: true, render: {fillStyle: cols.grey}},
  'balls': {isStatic: false, restitution: 0.02, friction: 0.0001, density: 0.002},
  'blocks': {isStatic: false, density: 0.001, restitution: .02, friction: 0.001},
  'plank': {isStatic: false, density: 0.001, restitution: .02, friction: 0.1}
}

let TRIAL_TYPES = ['if1', 'if2', 'independent'];
// Proportion of block that's ON TOP of its base wall beneath
let PRIOR = {
  'vertical': {'high': 0.45, 'uncertainH': 0.52, 'uncertain': 0.54,
               'uncertainL': 0.55, 'lowH': 0.62, 'low': 0.70
              },
  'horizontal': {'high': 0.42, 'uncertainH': 0.5, 'uncertain': 0.51,
                 'uncertainL': 0.53, 'lowH': 0.6, 'low': 0.67, 'lowL': 0.70,
                },
  'impossible': 1,
  'conditions': ['high', 'uncertain', 'low']
}


// shift of ramp walls such that there is no edge
let OVERLAP_SHIFT = {
  "angle45": 16,
  "angle42": 15, "angle40": 15, "angle38": 19, "angle35": 16,
  "angle32": 12, "angle30": 12,
  "angle29": 12, "angle28": 13, "angle27": 12, "angle26": 12, "angle25": 12,
  "angle23": 10, "angle20": 9, "angle18": 9
}

let ANGLES = {
  'default': 32
}

let PRETEST_ANGLES = _.range(45);
let BASE_RAMP = {
  'horizontal': {'high': 125, 'uncertainH': 160, 'uncertain': 180,
                 'uncertainL': 200, 'low': 240},
  'vertical': {'high': 160, 'uncertainH': 190, 'uncertain': 220,
               'uncertainL': 250, 'low': 280},
  'default': 200
};

// when uncertainty comes from balls, this dist is left towards the edge of platform
let DIST_EDGE = 5;
let SIMULATION = {'duration': 5000};


let HORIZ_AC2 = {
  'll': ['horizontal', 'horizontal'], 'ul': ['vertical', 'horizontal'],
  'lu': ['vertical', 'horizontal'], 'uu': ['horizontal', 'horizontal'],
  'hu': ['vertical', 'horizontal'], 'uh': ['vertical', 'horizontal'],
  'hh': ['vertical', 'horizontal'], 'hl': ['horizontal', 'horizontal'],
  'lh': ['horizontal', 'vertical']
}

let HORIZ_IND = {
  'll': ['vertical', 'horizontal'], 'ul': ['vertical', 'horizontal'],
  'uu': ['horizontal', 'vertical'], 'uh': ['horizontal', 'vertical'],
  'hh': ['vertical', 'horizontal'], 'hl': ['horizontal', 'vertical'],
  'lh': ['horizontal', 'vertical'], 'hu': ['horizontal', 'vertical'],
  'lu': ['vertical', 'horizontal']
}

let HORIZ_AC1 = {
  'll': ['vertical', 'horizontal'], 'ul': ['vertical', 'horizontal'],
  'uu': ['horizontal', 'vertical'], 'uh': ['horizontal', 'vertical'],
  'hh': ['vertical', 'vertical'], 'hl': ['horizontal', 'horizontal'],
  'lh': ['horizontal', 'vertical'], 'hu': ['horizontal', 'vertical'],
  'lu': ['vertical', 'horizontal']
}
