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
  let meta = {
    "ind0": ["high", "uncertainL", BLOCK_COLS.train[0][0]],
    "ind1": ["low", "uncertainL", "none"]
  };
  let dir = {'ind0': ['vertical', 'horizontal'],
             'ind1': ['horizontal', 'vertical']};

  let data = {}
  _.keys(dir).forEach(function(id, i) {
    let walls = Walls.train.independent;
    let ramp = makeRamp(dir[id][0], meta[id][0], false, walls[0], "top", false);
    let b1 = blockOnBase(ramp.wall_bottom, PRIOR['impossible'],
      cols.train_blocks[0], 'block1', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(walls[1], -PRIOR[dir[id][1]][meta[id][1]],
      cols.train_blocks[1], 'block2', dir[id][1] == 'horizontal');

    let ssw= seesaw(walls[1].bounds.min.x - 100);
    walls = walls.concat([ramp.tilted, ramp.wall_bottom, ssw.skeleton]);
    let objs = {'objs':[ssw.plank, ssw.constraint, b1, b2, ramp.ball].concat(walls),
                'meta': meta[id],
                'id': id}
    data[id] = objs
    TrainExpectations[id] = meta[id][2];
  });

  return data
}

trials_ramp = function(){
  let colors = {steepness: cols.train_blocks,
                distance: cols.train_blocks.reverse()};
  let meta = {steepness: ["low", "uncertainH", "high"],
              distance: ["uncertainH", "uncertainH", "uncertainH"]};
  let dir = {steepness: ['vertical', 'vertical', 'horizontal'],
             distance: ['horizontal', 'horizontal', 'vertical']};
  let expect = {steepness: '', distance: ''}
  let data = {};
  _.keys(meta).forEach(function(id, i) {
    // add walls
    let loc = id == "steepness" ? "bottom" : "top";
    let walls = Walls.train[id]
    let ramp1 = makeRamp(dir[id][0], meta[id][0], false, walls[0], loc, false)
    let ramp2 = makeRamp(dir[id][1], meta[id][1], false, walls[1], loc, false)
    let ramp3 = makeRamp(dir[id][2], meta[id][2], false, walls[2], loc, false)
    ramp2.ball.label = 'ball2'; ramp3.ball.label = 'ball3';
    let bases = [];
    [ramp1, ramp2, ramp3].forEach(function(ramp, i){
      walls.push(ramp.tilted);
      let min = ramp.wall_bottom.bounds.min.x;
      let pos = ramp.wall_bottom.position;
      let base = loc == "bottom" ? ramp.wall_top :
        i == 0 ? wall('ramp_bottom' + i, min + W_BASE_RAMP.low/2, pos.y, W_BASE_RAMP.low) :
        i == 1 ? wall('ramp_bottom' + i, min + W_BASE_RAMP.uncertain/2, pos.y, W_BASE_RAMP.uncertain)
               : wall('ramp_bottom' + i, min + W_BASE_RAMP.high/2, pos.y, W_BASE_RAMP.high);
      walls.push(base);
      loc == "top" ? bases.push(base) : null;
    });
    // add blocks
    let prop_on_base = [];
    dir[id].forEach(function(d){
      let w_horiz = d == 'horizontal' ? PROPS.blocks.h : PROPS.blocks.w;
      prop_on_base.push((w_horiz+DIST_EDGE)/w_horiz);
    })
    bases = bases.length == 0 ?  walls.slice(0,3) : bases;
    let b1 = blockOnBase(bases[0], prop_on_base[0], colors[id][0], "blockA",
      dir[id][0] == 'horizontal');
    let b2 = blockOnBase(bases[1], prop_on_base[1], colors[id][1], "blockC",
      dir[id][1] == 'horizontal');
    let b3 = blockOnBase(bases[2], prop_on_base[2], cols.darkgrey, "block3",
        dir[id][2] == 'horizontal');

    let objs_dyn = [b1, ramp1.ball, b2, ramp2.ball, b3, ramp3.ball];
    data[id] = {'objs': objs_dyn.concat(walls), 'meta': meta[id], id}
    TrainExpectations[id] = expect[id]
  });
  return data
}

trials_uncertain = function(){
  let meta = {'uncertain0': ["low", "uncertain", BLOCK_COLS.train[1][0]],
              'uncertain1': ["uncertain", "low", BLOCK_COLS.train[0][0]]};
  let dir = {'uncertain0': ['vertical', 'horizontal'],
             'uncertain1': ['vertical', 'horizontal']
           };
  let walls = Walls.train.uncertain;
  let data = {}
  _.keys(meta).forEach(function(id, i){
    let b1 = blockOnBase(walls[0], PRIOR[dir[id][0]][meta[id][0]],
      cols.train_blocks[0], "block1");
    let b2 = blockOnBase(walls[1], -PRIOR[dir[id][1]][meta[id][1]],
      cols.train_blocks[1], "block2", true);
    data[id] = {objs: [b1, b2].concat(walls),
                meta: meta[id],
                id}
    TrainExpectations[id] = meta[id]
  });
  return data
  }

// A implies C TRIALS
trials_ac = function(){
  let colors_str = BLOCK_COLS.train
  let meta = {
    'ac0': ["high", "high", colors_str[0][0] + colors_str[1][0]],
    'ac1': ["high", "low", colors_str[1][0]],
    'ac2': ['uncertainL', 'uncertain', 'none'],
    'ac3': ['uncertainL', 'high', 'none']
  };
  let dir = {'ac0': ['horizontal', 'horizontal'], 'ac1': ['vertical', 'vertical'],
             'ac2': ['horizontal', 'vertical'], 'ac3': ['vertical', 'horizontal']}
  let data = {};
  _.keys(meta).forEach(function(id, i){
    let objs = Walls.train.ac_1("left", dir[id][1], meta[id][1]);
    let colors = id == "ac1" ? cols.train_blocks.reverse() : cols.train_blocks;
    let p1 = meta[id][0]
    let b1 = blockOnBase(objs.walls[0], PRIOR[dir[id][0]][meta[id][0]],
      colors[0], 'blockUp', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(objs.walls[1], PRIOR['impossible'], colors[1],
      'blockLow', dir[id][1] == 'horizontal');

    let blocks = [b1, b2].concat(objs.dynamic);
    data[id] = {objs: blocks.concat(objs.walls), meta: meta[id], id}
    TrainExpectations[id] = meta[id][2];
    });
    return data
}

// TRIALS with seesaw (kickoff/dont kickoff block)
trials_ssw = function(){
  let color = {'ssw_0': cols.train_blocks, 'ssw_1': cols.train_blocks.reverse()}
  let dir = {'ssw_0': ['vertical', 'vertical'],
             'ssw_1': ['horizontal', 'horizontal']};
  let meta = {'ssw_0': ["uncertain", "uncertainL",
    BLOCK_COLS.train[0][0] + BLOCK_COLS.train[1][0]],
              'ssw_1': ["uncertain", "uncertainL", BLOCK_COLS.train[1][0]]};
  data = {};
  _.keys(meta).forEach(function(id, i){
    let objs = Walls.train.ssw();
    let b1 = blockOnBase(objs.walls[0], PRIOR[dir[id][0]][meta[id][0]],
      color[id][0], 'blockC', dir[id][0] == 'horizontal');
    let b2 = blockOnBase(objs.walls[1], -PRIOR[dir[id][1]][meta[id][1]],
      color[id][1], 'blockC', dir[id][1] == 'horizontal');
    data[id] = {objs: [b1, b2].concat(objs.dynamic).concat(objs.walls), meta, id}
    TrainExpectations[id] = meta[id][2];
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


getTrainStimulus = function(kind, nb) {
  let stimulus = TrainStimuli.map_category[kind][kind + "_" + nb];
  return stimulus
};

if (MODE === "train" || MODE === "experiment") {
  // generate all train stimuli!
  TrainStimuli.map_category["ramp"] = trials_ramp();
  // TrainStimuli.map_category["uncertain"] = trials_uncertain();
  // TrainStimuli.map_category["ac_2"] = trials_ssw();
  // TrainStimuli.map_category["independent"] = trials_independent();
  // TrainStimuli.map_category["ac_1"] = trials_ac();
  // put all train stimuli into array independent of kind
  let train_keys = _.keys(TrainStimuli.map_category);
  train_keys.forEach(function(kind){
    let arr = _.values(TrainStimuli.map_category[kind]);
    TrainStimuli.list_all = TrainStimuli.list_all.concat(arr);
  });
}
