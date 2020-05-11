const DEBUG = false;
// var MODE = "color-vision"
// var MODE = "train"
// var MODE = "test"
// var MODE = "pretest"
var MODE = "experiment"

var scene = {w: 800, h: 400};
PROPS = {'blocks': {'w':40, 'h': 80},
         'walls': {'w': 200, 'h': 20},
         'balls': {'radius': 16, 'color': cols.purple},
         'bottom': {'w': scene.w, 'h': 20},
         'seesaw': {'d_to_walls': 5},
         'seesaw_high': {'stick': {'w': 20, 'h': 95},
                            'plank': {'w': 220, 'h': 10},
                            'link': {'w': 5, 'h': 10}},
        'seesaw_low': {'stick': {'w': 20, 'h': 40},
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
let OVERLAP_SHIFT = {
  "angle38": 19, "angle35": 16,  "angle30": 12, "angle29": 12,
  "angle28": 13, "angle27": 12, "angle26": 12, "angle25": 12, "angle23": 10,
  "angle20": 9,
}
// "angle32": 13,
// "angle31": 12,
// "angle43": 25, "angle40": 20,  "angle33": 16,
// "angle32": 16, "angle31": 15, "angle27": 10,
// "angle24": 8, "angle22": 7, "angle20": 6, "angle29": 13,
// }

let ANGLES = {
  'horizontal': {"high": 38, "uncertainH": 30, "uncertain": 29, "uncertainL": 28,
                 "uncertainLL": 27, "low": 23},
  'vertical': {"high": 35, "uncertainH": 28, "uncertain": 27, "uncertainL": 26,
               "uncertainLL": 25, "low": 20}
}

// let PRETEST_ANGLES = [22, 24, 26, 28, 30, 32, 35, 40, 43, 20, 33, 29, 31, 37];
let PRETEST_ANGLES = _.range(45);
let W_BASE_RAMP = 200;
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
