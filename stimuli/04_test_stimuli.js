let TestStimuli = {"independent": {}, "a_implies_c": {}, "a_iff_c": {}};
// conditions cotains combis of P(A) and P(C) from [high, low, uncertain]

// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)
make2ColoredBlocks = function(bases, priors_str, sides){
  let priors = [PRIOR[priors_str[0]], PRIOR[priors_str[1]]];
  let colors = assignColors(); // colors randomly assigned
  let blocks = [];
  for(var i=0; i<=1; i++){
    let prior = priors[i]
    let l = i===0 ? "A" : "C";
    let b = blockOnBase(bases[i], prior * sides[i], cols.test_blocks[colors[i]],
      'block' + l, priors_str[i] === "low" || priors_str[i] === "uncertain");
      blocks.push(b);
  }
  return blocks
}

testTrials_a_iff_c = function(priors){
  let pp = priors[0][0] + priors[1][0]
  let data_ramp = priors[0] === priors[1] ?
    {side: "right", i: 1, 'moveBlock': 1, 'increase': true} :
    {side: "left", i: 0, 'moveBlock': -1, 'increase': false};

  let offset = data_ramp.side === "left" ? 50 : -50;
  let seesaw_elems = Walls.test.seesaw_trials(offset)

  let ramp_walls;
  if (priors[data_ramp.i] === "uncertain" || priors[data_ramp.i] === "low") {
    ramp_walls = Walls.test.tilted.a_iff_c('plane', data_ramp.increase,
      seesaw_elems.walls[data_ramp.i])
  } else {
    ramp_walls = Walls.test.tilted.a_iff_c('steep', data_ramp.increase,
      seesaw_elems.walls[data_ramp.i]);
  }
  let objs = seesaw_elems.dynamic.concat(ramp_walls).concat(seesaw_elems.walls)
  // add 2 blocks + 1 extra block
  let xBlock,
      bases,
      sides,
      factor;
  if (data_ramp.side === "left") {
    factor = -1
    let wr = seesaw_elems.walls[1];
    let xl = wr.bounds.min.x;
    let width = wr.bounds.max.x - wr.bounds.min.x;
    Matter.Body.scale(wr, 2/3, 1)
    Matter.Body.setPosition(wr, {x: xl + (2/3) *  width / 2, y: wr.position.y});
    xBlock = blockOnBase(wr, factor * 0.52, cols.darkgrey,
      "XblockR", true, {w: props.blocks.h*1.5, h: props.blocks.w})
    bases = [seesaw_elems.walls[0], xBlock]
    sides = [1, 1]
  } else {
    factor = 1;
    let wl = seesaw_elems.walls[0]
    let xr = wl.bounds.max.x;
    let width = wl.bounds.max.x - wl.bounds.min.x;
    Matter.Body.scale(wl, 2/3, 1)
    Matter.Body.setPosition(wl, {x: xr - (2/3) *  width / 2, y: wl.position.y});
    xBlock = blockOnBase(wl, factor * 0.52, cols.darkgrey,
      "XblockL", true, {w: props.blocks.h*1.5, h: props.blocks.w})
    bases = [xBlock, seesaw_elems.walls[1]]
    sides = [-1, -1]
  }
  let blocks = [];
  if (pp === "hh") {
    let xBlock2 = blockOnBase(xBlock, 0.52 * -factor, cols.grey, "xBlock2", true)
    blocks.push(xBlock2)
    let idx = factor === -1 ? 1 : 0;
    bases[idx] = xBlock2
    sides[idx] = sides[idx] * -1
  }
  let twoBlocks = make2ColoredBlocks(bases, priors, sides);
  let shift = IFF_SHIFT[priors[data_ramp.i]] * data_ramp.moveBlock;
  let b = twoBlocks[data_ramp.i]
  Matter.Body.setPosition(b, {x: b.position.x + shift, y: b.position.y});
  blocks = blocks.concat(twoBlocks).concat(xBlock);
  return blocks.concat(objs);
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
  let tilt = p2==="high" ? "steep" : p2==="low" ? "plane" : "middle";
  let objs = Walls.test.tilted.a_implies_c(tilt, data.increase, w1);
  objs = objs.concat(walls);

  let bX = block(w1.bounds[data.edge_bX].x + data.moveBUp*(20+props.blocks.h/2),
    w1.bounds.min.y, cols.darkgrey, 'xBlockLow', true)

  let b1 = blockOnBase(walls[0], PRIOR[priors[0]] * data.moveBUp, cols.test_blocks[colors[0]], 'blockA', true);
  let b2 = blockOnBase(bX, PRIOR["low"] * data.moveBLow,
    cols.test_blocks[colors[1]], 'blockC', true);
  blocks = blocks.concat([b1, b2, bX]);

  return blocks.concat(objs)
}

testTrials_independent = function(priors){
  let p1 = priors[0][0];
  let p2 = priors[1][0];
  let data = ['ll', 'uh', 'hl'].includes(p1[0]+p2[0]) ?
    {walls: Walls.test.independent[0], increase: true, sides: [-1, -1]} :
    {walls: Walls.test.independent[1], increase: false, sides: [1, 1]};
  // second block has to be moved further away from edge depending on prior
  // and angle of tilted wall has to be adjusted
  let blocks = make2ColoredBlocks(data.walls, priors, data.sides);
  let b2 = blocks[1];
  let shift = INDEPENDENT_SHIFT[priors[1]];
  Matter.Body.setPosition(b2, {x: b2.position.x + shift * -data.sides[0], y: b2.position.y});
  // add seesaw as distractor
  let dist = seesaw(data.increase ? 170 : 630, "independent")
  let tilt = priors[1] === "high" ? 'steep' : 'plane';
  let ramp = Walls.test.tilted["independent"](tilt, data.increase, data.walls[1]);
  let objs = data.walls.concat([dist.skeleton]).concat(ramp);
  return blocks.concat([dist.plank, dist.constraint]).concat(objs);
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
