let Walls = {'test': {}, 'train': {}, 'tilted': {}};

// ground of scene
const Bottom = wall(label='bottom', x=SCENE.w/2, y=SCENE.h - PROPS.bottom.h/2,
  w=SCENE.w, h=PROPS.bottom.h);

// base walls
let W1 = wall('w1_upLeft', 320, 100);
let W1_2 = wall('w1_2_upRight', 480, 100);
let W3 = wall('w3_rampLowInd', 414, 240, 175)
let W3_2 = wall('w3_2_rampLowInd', 386, 240, 175)
let W4 = wall('w4_upRight', 750, 240, 90);
// let W5 = wall('w5_base_ramp', 250+(PROPS.walls.w+25)/2, 225, W_BASE_RAMP.default)
let W5 = wall('w5_base_ramp', 320, 225, W_BASE_RAMP.default)
let W6 = wall('w6_upRight', 750, 240, 90)


makeRamp = function(horiz, prior, increase, w1, label_w1="bottom", test=true) {
  let angle =  -1 * ANGLES[horiz ? "horizontal" : "vertical"][prior]
  let overlap = OVERLAP_SHIFT["angle" + Math.abs(angle)];
  let label_w2 = label_w1 === "bottom" ? "top" : "bottom";

  let dat = (increase && label_w1 === "bottom") ?
    {move_x: 1, move_y: -1, edges_x: "max", edges_y: "min"} :

    (increase && label_w1 === "top") ?
    {move_y: 1, move_x: -1, edges_x: "min", edges_y: "max"} :

    // decrease
    (label_w1 === "top") ?
    {move_x: 1, move_y: 1, edges_x: "max", edges_y: "max"} :
    {move_x: -1, move_y: -1, edges_x: "min", edges_y: "min"};

  // 1. sin(angle) = h/w_tillted and 2. h² + w_low² = ramp²
  let r = radians(Math.abs(angle))
  let ramp_width = Math.sqrt(Math.pow(100, 2) / (1 - Math.pow(Math.sin(r), 2)))
  let ramp_x = w1.bounds[dat.edges_x].x + dat.move_x*ramp_width/2 - dat.move_x * overlap
  let hMiddle = Math.sqrt(Math.pow(ramp_width/2, 2) -
    Math.pow(Math.cos(r)*ramp_width/2, 2));
  let ramp_y = w1.position.y + dat.move_y * hMiddle;
  let ramp = wall('ramp' + angle, ramp_x, ramp_y, ramp_width);
  Body.setAngle(ramp, increase ? -r : r);

  let width_w2 = W_BASE_RAMP[prior]
  let w2 = wall(label = 'ramp_' + label_w2 + angle,
    x = ramp.bounds[dat.edges_x].x + dat.move_x * width_w2/2 - dat.move_x * overlap,
    y = ramp.bounds[dat.edges_y].y - dat.move_y * PROPS.walls.h/2,
    w = width_w2
  );

  dat.walls = label_w1==="bottom" ? {'top': w2, 'bottom': w1}
                                  : {'top': w1, 'bottom': w2};
  dat.x_ball = increase ? dat.walls.top.bounds.min.x - PROPS.balls.move_to_roll : dat.walls.top.bounds.max.x + PROPS.balls.move_to_roll;

  let col_ball = test ? ball_colors.test : ball_colors.train[Math.abs(angle).toString()];
  let ball1 = ball(dat.x_ball, dat.walls.top.bounds.min.y - PROPS.balls.radius,
    PROPS.balls.radius, 'ball1', col_ball);
  return {'tilted': ramp, 'wall_top': dat.walls.top,
   'wall_bottom': dat.walls.bottom, 'ball': ball1}
}

seesaw = function(x, y_base_min=SCENE.h - PROPS.bottom.h, props={}){
  props = Object.keys(props).length == 0 ? PROPS.seesaw :
    Object.assign({}, PROPS.seesaw, props);

  let y = y_base_min - props.stick.h / 2;
  let stick = wall('stick', x, y,
    props.stick.w, props.stick.h, {render: {fillStyle: cols.darkgrey}});

  let link = wall('link', x, stick.bounds.min.y - props.link.h/2,
    props.link.w, props.link.h, {render: {fillStyle: cols.darkbrown}}
  );
  let skeleton = Body.create({'parts': [stick, link],
    'isStatic': true,
    'label': 'skeleton'
  });
  let def_ss = props;
  let y_plank = link.bounds.min.y - def_ss.plank.h/2;
  let opts = Object.assign({label:'plank', render:{fillStyle: cols.plank}}, OPTS.plank);
  let plank = Bodies.rectangle(x, y_plank, def_ss.plank.w, def_ss.plank.h, opts)

  var constraint = Constraint.create({
    pointA: {x: plank.position.x, y: plank.position.y},
    bodyB: plank,
    stiffness: 0.7,
    length: 0
  });
  return {stick, link, skeleton, plank, constraint}
}

W_IF_UP1 = wall('wall_ac_up', 600, 90, 150),
W_IF_UP2 = wall('wall_ac_up', 150, 90, 150),
W_IF_BASE = wall('wall_base_seesaw', 375, 185, 80)

W_IF_RAMP_TOP = function(side){
  let move_x = side == "right" ? 1 : - 1;
  let x = W_IF_BASE.position.x + move_x * 40 + move_x * PROPS.walls.w / 2;
  let y = W_IF_BASE.position.y + 67;
  return wall('ramp_top', x, y);
}

// The first two list entries are respectively the bases for block1 and block2
Walls.test = {'independent': [[W1, W3], [W1_2, W3_2]], // tilted wall+ball added dep on prior
              'a_implies_c': [[W_IF_UP1,  W_IF_BASE],
                              [W_IF_UP2,  W_IF_BASE]],
              'a_iff_c': []
              };

Walls.test.seesaw_trials = function(side_ramp, offset=PROPS.seesaw.d_to_walls){
  let data = side_ramp === "right" ? {x0: 175, w0: 0.6 * W_BASE_RAMP.default, w1: W_BASE_RAMP.default}
                                   : {x0: 275, w0: W_BASE_RAMP.default, w1: 0.6 * W_BASE_RAMP.default};
  let base0 = wall('wall_seesaw_left', data.x0, 240, data.w0);
  let pos = base0.bounds.max.x + PROPS.seesaw.plank.w/2 + offset;
  let objs = seesaw(pos);
  let base1 = wall('wall_seesaw_right',
    objs.plank.bounds.max.x + offset + data.w1/2, base0.position.y, data.w1);
  let walls = [base0, base1].concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}


//// Elements for TRAINING TRIALS //////
let W8 = wall('w8_middle_left', 0.3 * SCENE.w, SCENE.h/3);
let W9 = wall('w9_middle_right', (3/4) * SCENE.w, SCENE.h/3);
let W10 = wall('w10_right_low', (2/3) * SCENE.w, (3/4) * SCENE.h);
let W11 = wall('w11_top', 400, 120, W_BASE_RAMP.default)
let W12 = wall('w12_middle', 400, 230, W_BASE_RAMP.default)
let W13 = wall('w13_down', 400, 350, W_BASE_RAMP.default)
Walls.train.uncertain = [[W8, W9, W10], [W11, W12, W13]]

Walls.train.a_implies_c = function(){
  return [wall('wall_ac_top', 580, 150, W_BASE_RAMP.default),
          wall('wall_ac_low', 390, 320)];
}

Walls.train.seesaw_trials = function(){
  let objs = seesaw(SCENE.w/2)
  let angle = 45;
  let ramp = wall('ramp', 200, 175, Math.pow(10,2)*Math.sqrt(2), PROPS.walls.h,
    OPTS['ramp'+angle]);
  Body.setAngle(ramp, radians(angle));
  // first two elements are bases for blocks!
  let walls = [wall('wallTopLeft', 100, 125, 100),
               wall('wall_seesaw_right', 600, 240, 175), ramp].concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}
