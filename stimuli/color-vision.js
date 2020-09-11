makeColorVisionStimuli = function(){
  let stimuli = [];
  let base = wall('w_center', SCENE.w/2, SCENE.h/2, PROPS.walls.w,
    PROPS.walls.h, {'render': {'fillStyle': cols.grey}})
  let cols_blocks = cols.test_blocks.concat(cols.train_blocks);
  for(var trial=0; trial<cols_blocks.length; trial++) {
    let id = 'color' + trial;
    let col_block = cols_blocks[trial];
    let b = block(base.position.x, base.bounds.min.y, col_block,
      'b' + trial, true)

    // second block
    // col_b2 = col_block == "#FFBC42" ? "#D81159" : col_block == "#D81159" ? "#FFBC42" : col_block;
    // col_b2 = col_block == "#0496FF" ? "#28B463" : col_block == "#28B463" ? "#0496FF" : col_block;
    // let b2 = blockOnBase(b, 0.75, col_b2, 'b2' + trial, true)
    stimuli.push({'objs': [base, b], 'meta': ['', '', ''], id});
  }
  return stimuli
}
