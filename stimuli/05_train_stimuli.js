// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)
let TrainStimuli = {
  'map_category': {"independent": {}, "uncertain": {}, "ac_1": {},
                   "ac_2": {}},
  'list_all': []
};
TrainExpectations = {};

trials_independent = function(){
  let walls = Walls.train.independent;
  let prior = {
    "ind0": ["high", "uncertain", BLOCK_COLS.train[0][0] + BLOCK_COLS.train[1][0]],
    "ind1": ["low", "uncertainL", "none"]
  };
  let dir = {'ind0': ['vertical', 'horizontal'],
             'ind1': ['horizontal', 'vertical']};
  let expected = {'ind0': BLOCK_COLS_SHORT.train.join(""),
                  'ind1': 'none'}
  let data = {}
  _.keys(dir).forEach(function(id, i) {
    let walls = Walls.train.independent;
    let ramp = makeRamp(dir[id][0], prior[id][0], false, walls[0], "top", false);
    let b1 = blockOnBase(ramp.wall_bottom, PRIOR['impossible'],
      cols.train_blocks[0], 'block1', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(walls[1], -PRIOR[dir[id][1]][prior[id][1]],
      cols.train_blocks[1], 'block2', dir[id][1] == 'horizontal');

    let ssw= seesaw(walls[1].bounds.min.x - 100);
    walls = walls.concat([ramp.tilted, ramp.wall_bottom, ssw.skeleton]);
    let objs = {'objs':[ssw.plank, ssw.constraint, b1, b2, ramp.ball].concat(walls),
                'meta': prior[id],
                'id': id}
    data[id] = objs
    TrainExpectations[id] = expected[id];
  });

  return data
}

trials_ramp = function(){
  let colors = {distance0: cols.train_blocks.concat(['darkgrey']),
                distance1: [cols.train_blocks[1], cols.train_blocks[0]].concat(['darkgrey']),
                balls: COLORS_BALL.train.slice(0,3)
               };
  let priors = {distance0: ['low', 'uncertainL', 'uncertainH'],
                distance1: ['low', 'uncertainL', 'high']}
  let dir = {distance0: ['horizontal', 'horizontal', 'horizontal'],
             distance1: ['vertical', 'vertical', 'vertical']};
  let expected = {distance0: 'none', distance1: 'none'}

  let data = {};
  _.keys(dir).forEach(function(id, i) {
    // add walls
    let walls = Walls.train[id]
    let objs_dyn = [];
    _.range(0, priors[id].length).forEach(function(idx){
      let ramp = makeRamp(dir[id][idx], "uncertain", false, walls[idx],
                          "top", false, colors.balls[idx])
      ramp.ball.label = 'ball' + idx;
      objs_dyn.push(ramp.ball);
      walls.push(ramp.tilted);

      // data for blocks
      let width_base = BASE_RAMP[dir[id][idx]][priors[id][idx]];
      let base = wall('ramp_bottom' + idx,
                      ramp.wall_bottom.bounds.min.x + width_base / 2,
                      ramp.wall_bottom.position.y, width_base);
      walls.push(base);
      let width = dir[id][idx] == 'horizontal' ? PROPS.blocks.h : PROPS.blocks.w
      let prop_on_base = (width + DIST_EDGE) / width;
      let block = blockOnBase(base, prop_on_base, colors[id][idx],
                              "block"+idx, dir[id][idx] == 'horizontal');
      objs_dyn.push(block);
    });
    data[id] = {'objs': objs_dyn.concat(walls), 'meta': priors[id], id}
    TrainExpectations[id] = expected[id]
  });
  return data
}

trials_uncertain = function(){
  let priors = {'uncertain0': ["low", "uncertain"],
                'uncertain1': ["uncertainH", "low"],
                'uncertain2': ['uncertainH', 'low']};
  let dir = {'uncertain0': ['vertical', 'horizontal'],
             'uncertain1': ['vertical', 'horizontal'],
             'uncertain2': ['vertical', 'horizontal']
           };
 let colors = BLOCK_COLS_SHORT.train;
  let expected = {'uncertain0': colors[1],
                  'uncertain1': colors[0],
                  'uncertain2': colors[0]}
  let walls = Walls.train.uncertain;
  let data = {}
  _.keys(priors).forEach(function(id, i){
    let b1 = blockOnBase(walls[0], PRIOR[dir[id][0]][priors[id][0]],
      cols.train_blocks[0], "block1", dir[id][1] == 'horizontal');
    let b2 = blockOnBase(walls[1], -PRIOR[dir[id][1]][priors[id][1]],
      cols.train_blocks[1], "block2", dir[id][1] == 'horizontal');
    data[id] = {objs: [b1, b2].concat(walls),
                meta: priors[id],
                id}
    TrainExpectations[id] = expected[id]
  });
  return data
  }

// A implies C TRIALS
trials_ac = function(){
  let priors = {
    'ac0': ["high", "high"],
    'ac1': ["high", "low"],
    'ac2': ['uncertainL', 'uncertain', 'none'],
    'ac3': ['uncertainL', 'high', 'none']
  };
  let dir = {'ac0': ['horizontal', 'horizontal'], 'ac1': ['vertical', 'vertical'],
             'ac2': ['horizontal', 'vertical'], 'ac3': ['vertical', 'horizontal']}
  let colors = {'ac0': cols.train_blocks,
                'ac1': [cols.train_blocks[1], cols.train_blocks[0]],
                'ac2': cols.train_blocks,
                'ac3': [cols.train_blocks[1], cols.train_blocks[0]]}

  let expected = {'ac0': BLOCK_COLS_SHORT.train.join(""),
                  'ac1': BLOCK_COLS_SHORT.train[1],
                  'ac2': 'none', 'ac3': 'none'};
  let data = {};
  _.keys(priors).forEach(function(id, i){
    let objs = Walls.train.ac_1("left", dir[id][1], priors[id][1]);
    let p1 = priors[id][0]
    let b1 = blockOnBase(objs.walls[0], PRIOR[dir[id][0]][priors[id][0]],
      colors[id][0], 'blockUp', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(objs.walls[1], PRIOR.impossible, colors[id][1],
      'blockLow', dir[id][1] == 'horizontal');

    let blocks = [b1, b2].concat(objs.dynamic);
    data[id] = {objs: blocks.concat(objs.walls), meta: priors[id], id}
    TrainExpectations[id] = expected[id];
    });
    return data
}

// TRIALS with seesaw (kickoff/dont kickoff block)
trials_ssw = function(){
  let color = {'ssw_0': cols.train_blocks,
               'ssw_1': [cols.train_blocks[1], cols.train_blocks[0]]}
  let dir = {
    'ssw_0': ['vertical', 'vertical'],
    'ssw_1': ['horizontal', 'horizontal']
  };
  let prior = {
    'ssw_0': ["uncertain", "uncertainL"],
    'ssw_1': ["uncertain", "uncertainL"]
  };
  let expected = {'ssw_0': BLOCK_COLS_SHORT.train.join(""),
                  'ssw_1': BLOCK_COLS_SHORT.train[1]}
  data = {};
  _.keys(prior).forEach(function(id, i){
    let objs = Walls.train.ssw();
    let b1 = blockOnBase(objs.walls[0], PRIOR[dir[id][0]][prior[id][0]],
      color[id][0], 'blockC', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(objs.walls[1], -PRIOR[dir[id][1]][prior[id][1]],
      color[id][1], 'blockC', dir[id][1] == 'horizontal');
    data[id] = {objs: [b1, b2].concat(objs.dynamic).concat(objs.walls),
                meta: prior[id],
                id}
    TrainExpectations[id] = expected[id];
  });
  return data
}

// pretestTrials = function(){
//   let horiz = [true, false]
//   let data = {};
//   [0, 1].forEach(function(ci){
//     let col_str = BLOCK_COLS.test[ci];
//     let col = cols.test_blocks[ci];
//     horiz.forEach(function(dir){
//       PRETEST_ANGLES.forEach(function(angle) {
//         let trial_id = [(dir ? "horiz" : "vert"), angle.toString(), col_str].join('-');
//         let increase = _.sample([true, false])
//         increase = true;
//         let x = increase ? SCENE.w/3 : SCENE.w * (2/3)
//         let walls = [wall('w_middle', x, SCENE.h/2)]
//         let ramp = makeRamp(angle, increase, walls[0], "bottom");
//         // block
//         let w = dir ? PROPS.blocks.h : PROPS.blocks.w;
//         let fct = increase ? -1 : 1;
//         let b = blockOnBase(walls[0], fct * (w+DIST_EDGE)/w, col, "block", dir);
//
//         let objs_dyn = [b, ramp.ball];
//         walls.push(ramp.tilted);
//         walls.push(ramp.wall_top);
//         data[trial_id] = {objs: objs_dyn.concat(walls), id: trial_id}
//       });
//     });
//   })
//   return data
// }

// generate all train stimuli!
if (MODE === "train" || MODE === "experiment") {
  TrainStimuli.map_category["ramp"] = trials_ramp();
  TrainStimuli.map_category["uncertain"] = trials_uncertain();
  TrainStimuli.map_category["ac_2"] = trials_ssw();
  TrainStimuli.map_category["independent"] = trials_independent();
  TrainStimuli.map_category["ac_1"] = trials_ac();
  // put all train stimuli into array independent of kind
  let train_keys = _.keys(TrainStimuli.map_category);
  train_keys.forEach(function(kind){
    let arr = _.values(TrainStimuli.map_category[kind]);
    TrainStimuli.list_all = TrainStimuli.list_all.concat(arr);
  });
}
