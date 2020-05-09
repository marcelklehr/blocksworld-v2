const DEBUG = false;
// var MODE = "color-vision"
// var MODE = "train"
// var MODE = "test"
var MODE = "pretest"
// var MODE = "experiment"

var scene = {w: 800, h: 400};
PROPS = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 16, 'color': cols.purple},
         'bottom': {'w': scene.w, 'h': 20},
         'seesaw': {'d_to_walls': 5},
         'seesaw_a_iff_c': {'stick': {'w': 20, 'h': 95},
                            'plank': {'w': 220, 'h': 10},
                            'link': {'w': 5, 'h': 10}},
        'seesaw_independent': {'stick': {'w': 20, 'h': 40},
                               'plank': {'w': 220, 'h': 10},
                               'link': {'w': 5, 'h': 10}}
       };

OPTS = {
  'walls': {isStatic: true, render: {fillStyle: cols.grey}},
  'balls': {isStatic: false, restitution: 0.02, friction: 0.001, density: 0.1},
  'blocks': {isStatic: false, density: 0.006, restitution: .02, friction: 0.1},
  'seesaw_plank': {isStatic: false}
}

let Relations = ['a_implies_c', 'a_iff_c', 'independent'];
// Proportion of block that's ON TOP of its base wall beneath
let PRIOR = {'high': 0.35, 'uncertain': 0.505, 'low': 0.65, 'uncertainL': 0.52}

// shift of ramp walls such that there is no edge
let OVERLAP_SHIFT = {"angle43": 25, "angle40": 20, "angle35": 18, "angle32": 16,
  "angle30": 14.5, "angle28": 10, "angle27": 10, "angle26": 9, "angle25": 9,
  "angle24": 8, "angle22": 7, "angle20": 6
}

let ANGLES = {
  'horizontal': {"high": 43, "uncertainH": 30, "uncertain": 28, "uncertainL": 25, "low": 24},
  'vertical': {"high": 40, "uncertainH": 27, "uncertain": 25, "uncertainL": 24, "low": 22}
}

let PRETEST_ANGLES = [22, 24, 26, 28, 30, 32, 35, 40, 43];

let W_BASE_RAMP = 175;
// when uncertainty comes from balls, this dist is left towards the edge of platform
let DIST_EDGE = 5;
let SIMULATION = {'duration': 5000};


let HORIZ_IFF = {'ll': [false, true], 'ul': [false, true], 'lu': [false, true],
                 'uu': [false, true], 'hu': [false, true], 'uh': [false, true],
                 'hh': [false, true], 'hl': [true, false], 'lh': [true, false]}

let HORIZ_IND = {'ll': [false, true], 'ul': [false, true],
                 'uu': [true, false], 'uh': [true, false],
                 'hh': [false, true], 'hl': [true, false],
                 'lh': [true, false],
                 'hu': [true, false], 'lu': [false, true]}
