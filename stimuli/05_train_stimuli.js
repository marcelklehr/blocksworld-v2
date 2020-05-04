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
  let bases = _.times(3, baseRampTrain);
  let x_max_base = bases[0].bounds.max.x;
  let y_min_base = bases[0].bounds.min.y;

  // plane uncertain falls
  let bA = block(x_max_base - lengthOnBase("uncertain", true) - 25 + props.blocks.h/2,
    y_min_base, cols.train_blocks[0],'blockLowA', horiz=true);
  // steep falls
  let bB = block(x=430, y_min_base = 225-props.walls.h/2, cols.train_blocks[1],
    'blockLowB', horiz=true);
  // plane uncertain doesnt fall
  let bC = block(x_max_base-lengthOnBase("low", true) + 30 + props.blocks.h/2,
    y_min_base, cols.train_blocks[1], 'blockLowC', horiz=true);

  let meta = {
    "blockLowA": ["uncertain", "high","train-independent-plane-falls"],
    "blockLowB": ["high", "low", "train-independent-steep-falls"],
    "blockLowC": ["uncertain", "high", "train-independent-plane-doesnt-fall"]
  };
  [bA, bB, bC].forEach(function(block1, i){
    let seesaw_dist = seesaw(data.increase ? 220 : 580, "independent")
    let id = "independent_" + i;
    let ramp_type = block1.label === "blockLowB" ? "steep" : "plane";
    let walls = Walls.train.independent.concat(
      Walls.train.tilted_independent(ramp_type, false, baseRampTrain())
    );
    walls.unshift(bases[i]);
    if(block1.label === "blockLowC") {
      Matter.Body.scale(walls[0], 1.18, 1);
      Matter.Body.setPosition(walls[0], {x: walls[0].position.x + 28,
        y: walls[0].position.y})
    }
    let i_dist_col = block1.render.fillStyle === cols.train_blocks[0] ? 1 : 0;
    let distractor = blockOnBase(W4, -1 * PRIOR[meta[block1.label][1]],
      cols.train_blocks[i_dist_col], 'distractorBlock');

    walls = walls.concat([seesaw_dist.skeleton]);
    let objs = {'objs': [block1, distractor, seesaw_dist.plank,
                         seesaw_dist.constraint].concat(walls),
                'meta': meta[block1.label], id: id}
    data[id] = objs
  });
  return data
}


// TRAIN DIFFERENT STEEPNESS OF RAMPS
steepnessTrials = function(data, trial_id){
  let meta = ["falls", "doesnt fall", "train-steepness"]
  let walls = Walls.train.uncertain[1]
  let ramp1 = makeRamp(45, false, walls[0])
  let ramp2 = makeRamp(25, false, walls[1])
  let ramp3 = makeRamp(15, false, walls[2])
  ramp2.ball.label = 'ball2'
  ramp3.ball.label = 'ball3'
  let b1 = blockOnBase(walls[0], 0.75, cols.train_blocks[1], "block1", true);
  let b2 = blockOnBase(walls[1], 0.75, cols.train_blocks[0], "block2", true);
  let b3 = blockOnBase(walls[2], 0.75, cols.darkgrey, "block3");

  let objs_dyn = [b1, ramp1.ball, b2, ramp2.ball, b3, ramp3.ball];
  [ramp1, ramp2, ramp3].forEach(function(ramp){
    walls.push(ramp.tilted);
    walls.push(ramp.top);
  });
  data[trial_id] = {objs: objs_dyn.concat(walls), meta, id: trial_id}
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
  let dist3 = blockOnBase(dist2, 0.52, cols.grey, 'dist3', true);

  [[bA, bB, dist1], [bC, bD, dist2, dist3]].forEach(function(blocks, i){
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
    'ac1': ["uncertain", "uncertain", "train-a-implies-c-c-falls-but-slowly"]
  };
  let colors = {'ac0': [cols.train_blocks[1], cols.train_blocks[0]],
                'ac1': [cols.train_blocks[0], cols.train_blocks[1]]
              };
  let horiz = {
    'ac0': [true, true],
    'ac1': [false, true]}

  _.keys(colors).forEach(function(key, i){
    let walls = Walls.train.a_implies_c();
    let b1 = blockOnBase(walls[0], -PRIOR[meta[key][0]],
      colors[key][0], 'blockUp_' + key, horiz[key][0]);
    let b2 = blockOnBase(walls[1], PRIOR[meta[key][1]],
      colors[key][1], 'blockLow_' + key, horiz[key][1]);
    let blocks = [];

    if(key === "ac1") {
      let ramp = Walls.train.tilted_independent("steep", true, walls[0]);
      Body.setPosition(b1, {x: b1.position.x + 50, y:b1.position.y});
      walls = walls.concat(ramp);
    } else if (key === "ac0") {
      let w1Bounds = walls[1].bounds;
      Body.setPosition(walls[1], {x: walls[1].position.x - 40,
          y: walls[0].bounds.max.y + 150 + (w1Bounds.max.y - w1Bounds.min.y)/2});

      let wx = wall('xWall', w1Bounds.max.x - props.blocks.h/1.2,
        w1Bounds.min.y - props.blocks.w/2, props.blocks.h, props.blocks.w);
        walls.push(wx);

      b2 = blockOnBase(wx, PRIOR[meta[key][1]], colors[key][1],
        'blockLow_' + key, horiz[key][1]);
    }
    blocks = blocks.concat([b1, b2]);
    let id = "a_implies_c_" + i
    data[id] = {objs: blocks.concat(walls),
                meta: meta[key], id}
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
  let bB = block(walls[1].bounds.min.x + 3, walls[1].bounds.min.y,
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
