let TrainStimuli = {
  'map_category': {"independent": {}, "uncertain": {}, "a_implies_c": {},
                   "a_iff_c": {}},
  'list_all': []
};
// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)

// INDPENDENT TRIALS
trials_independent = function(){
  let data = {}
  let bases = [W5, W5, W5]
  let x_max_base = bases[0].bounds.max.x;
  let y_min_base = bases[0].bounds.min.y;
  let meta = {
    "blockLowA": ["uncertainL", "high","train-independent-plane-doesnt-fall"],
    "blockLowB": ["high", "low", "train-independent-steep-falls"],
    "blockLowC": ["uncertainH", "high", "train-independent-plane-falls"]
  };
  let h = PROPS.blocks.h
  let bA = blockOnBase(bases[0], (h+DIST_EDGE)/h, cols.train_blocks[0], 'blockLowA', true);
  let bB = blockOnBase(bases[1], (h+DIST_EDGE)/h, cols.train_blocks[1], 'blockLowB', true);
  let bC = blockOnBase(bases[2], (h+DIST_EDGE)/h, cols.train_blocks[1], 'blockLowC', true);

  [bA, bB, bC].forEach(function(block1, i){
    let seesaw_dist = seesaw(data.increase ? 220 : 580, "independent")
    let id = "independent_" + i;
    let ramp_type = meta[block1.label][0]
    let walls = [W6].concat(rampElems(ramp_type, false, W5, true, test=false));
    walls.unshift(bases[i]);
    let i_dist_col = block1.render.fillStyle === cols.train_blocks[0] ? 1 : 0;
    let distractor = blockOnBase(W4, -1 * PRIOR[meta[block1.label][1]],
      cols.train_blocks[i_dist_col], 'b2_right');

    walls = walls.concat([seesaw_dist.skeleton]);
    let objs = {'objs': [block1, distractor, seesaw_dist.plank,
                         seesaw_dist.constraint].concat(walls),
                'meta': meta[block1.label],
                'id': id}
    data[id] = objs
  });
  return data
}

// TRAIN DIFFERENT STEEPNESS OF RAMPS
steepnessTrials = function(data, trial_id){
  let meta = ["falls", "doesnt fall", "train-steepness"]
  let walls = Walls.train.uncertain[1]
  let ramp1 = makeRamp(43, false, walls[0], test=false)
  let ramp2 = makeRamp(27, false, walls[1], test=false)
  let ramp3 = makeRamp(22, false, walls[2], test=false)
  ramp2.ball.label = 'ball2'; ramp2.ball.render.fillStyle = cols.orange;
  ramp3.ball.label = 'ball3'; ramp3.ball.render.fillStyle = cols.darkyellow;
  let w_horiz = PROPS.blocks.h; let w_vert = PROPS.blocks.w;
  let b1 = blockOnBase(walls[0], (w_horiz+DIST_EDGE)/w_horiz, cols.train_blocks[1], "block1", true);
  let b2 = blockOnBase(walls[1], (w_horiz+DIST_EDGE)/w_horiz, cols.train_blocks[0], "block2", true);
  let b3 = blockOnBase(walls[2], (w_vert + DIST_EDGE) / w_vert, cols.darkgrey, "block3");

  let objs_dyn = [b1, ramp1.ball, b2, ramp2.ball, b3, ramp3.ball];
  [ramp1, ramp2, ramp3].forEach(function(ramp){
    walls.push(ramp.tilted);
    walls.push(ramp.top);
  });
  let w_bottom = scene.w - walls[0].bounds.max.x;
  let bottom = wall(label='bottom_half', x=walls[0].bounds.max.x + w_bottom / 2,
    y=scene.h - PROPS.bottom.h/2, w=w_bottom, h=PROPS.bottom.h);
  walls.push(bottom);
  data[trial_id] = {objs: objs_dyn.concat(walls), meta, id: trial_id}
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
        let x = increase ? scene.w/3 : scene.w * (2/3)
        let walls = [wall('w_middle', x, scene.h/2)]
        let ramp = makeRamp(angle, increase, walls[0]);
        // block
        let w = dir ? PROPS.blocks.h : PROPS.blocks.w;
        let fct = increase ? -1 : 1;
        let b = blockOnBase(walls[0], fct * (w+DIST_EDGE)/w, col, "block", dir);

        let objs_dyn = [b, ramp.ball];
        walls.push(ramp.tilted);
        walls.push(ramp.top);
        data[trial_id] = {objs: objs_dyn.concat(walls), id: trial_id}
      });
    });
  })
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
  data = steepnessTrials(data, "uncertain_2");
  return data
}

// A implies C TRIALS
trials_ac = function(){
  let data = {};
  let meta = {
    'ac0': ["high", "low", "train-a-implies-c-with-extra-block-c-falls"],
    'ac1': ["uncertain", "uncertainL", "train-a-implies-c-c-falls-but-slowly"]};
  let colors = {'ac0': [cols.train_blocks[1], cols.train_blocks[0]],
                'ac1': [cols.train_blocks[0], cols.train_blocks[1]]};
  let horiz = {
    'ac0': [true, true],
    'ac1': [false, true]}

  _.keys(colors).forEach(function(key, i){
    let walls = Walls.train.a_implies_c();
    let cols = colors[key]
    let p1 = meta[key][0]
    let p2 = meta[key][1]
    let b1 = blockOnBase(walls[0], -PRIOR[p1], cols[0], 'blockUp_' + key, horiz[key][0]);
    let b2 = blockOnBase(walls[1], PRIOR[p2], cols[1], 'blockLow_' + key, horiz[key][1]);
    let blocks = [];

    if(key === "ac1") {
      let ramp = rampElems("uncertainH", true, walls[0], false, test=false);
      let w = horiz.ac1[0] ? PROPS.blocks.h : PROPS.blocks.w;
      b1 = blockOnBase(walls[0], -1*(w+DIST_EDGE)/w , cols[0], 'blockUp_ac1', horiz.ac1[0]);
      walls = walls.concat(ramp);
    } else if (key === "ac0") {
      let w1Bounds = walls[1].bounds;
      Body.setPosition(walls[1], {x: walls[1].position.x - 40,
          y: walls[0].bounds.max.y + 150 + (w1Bounds.max.y - w1Bounds.min.y)/2});
      let wx = wall('xWall', w1Bounds.max.x - PROPS.blocks.h/1.2,
        w1Bounds.min.y - PROPS.blocks.w/2, PROPS.blocks.h, PROPS.blocks.w);
        walls.push(wx);
      b2 = blockOnBase(wx, PRIOR[p2], cols[1], 'blockLow_' + key, horiz[key][1]);
    }
    blocks = blocks.concat([b1, b2]);
    let id = "a_implies_c_" + i
    data[id] = {objs: blocks.concat(walls), meta: meta[key], id}
    });
    return data
}

// Seesaw TRIALS
trials_iff = function(){
  data = {};
  let objs = Walls.train.seesaw_trials();
  let walls = objs.walls;
  let bA = block(walls[0].bounds.max.x, walls[0].bounds.min.y,
    cols.train_blocks[1], 'blockA', horiz=false);
  let bB = block(walls[1].bounds.min.x + 2, walls[1].bounds.min.y,
    cols.train_blocks[0], 'blockB', horiz=false);

  [[bA, bB]].forEach(function(blocks, i){
    let id = "a_iff_c_" + i
    data[id] = {objs: blocks.concat(objs.dynamic).concat(walls),
                meta: ["uncertain", "low", "train-iff"], id}
  });
  return data
}

getTrainStimulus = function(kind, nb) {
  let stimulus = TrainStimuli.map_category[kind][kind + "_" + nb];
  return stimulus
};

if (MODE === "train" || MODE === "experiment") {
  // generate all train stimuli!
  TrainStimuli.map_category["a_iff_c"] = trials_iff();
  TrainStimuli.map_category["uncertain"] = trials_uncertain();
  TrainStimuli.map_category["independent"] = trials_independent();
  TrainStimuli.map_category["a_implies_c"] = trials_ac();
  // put all train stimuli into array independent of kind
  let train_keys = _.keys(TrainStimuli.map_category);
  train_keys.forEach(function(kind){
    let arr = _.values(TrainStimuli.map_category[kind]);
    TrainStimuli.list_all = TrainStimuli.list_all.concat(arr);
  });
}
