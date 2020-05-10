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
    let walls = [W6].concat(rampElems(ramp_type, false, W5, horiz[i], test=false));
    walls.unshift(bases[i]);
    let i_dist_col = block1.render.fillStyle === cols.train_blocks[0] ? 1 : 0;
    let dist_horiz = (label === "blockC" || label === "blockD") ? true : false;
    let distractor = blockOnBase(W4, -1 * PRIOR[meta[label][1]],
      cols.train_blocks[i_dist_col], 'block_dist_right', dist_horiz);

    walls = walls.concat([seesaw_dist.skeleton]);
    let objs = {'objs': [block1, distractor, seesaw_dist.plank,
                         seesaw_dist.constraint].concat(walls),
                'meta': meta[label],
                'id': id}
    data[id] = objs
  });
  return data
}

// TRAIN DIFFERENT STEEPNESS OF RAMPS
steepnessTrials = function(id_start){
  let meta_all = [["low", "uncertainH", "high", "train0-ball-high-low-steepness"],
                  ["low", "high", "uncertainLL", "train1-ball-high-low-steepness"]];
  let horiz_all = [[false, true, false], [true, true, false]];
  let data = {};

  ["horizontal", "vertical"].forEach(function(direction, i) {
    let walls = Array.from(Walls.train.uncertain[1]);
    let trial_id = "uncertain_" + (i + id_start);
    let w_bottom = scene.w - walls[0].bounds.max.x;
    let bottom = wall(label='bottom_half', x=walls[0].bounds.max.x + w_bottom / 2,
    y=scene.h - PROPS.bottom.h/2, w=w_bottom, h=PROPS.bottom.h);
    walls.push(bottom);
    let meta = meta_all[i];
    let horiz = horiz_all[i];
    let prop_on_base = [];
    horiz.forEach(function(d){
      let w_horiz = d ? PROPS.blocks.h :PROPS.blocks.w;
      prop_on_base.push((w_horiz+DIST_EDGE)/w_horiz);
    })

    let ramp1 = makeRamp(ANGLES[direction][meta[0]], false, walls[0], test=false)
    let ramp2 = makeRamp(ANGLES[direction][meta[1]], false, walls[1], test=false)
    let ramp3 = makeRamp(ANGLES[direction][meta[2]], false, walls[2], test=false)
    ramp2.ball.label = 'ball2';
    ramp3.ball.label = 'ball3';
    let cs = cols.train_blocks;
    let w_horiz = PROPS.blocks.h; let w_vert = PROPS.blocks.w;
    let b1 = blockOnBase(walls[0], prop_on_base[0], cs[1], "blockA", horiz[0]);
    let b2 = blockOnBase(walls[1], prop_on_base[1], cs[0], "blockC", horiz[1]);
    let b3 = blockOnBase(walls[2], prop_on_base[2], cols.darkgrey, "block3", horiz[2]);

    let objs_dyn = [b1, ramp1.ball, b2, ramp2.ball, b3, ramp3.ball];
    [ramp1, ramp2, ramp3].forEach(function(ramp){
      walls.push(ramp.tilted);
      walls.push(ramp.top);
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
  let train_steepness = steepnessTrials(2);

  return Object.assign(data, train_steepness)
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
  let cs = cols.train_blocks;
  let horiz = [[false, false], [true, true]]
  let meta = [["uncertain", "low", "train-iff-vert"],
              ["high", "low", "train-iff-horiz"]]
  let objs = Walls.train.seesaw_trials();
  let walls = objs.walls;
  let bA = block(walls[0].bounds.max.x, walls[0].bounds.min.y,cs[1], 'blockA', horiz[0][0]);
  let bB = block(walls[1].bounds.min.x + 2, walls[1].bounds.min.y,cs[0], 'blockB', horiz[0][1]);
  let bC = block(walls[0].bounds.max.x, walls[0].bounds.min.y,cs[1], 'blockA', horiz[1][0]);
  let bD = block(walls[1].bounds.min.x + 2, walls[1].bounds.min.y,cs[0], 'blockB', horiz[1][1]);

  [[bA, bB], [bC, bD]].forEach(function(blocks, i){
    let id = "a_iff_c_" + i
    data[id] = {objs: blocks.concat(objs.dynamic).concat(walls),
                meta: ["uncertain", "low", "train-iff"], id}
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
