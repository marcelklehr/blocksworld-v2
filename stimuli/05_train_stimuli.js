let TrainStimuli = {
  'map_category': {"independent": {}, "uncertain": {}, "ac_1": {},
                   "ac_2": {}},
  'list_all': []
};
// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)

// INDPENDENT TRIALS
trials_independent = function(){
  let data = {}
  let bases = [W5, W5, W5, W5]
  let x_max_base = bases[0].bounds.max.x;
  let y_min_base = bases[0].bounds.min.y;
  let meta = {
    "blockA": ["uncertainLL", "high","ind-ball-uncLL-edge-high"],
    "blockB": ["uncertainH", "low", "ind-ball-uncH-edge-low"],
    "blockC": ["uncertainH", "high", "ind-ball-uncH-edge-high"],
    "blockD": ["uncertainLL", "low", "ind-ball-uncLL-edge-low"]
  };
  let horiz = [true, true, false, false];
  let h = PROPS.blocks.h
  let bA = blockOnBase(bases[0], (h+DIST_EDGE)/h, cols.train_blocks[0], 'blockA', horiz[0]);
  let bB = blockOnBase(bases[1], (h+DIST_EDGE)/h, cols.train_blocks[1], 'blockB', horiz[1]);
  let bC = blockOnBase(bases[2], (h+DIST_EDGE)/h, cols.train_blocks[1], 'blockC', horiz[2]);
  let bD = blockOnBase(bases[3], (h+DIST_EDGE)/h, cols.train_blocks[0], 'blockD', horiz[3]);

  [bA, bB, bC, bD].forEach(function(block1, i) {
    let label = block1.label;
    let ss_height = label === "blockC" ? "high" : "low";
    let seesaw_dist = seesaw(data.increase ? 220 : 580, ss_height)
    let id = "independent_" + i;
    let ramp_type = meta[label][0]
    // todo change prior here from "high"
    let ramp = makeRamp(horiz[i], "high", false, W5, "bottom", false);
    // rampElems(ramp_type, false, W5, horiz[i], test=false)

    let walls = [W6].concat([ramp.tilted, ramp.wall_top, ramp.wall_bottom]);
    walls.unshift(bases[i]);
    let i_dist_col = block1.render.fillStyle === cols.train_blocks[0] ? 1 : 0;
    let dir_dist = (label === "blockC" || label === "blockD") ?
      {horiz: true, str: 'horizontal'} : {horiz: false, str: 'vertical'};
    let distractor = blockOnBase(W4, -1 * PRIOR[dir_dist.str][meta[label][1]],
      cols.train_blocks[i_dist_col], 'block_dist_right', dir_dist.horiz);

    walls = walls.concat([seesaw_dist.skeleton]);
    let objs = {'objs': [block1, distractor, ramp.ball, seesaw_dist.plank,
                         seesaw_dist.constraint].concat(walls),
                'meta': meta[label],
                'id': id}
    data[id] = objs
  });
  return data
}

// TRAIN DIFFERENT STEEPNESS OF RAMPS
trials_ramp = function(){
  let meta_all = {steepness: ["low", "uncertain", "high"],
                  distance: ["uncertainH", "uncertainH", "uncertainH"]};
  let horiz_all = {steepness: [false, true, false],
                   distance: [true, true, false]};
  let colors = [cols.train_blocks, cols.train_blocks.reverse()];
  let data = {};
  ["steepness", "distance"].forEach(function(trial_id, i) {
    let meta = meta_all[trial_id];
    let horiz = horiz_all[trial_id];
    // add walls
    let walls = Walls.train[trial_id]
    let w_bottom = SCENE.w - walls[2].bounds.max.x;
    let bottom = wall(label='bottom_half',
                      x=walls[0].bounds.max.x + w_bottom / 2,
                      y=SCENE.h - PROPS.bottom.h/2,
                      w=w_bottom, h=PROPS.bottom.h);
    walls.push(bottom);
    // add ramp walls
    let loc = trial_id == "steepness" ? "bottom" : "top";
    let ramp1 = makeRamp(horiz[0], meta[0], false, walls[0], loc, false)
    let ramp2 = makeRamp(horiz[1], meta[1], false, walls[1], loc, false)
    let ramp3 = makeRamp(horiz[2], meta[2], false, walls[2], loc, false)
    ramp2.ball.label = 'ball2'; ramp3.ball.label = 'ball3';
    let adjust_wall = function(wall, ref) {
      const pos_x = ref.x_min + (ref.x_max - ref.x_min) / 2;
      let width = wall.bounds.max.x - wall.bounds.min.x;
      Body.setPosition(wall, {x: pos_x, y: wall.position.y});
      Body.scale(wall, (ref.x_max - ref.x_min) / width, 1);
    }
    let ref = trial_id == "steepness" ?
      [{x_min: ramp1.wall_top.bounds.min.x, x_max: ramp1.wall_top.bounds.max.x},
       {x_min: ramp1.wall_top.bounds.min.x, x_max: ramp1.wall_top.bounds.max.x}] :
      [{x_min: ramp1.wall_top.bounds.min.x, x_max: ramp2.wall_top.bounds.max.x},
       {x_min: ramp1.wall_top.bounds.min.x, x_max: ramp3.wall_top.bounds.max.x}];
    adjust_wall(ramp2.wall_top, ref[0]);
    adjust_wall(ramp3.wall_top, ref[1]);
    // add blocks
    let prop_on_base = [];
    horiz.forEach(function(d){
      let w_horiz = d ? PROPS.blocks.h :PROPS.blocks.w;
      prop_on_base.push((w_horiz+DIST_EDGE)/w_horiz);
    })
    let bases = loc == "bottom" ? walls :
      [ramp1.wall_bottom, ramp2.wall_bottom, ramp3.wall_bottom];
    let b1 = blockOnBase(bases[0], prop_on_base[0], colors[i][1], "blockA", horiz[0]);
    let b2 = blockOnBase(bases[1], prop_on_base[1], colors[i][0], "blockC", horiz[1]);
    let b3 = blockOnBase(bases[2], prop_on_base[2], cols.darkgrey, "block3", horiz[2]);

    let objs_dyn = [b1, ramp1.ball, b2, ramp2.ball, b3, ramp3.ball];
    [ramp1, ramp2, ramp3].forEach(function(ramp, i){
      walls.push(ramp.tilted);
      loc=="bottom" ? walls.push(ramp.wall_top) : walls.push(ramp.wall_bottom);
    });
    data[trial_id] = {objs: objs_dyn.concat(walls), meta, id: trial_id}
  });
  return data
}

// TRAIN UNCERTAINTY BLOCKS TO FALL
trials_uncertain = function(){
  let data = {}
  let meta = [["doesnt-fall", "falls-horiz", "train-uncertain"],
  ["falls", "doesnt-fall-horiz", "train-uncertain"]
];
let walls = Walls.train.uncertain[0];
let bA = blockOnBase(walls[0], 0.55, cols.train_blocks[1], "blockaA"); //doesnt fall
let bB = blockOnBase(walls[1], -0.5, cols.train_blocks[0], "blockbC", true); // falls
let dist1 = blockOnBase(walls[2], -0.509, cols.darkgrey, 'dist1', true);

let bC = blockOnBase(walls[0], 0.5, cols.train_blocks[1], "blockcA"); // falls
let bD = blockOnBase(walls[1], -0.53, cols.train_blocks[0], "blockdC", true); // doesnt fall
let dist2 = blockOnBase(walls[2], -0.6, cols.darkgrey, 'dist2', true);

[[bA, bB, dist1], [bC, bD, dist2]].forEach(function(blocks, i){
  let id = "uncertain_" + i
  data[id] = {objs: blocks.concat(walls),
    meta: meta[i],id}
  });
return data
}

// A implies C TRIALS
trials_ac = function(){
  let data = {};
  let meta = {
    'ac0': ["high", "low", "train-a-implies-c-with-extra-block-c-falls"]
  };
    // 'ac1': ["uncertain", "uncertainL", "train-a-implies-c-c-falls-but-slowly"]};
  let colors = {'ac0': [cols.train_blocks[1], cols.train_blocks[0]]};
                // 'ac1': [cols.train_blocks[0], cols.train_blocks[1]]};
  let dir = {
    'ac0': ['horizontal', 'horizontal']};
    // 'ac1': [false, true]}

  _.keys(colors).forEach(function(key, i){
    let walls = Walls.train.ac_1();
    let cols = colors[key]
    let p1 = meta[key][0]
    let p2 = meta[key][1]
    let b1 = blockOnBase(walls[0], -PRIOR[dir[key][0]][p1], cols[0],
      'blockUp_' + key, dir[key][0] == 'horizontal');
    let b2 = blockOnBase(walls[1], PRIOR[dir[key][1]][p2], cols[1],
      'blockLow_' + key, dir[key][1] == 'horizontal');
    let blocks = [];

    let w1Bounds = walls[1].bounds;
    let wx = wall('xWall', w1Bounds.max.x - PROPS.blocks.h/1.2,
                  w1Bounds.min.y - PROPS.blocks.w/2, PROPS.blocks.h, PROPS.blocks.w);
    walls.push(wx);
    // if(key === "ac1") {
    //   let ramp = rampElems("uncertainH", true, walls[0], false, test=false);
    //   let w = dir.ac1[0] == 'horizontal' ? PROPS.blocks.h : PROPS.blocks.w;
    //   b1 = blockOnBase(walls[0], -1*(w+DIST_EDGE)/w , cols[0], 'blockUp_ac1',
    //    dir.ac1[0] == 'horizontal');
    //   walls = walls.concat(ramp);
    // } else if (key === "ac0") {
    // }
    b2 = blockOnBase(wx, PRIOR[dir[key][1]][p2], cols[1], 'blockLow_' + key,
      dir[key][1] == 'horizontal');
    blocks = blocks.concat([b1, b2]);
    let id = "ac_1_" + i
    data[id] = {objs: blocks.concat(walls), meta: meta[key], id}
    });
    return data
}

// TRIALS with seesaw (kickoff/dont kickoff block)
trials_iff = function(){
  data = {};
  let cs = cols.train_blocks;
  let dirs = [['vertical', 'vertical'], ['horizontal', 'horizontal']]
  let meta_data = [["uncertain", "uncertainL", "uncertain-vert-seesaw-kick-off"],
                   ["uncertain", "low", "high-horiz-seesaw-dont-kickoff"]];
  ['ac_2_0', 'ac_2_1'].forEach(function(id, i){
    let meta = meta_data[i];
    let horiz = dirs[i];
    let objs = Walls.train.seesaw_trials();
    let walls = objs.walls;
    let b1 = blockOnBase(walls[0], PRIOR[horiz[0]][meta[0]], cs[0], 'blockC',
      horiz[0] == 'horizontal');
    let b2 = blockOnBase(walls[1], -PRIOR[horiz[1]][meta[1]], cs[1], 'blockC',
      horiz[1] == 'horizontal');
    data[id] = {objs: [b1, b2].concat(objs.dynamic).concat(walls), meta, id}
  });
  return data
}

pretestTrials = function(){
  let horiz = [true, false]
  let data = {};
  [0, 1].forEach(function(ci){
    let col_str = block_cols.test[ci];
    let col = cols.test_blocks[ci];
    horiz.forEach(function(dir){
      PRETEST_ANGLES.forEach(function(angle) {
        let trial_id = [(dir ? "horiz" : "vert"), angle.toString(), col_str].join('-');
        let increase = _.sample([true, false])
        increase = true;
        let x = increase ? SCENE.w/3 : SCENE.w * (2/3)
        let walls = [wall('w_middle', x, SCENE.h/2)]
        let ramp = makeRamp(angle, increase, walls[0], "bottom");
        // block
        let w = dir ? PROPS.blocks.h : PROPS.blocks.w;
        let fct = increase ? -1 : 1;
        let b = blockOnBase(walls[0], fct * (w+DIST_EDGE)/w, col, "block", dir);

        let objs_dyn = [b, ramp.ball];
        walls.push(ramp.tilted);
        walls.push(ramp.wall_top);
        data[trial_id] = {objs: objs_dyn.concat(walls), id: trial_id}
      });
    });
  })
  return data
}


getTrainStimulus = function(kind, nb) {
  let stimulus = TrainStimuli.map_category[kind][kind + "_" + nb];
  return stimulus
};

if (MODE === "train" || MODE === "experiment") {
  // generate all train stimuli!
  // TrainStimuli.map_category["ramp"] = trials_ramp();
  // TrainStimuli.map_category["uncertain"] = trials_uncertain();
  TrainStimuli.map_category["ac_2"] = trials_iff();
  // TrainStimuli.map_category["independent"] = trials_independent();
  // TrainStimuli.map_category["ac_1"] = trials_ac();
  // put all train stimuli into array independent of kind
  let train_keys = _.keys(TrainStimuli.map_category);
  train_keys.forEach(function(kind){
    let arr = _.values(TrainStimuli.map_category[kind]);
    TrainStimuli.list_all = TrainStimuli.list_all.concat(arr);
  });
}
