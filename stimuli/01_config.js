const DEBUG = true;
// var MODE = "color-vision"
// var MODE = "train"
var MODE = "test"
// var MODE = "pretest"
// var MODE = "experiment"

const SCENE = {w: 800, h: 400};
PROPS = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 20, 'move_to_roll': 4},
         'bottom': {'w': SCENE.w, 'h': 20},
         'seesaw': {'d_to_walls': 5,
                    'stick': {'w': 20, 'h': 95},
                    'plank': {'w': 220, 'h': 10},
                    'link': {'w': 5, 'h': 10}},
         'ac1_ssw': {'stick': {'w': 20, 'h': 25}, 'plank': {'w': 300, 'h': 10}},
         'ac1_base_ssw': {w: 80, h: 12}
       };

OPTS = {
  'walls': {isStatic: true, render: {fillStyle: cols.grey}},
  'balls': {isStatic: false, restitution: 0.02, friction: 0.0001, density: 0.002},
  'blocks': {isStatic: false, density: 0.001, restitution: .02, friction: 0.0005},
  'plank': {isStatic: false, density: 0.001, restitution: .02, friction: 0.1}
}

let TRIAL_TYPES = ['ac1', 'ac2', 'independent'];
// Proportion of block that's ON TOP of its base wall beneath
let PRIOR = {
  'vertical': {'high': 0.35, 'uncertain': 0.51, 'low': 0.75,
               'uncertainL': 0.55, 'uncertainH': 0.5},
  'horizontal': {'high': 0.35, 'uncertain': 0.50, 'low': 0.65,
                 'uncertainH': 0.49, 'uncertainL': 0.55, 'lowL': 0.70},
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
  'horizontal': {'high': 100, 'uncertainH': 115, 'uncertain': 150,
                 'uncertainL': 175, 'low': 250},
  'vertical': {'high': 150, 'uncertainH': 175, 'uncertain': 200,
               'uncertainL': 225, 'low': 300},
  'default': 200
};

// when uncertainty comes from balls, this dist is left towards the edge of platform
let DIST_EDGE = 5;
let SIMULATION = {'duration': 5000};


let HORIZ_IFF = {
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

let HORIZ_AC = {
  'll': ['vertical', 'horizontal'], 'ul': ['vertical', 'horizontal'],
  'uu': ['horizontal', 'horizontal'], 'uh': ['horizontal', 'vertical'],
  'hh': ['vertical', 'vertical'], 'hl': ['horizontal', 'horizontal'],
  'lh': ['horizontal', 'vertical'], 'hu': ['horizontal', 'vertical'],
  'lu': ['vertical', 'horizontal']
}
