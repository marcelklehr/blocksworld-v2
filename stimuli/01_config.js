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

let Relations = ['ac_1', 'ac_2', 'independent'];
// Proportion of block that's ON TOP of its base wall beneath
let PRIOR = {
  'vertical': {'high': 0.35, 'uncertain': 0.51, 'low': 0.75,
               'uncertainL': 0.55, 'uncertainH': 0.5},
  'horizontal': {'high': 0.35, 'uncertain': 0.50, 'low': 0.65,
                 'uncertainH': 0.49, 'uncertainL': 0.55, 'lowL': 0.70},
  'impossible': 1
}


// shift of ramp walls such that there is no edge
let OVERLAP_SHIFT = {
  "angle42": 15, "angle40": 15, "angle38": 19, "angle35": 16,  "angle30": 12,
  "angle29": 12, "angle28": 13, "angle27": 12, "angle26": 12, "angle25": 12,
  "angle23": 10, "angle20": 9,
}
// "angle32": 13,
// "angle31": 12,
// "angle43": 25, "angle40": 20,  "angle33": 16,
// "angle32": 16, "angle31": 15, "angle27": 10,
// "angle24": 8, "angle22": 7, "angle20": 6, "angle29": 13,
// }

let ANGLES = {
  'horizontal': {"high": 42, "uncertainH": 30, "uncertain": 29, "uncertainL": 28,
                 "uncertainLL": 27, "low": 23},
  'vertical': {"high": 40, "uncertainH": 30, "uncertain": 27, "uncertainL": 26,
               "uncertainLL": 25, "low": 20}
}

let PRETEST_ANGLES = _.range(45);
let W_BASE_RAMP = {'default': 200, 'high': 150, 'uncertain': 175, 'low': 250,
                   'uncertainL': 200, 'uncertainH': 150};

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
