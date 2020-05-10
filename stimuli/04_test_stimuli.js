let TestStimuli = {"independent": {}, "a_implies_c": {}, "a_iff_c": {}};

// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)
testTrials_a_iff_c = function(priors){
  let pp = priors[0][0] + priors[1][0]
  let horiz = HORIZ_IFF[pp];
  let data = priors[0] !== priors[1] ?
    {ramp: "left", i_ramp: 0, b_sides: [1,1], 'increase': 0}:
    {ramp: "right", i_ramp: 1, b_sides: [-1,-1], 'increase': 1};

  let seesaw = Walls.test.seesaw_trials(data.ramp)
  let ramp_walls = rampElems(priors[data.i_ramp], data.increase,
    seesaw.walls[data.i_ramp], horiz[data.i_ramp]);

  let objs = seesaw.dynamic.concat(ramp_walls).concat(seesaw.walls)
  // add 2 blocks + 1 extra block
  let w_no_ramp = seesaw.walls[data.i_ramp === 0 ? 1 : 0];
  let w_x = w_no_ramp.bounds[data.i_ramp === 0 ? "min" : "max"].x
  let w_width = w_no_ramp.bounds.max.x - w_no_ramp.bounds.min.x;
  let xBlock = blockOnBase(w_no_ramp, -1 * data.b_sides[0] * 0.52,
    cols.darkgrey, "Xblock", true);
  let bases = [xBlock];
  let w_ramp = seesaw.walls[data.i_ramp];
  data.i_ramp === 0 ? bases.unshift(w_ramp) : bases.push(w_ramp);
  let blocks = [];
  if (pp === "hh") {
    let xBlock2 = blockOnBase(xBlock, 0.52 * data.b_sides[0], cols.grey, "xBlock2", true)
    blocks.push(xBlock2)
    bases[0] = xBlock2;
    data.b_sides[0] = data.b_sides[0] * -1
  }
  let colors = assignColors();
  let c1 = cols.test_blocks[colors[0]]; let c2 = cols.test_blocks[colors[1]];
  let w = horiz[data.i_ramp] ? PROPS.blocks.h : PROPS.blocks.w;
  let ps = [];
  ps[0] = data.i_ramp === 0 ? (w + DIST_EDGE) / w : PRIOR[priors[0]];
  ps[1] = data.i_ramp === 1 ? (w + DIST_EDGE) / w : PRIOR[priors[1]];
  let b1 = blockOnBase(bases[0], data.b_sides[0]*ps[0], c1, 'blockA', horiz[0]);
  let b2 = blockOnBase(bases[1], data.b_sides[1]*ps[1], c2, 'blockC', horiz[1]);
  let twoBlocks = [b1, b2];
  if (pp === "uu") {
    let xBlock2 = blockOnBase(w_ramp, -0.52, cols.darkgrey, 'xBlock2', true,
      {w: 1.08 * PROPS.blocks.h, h: PROPS.blocks.w})
    blocks.push(xBlock2)
    twoBlocks[1] = blockOnBase(xBlock2, PRIOR["low"], c2, 'blockC', horiz[1]);
  }
  blocks = twoBlocks.concat(blocks);
  return blocks.concat(xBlock).concat(objs);
}

testTrials_ac = function(priors){
  // first block is on top of a wall, second block on top of an extra block
  let blocks = [];
  let colors = assignColors();
  let p1 = priors[0];
  let p2 = priors[1];
  let data = ['ll', 'hl'].includes(p1[0]+p2[0]) ?
    {moveBLow: 1, moveBUp: -1, increase: false, idx_w: 0, edge_bX: "max"} :
    {moveBLow: -1, moveBUp: 1, increase: true, idx_w: 1, edge_bX: "min"};

  let walls = Walls.test["a_implies_c"][data.idx_w];
  let w1 = walls[1]
  let objs = rampElems(p2, data.increase, w1, true)
  objs = objs.concat(walls);

  let h = PROPS.blocks.h;
  let bX = blockOnBase(w1, data.moveBLow * (h+DIST_EDGE)/h, cols.darkgrey, 'xBlockLow', true)
  let b1 = blockOnBase(walls[0], PRIOR[priors[0]] * data.moveBUp, cols.test_blocks[colors[0]], 'blockA', true);
  let b2 = blockOnBase(bX, PRIOR["low"] * data.moveBLow,
    cols.test_blocks[colors[1]], 'blockC', true);
  blocks = blocks.concat([b1, b2, bX]);

  return blocks.concat(objs)
}

testTrials_independent = function(priors){
  let pp = priors[0][0] + priors[1][0];
  let data = ['ll', 'uh', 'hl'].includes(pp) ?
    {walls: Walls.test.independent[0], increase: true, sides: [-1, -1]} :
    {walls: Walls.test.independent[1], increase: false, sides: [1, 1]};
  let horiz = HORIZ_IND[pp];
  let colors = assignColors();
  let b1 = blockOnBase(data.walls[0], data.sides[0] * PRIOR[priors[0]],
    cols.test_blocks[colors[0]], "blockA", horiz[0])

  let w2 = horiz[1] ? PROPS.blocks.h : PROPS.blocks.w;
  let b2 = blockOnBase(data.walls[1], data.sides[1] * (w2 + DIST_EDGE) / w2,
    cols.test_blocks[colors[1]], "blockC", horiz[1])

  // add seesaw as distractor
  let dist = seesaw(data.increase ? 170 : 630, "low")
  let ramp = rampElems(priors[1], data.increase, data.walls[1], horiz[1]);
  let objs = data.walls.concat([dist.skeleton]).concat(ramp);
  return [b1, b2].concat([dist.plank, dist.constraint]).concat(objs);
}

makeTestStimuli = function(conditions, relations){
  relations.forEach(function(rel){
    let priors_all = conditions[rel]
    for(var i=0; i<priors_all.length; i++){
      let priors = priors_all[i];
      let pb1 = priors[0]
      let pb2 = priors[1]
      let id = rel + '_' + pb1[0] + pb2[0];
      let blocks = rel === "a_iff_c" ?
        testTrials_a_iff_c(priors) : rel === "a_implies_c" ?
        testTrials_ac(priors) : rel === "independent" ?
        testTrials_independent(priors) : null;

      // objs = objs.concat(Walls.test[rel]);
      TestStimuli[rel][id] = {"objs": blocks, "meta": priors};
    }
  })
}

getTestStimulus = function(rel, p) {
  let stimulus = TestStimuli[rel][rel + "_" + p];
  return stimulus
};

if (MODE === "test") {
  makeTestStimuli(getConditions(), Relations);
}
