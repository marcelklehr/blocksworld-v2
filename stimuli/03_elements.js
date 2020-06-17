 let Walls = {'test': {}, 'train': {}, 'tilted': {}};

// ground of scene
const Bottom = wall(label='bottom', x=SCENE.w/2, y=SCENE.h - PROPS.bottom.h/2,
  w=SCENE.w, h=PROPS.bottom.h);

// base walls
// INDEPENDENT TRIALS
let W_UP1 = wall('w_up1', 280, 100);
let W_UP2 = wall('w_up2', 520, 100);
let W_LOW1 = wall('w_low1', 300, 250, w=100)
let W_LOW2 = wall('w_low2', 500, 250, w=100)


let W4 = wall('w4_upRight', 750, 240, 90);
let W5 = wall('w5_base_ramp', 320, 225, W_BASE_RAMP.default)
let W6 = wall('w6_upRight', 750, 240, 90)


makeRamp = function(horiz, prior, increase, w1, label1="bottom", test=true) {
  let angle =  ANGLES[horiz ? "horizontal" : "vertical"][prior]
  let overlap = OVERLAP_SHIFT["angle" + angle];
  let label2 = label1 === "bottom" ? "top" : "bottom";

  let dat = increase && label1 === "top" ? {rx: "min", ry: "min", x: -1, y: 1, shift: 1} :
            increase && label1 === "bottom" ? {rx: "max", ry: "max", x: 1, y: -1, shift: -1} :
            label1 === "top" ? {rx: "max", ry: "min", x: 1, y: 1, shift: 1}
                             : {rx: "min", ry: "max", x: -1, y: -1, shift: 1};
  // 1. sin(angle) = h/w_tillted and 2. h² + w_low² = ramp²
  let r = increase ? radians(360 - angle) : radians(angle);
  let ramp_width = Math.sqrt(Math.pow(100, 2) / (1 - Math.pow(Math.sin(r), 2)))
  let ramp = wall('ramp' + angle, w1.bounds[dat.rx].x + dat.x * ramp_width/2,
    w1.bounds[dat.ry].y + dat.y * PROPS.walls.h/2, ramp_width);
  Body.rotate(ramp, r, {x: w1.bounds[dat.rx].x, y: w1.bounds[dat.ry].y});

  let width_w2 = W_BASE_RAMP[prior]
  let x2 = dat.x == 1 ? "max" : "min";
  let y2 = dat.y == 1 ? "max" : "min";
  let w2 = wall(label = 'ramp_' + label2 + angle,
    ramp.bounds[x2].x + dat.x * width_w2/2 - dat.x * overlap * dat.shift,
    ramp.bounds[y2].y - dat.y * PROPS.walls.h/2, width_w2);

  dat.walls = label1==="bottom" ? {'top': w2, 'bottom': w1} : {'top': w1, 'bottom': w2};
  dat.x_ball = increase ? dat.walls.top.bounds.min.x - PROPS.balls.move_to_roll : dat.walls.top.bounds.max.x + PROPS.balls.move_to_roll;
  let col_ball = test ? COLORS_BALL.test : COLORS_BALL.train[angle.toString()];
  let ball1 = ball(dat.x_ball, dat.walls.top.bounds.min.y - PROPS.balls.radius,
    PROPS.balls.radius, 'ball1', col_ball);

  return {'tilted': ramp, 'wall_top': dat.walls.top,
   'wall_bottom': dat.walls.bottom, 'ball': ball1, 'angle': angle}
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
Walls.test = {'independent': [[W_UP1, W_LOW1], [W_UP2, W_LOW2]],
              'ac_1': [[W_IF_UP1,  W_IF_BASE],
                              [W_IF_UP2,  W_IF_BASE]],
              'ac_2': []
              };

Walls.test.seesaw_trials = function(prior, side_ramp, offset=PROPS.seesaw.d_to_walls){
  let y_bases = 220;
  let data = side_ramp === "right" ?
    {x0: 75, y0: y_bases, w0: 0.6 * PROPS.walls.w, y1: y_bases, w1: W_BASE_RAMP[prior]} :
    {x0: 275, y0: y_bases, w0: W_BASE_RAMP[prior], y1: y_bases, w1: 0.6 * PROPS.walls.w};
  let base0 = wall('seesaw_base_left', data.x0, data.y0, data.w0);
  let pos = base0.bounds.max.x + PROPS.seesaw.plank.w/2 + offset;
  let objs = seesaw(pos);
  let base1 = wall('seesaw_base_right',
    objs.plank.bounds.max.x + offset + data.w1/2, data.y1, data.w1);
  let walls = [base0, base1].concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}


//// Elements for TRAINING TRIALS //////
let W8 = wall('w8_middle_left', 0.3 * SCENE.w, SCENE.h/3);
let W9 = wall('w9_middle_right', (3/4) * SCENE.w, SCENE.h/3);
let W10 = wall('w10_right_low', (2/3) * SCENE.w, (3/4) * SCENE.h);
Walls.train.uncertain = [[W8, W9, W10]];

Walls.train.steepness = [wall('w_ramp1', SCENE.w/2, 100, W_BASE_RAMP.default),
  wall('w_ramp2', SCENE.w/2, 220, W_BASE_RAMP.default),
  wall('w_ramp3', SCENE.w/2, 340, W_BASE_RAMP.default)];

Walls.train.distance = [wall('w_ramp1', 150, 80, W_BASE_RAMP["low"]),
  wall('w_ramp2', 150, 180, W_BASE_RAMP["uncertain"]),
  wall('w_ramp3', 150, 300, W_BASE_RAMP["high"])];

Walls.train.ac_1 = function(){
  return [wall('wall_ac_top', 580, 150, W_BASE_RAMP.default),
          wall('wall_ac_low', 390, 320)];
}

Walls.train.seesaw_trials = function(){
  let objs = seesaw(SCENE.w/2 - 30, SCENE.h - PROPS.bottom.h,
    props={'plank': {'w': 280, 'h': 10}});
  // let angle = 45;
  // let ramp = wall('ramp', 200, 175, Math.pow(10,2)*Math.sqrt(2), PROPS.walls.h,
  //   OPTS['ramp'+angle]);
  // Body.setAngle(ramp, radians(angle));
  // first two elements are bases for blocks!
  let walls = [wall('wallTopLeft', 150, 155, 100),
               wall('wall_seesaw_right', 600, 240, 175)].concat([objs.skeleton]);
  return {'walls': walls, 'dynamic': [objs.plank, objs.constraint]}
}
