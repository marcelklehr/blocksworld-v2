let TestStimuli = {"independent": {}, "ac1": {}, "ac2": {}};

// IMPORTANT: DYNAMIC BLOCKS HAVE TO BE ADDED BEFORE STATIC OBJECTS, OTHERWISE
// THEY WILL FALL VERY ODD (JITTERING)

testTrials_ac2 = function(priors){
  let pp = priors[0][0] + priors[1][0]
  let horiz = HORIZ_IFF[pp];
  let data = priors[0] !== priors[1] ?
    {side_ramp: "left", i_ramp: 0, b_sides: [1,1], prior: priors[0], 'increase': 0}:
    {side_ramp: "right", i_ramp: 1, b_sides: [-1,-1], prior: priors[1], 'increase': 1};

  let seesaw = Walls.test.ac2(data.prior, horiz[data.i_ramp], data.side_ramp)
  let ramp = makeRamp(horiz[data.i_ramp], priors[data.i_ramp], data.increase,
    seesaw.walls[data.i_ramp]);
  let objs = seesaw.dynamic.concat([ramp.ball]);
  objs = objs.concat([ramp.tilted, ramp.wall_top]).concat(seesaw.walls);
  let w_no_ramp = seesaw.walls[data.i_ramp === 0 ? 1 : 0];
  // let w_x = w_no_ramp.bounds[data.i_ramp === 0 ? "min" : "max"].x
  // let w_width = w_no_ramp.bounds.max.x - w_no_ramp.bounds.min.x;
  let xBlock = blockOnBase(w_no_ramp, -1 * data.b_sides[0] * 0.52,
    cols.darkgrey, "Xblock", true);
  let bases = [xBlock];
  let w_ramp = seesaw.walls[data.i_ramp];
  data.i_ramp === 0 ? bases.unshift(w_ramp) : bases.push(w_ramp);
  let blocks = [];
  let colors = assignColors();
  let c1 = cols.test_blocks[colors[0]];
  let c2 = cols.test_blocks[colors[1]];

  let dir = horiz[data.i_ramp]
  let w = dir == 'horizontal' ? PROPS.blocks.h : PROPS.blocks.w;
  let ps = [data.i_ramp === 0 ? (w + DIST_EDGE) / w : PRIOR[dir][priors[0]],
            data.i_ramp === 1 ? (w + DIST_EDGE) / w : PRIOR[dir][priors[1]]];
  let b1 = blockOnBase(bases[0], data.b_sides[0]*ps[0], c1, 'blockA', horiz[0]=='horizontal');
  let b2 = blockOnBase(bases[1], data.b_sides[1]*ps[1], c2, 'blockC', horiz[1]=='horizontal');
  let twoBlocks = [b1, b2];
  blocks = twoBlocks.concat(blocks);
  return blocks.concat(xBlock).concat(objs);
}

testTrials_ac1 = function(priors){
  let colors = assignColors();
  let p1 = priors[0];
  let p2 = priors[1];
  let horiz =  HORIZ_AC[p1[0]+p2[0]];
  let b2_w = horiz[1] ? PROPS.blocks.h : PROPS.blocks.w;

  let data = ['ll', 'hl', 'uh', 'uu'].includes(p1[0]+p2[0]) ?
  {edge_blocks: -1, increase: true, idx_w: 0, moveBall: 1, side:"right"} :
  {edge_blocks: 1, increase: false, idx_w: 1, moveBall: -1, side:"left"};

  let objs = Walls.test.ac1(data.side, horiz[1], p2)

  let b1 = blockOnBase(objs.walls[0], PRIOR[horiz[0]][p1] * data.edge_blocks,
    cols.test_blocks[colors[0]], 'blockA', horiz[0]);
  let b2 = blockOnBase(objs.walls[1], data.edge_blocks * (b2_w + DIST_EDGE) / b2_w,
    cols.test_blocks[colors[1]], 'blockC', horiz[1]);

  let blocks = [b1, b2].concat(objs.dynamic);
  return blocks.concat(objs.walls)
}

testTrials_independent = function(priors){
  let pp = priors[0][0] + priors[1][0];
  let data = ['ll', 'uh', 'hl'].includes(pp) ?
    {walls: Walls.test.independent[0], increase: false, sides: [-1, 1]} :
    {walls: Walls.test.independent[1], increase: true, sides: [1, -1]};

  let horiz = HORIZ_IND[pp];
  let ramp = makeRamp(horiz[1], priors[1], data.increase, data.walls[1], "top");

  let colors = assignColors();
  let dir = horiz[0] ? 'horizontal' : 'vertical';
  let b1 = blockOnBase(data.walls[0], data.sides[0] * PRIOR[dir][priors[0]],
    cols.test_blocks[colors[0]], "blockA", horiz[0])
  let w2 = horiz[1] ? PROPS.blocks.h : PROPS.blocks.w;
  let b2 = blockOnBase(ramp.wall_bottom, data.sides[1] * (w2 + DIST_EDGE) / w2,
    cols.test_blocks[colors[1]], "blockC", horiz[1])

  // add seesaw as distractor
  let dist = seesaw(data.increase ? 680 : 120)
  let objs = data.walls.concat([dist.skeleton]).concat(
    [ramp.wall_top, ramp.wall_bottom, ramp.tilted]
  );
  return [b1, b2, ramp.ball].concat([dist.plank, dist.constraint]).concat(objs);
}

makeTestStimuli = function(conditions, relations){
  relations.forEach(function(rel){
    let priors_all = conditions[rel]
    for(var i=0; i<priors_all.length; i++){
      let priors = priors_all[i];
      let pb1 = priors[0]
      let pb2 = priors[1]
      let id = rel + '_' + pb1[0] + pb2[0];
      let blocks = rel === "ac2" ?
        testTrials_ac2(priors) : rel === "ac1" ?
        testTrials_ac1(priors) : rel === "independent" ?
        testTrials_independent(priors) : null;
      TestStimuli[rel][id] = {"objs": blocks, "meta": priors};
    }
  })
}

if (MODE === "test") {
  makeTestStimuli(getConditions(), TRIAL_TYPES);
}
