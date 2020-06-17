var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Constraint = Matter.Constraint;
    Events = Matter.Events;

cols = {
      'red': '#E74C3C',
      'strong_red': '#ff0000',
      'turquois': '#00c9cc',
      'blue': '#2471A3',
      'royal': '#0496FF',
      'green': '#28B463',
      'very_green': '#8DDE19',
      'pinkish': "#D81159",
      'light_green': '#51DE19',
      'purple': '#AF7AC5',
      'brown': '#B05D3A',
      'grey': '#E3DFDC',
      'darkgrey': '#938F8E',
      'darkbrown': '#642F17',
      'black': '#191817',
      'olive': '#53553B',
      'orange': '#FF9B52',
      'yellow': '#FFC966',
      'bordeaux': '#D81159',
      'darkyellow': '#FFBC42',
      'darkgreen': '#119533',
      'darkred': '#8F2D56'
    };
cols.plank = cols.blue
cols.test_blocks = [cols.green, cols.royal];
cols.train_blocks = [cols.bordeaux, cols.darkyellow];

const COLORS_BALL = {'test': cols.darkred,
  'train': {'38': cols.turquois, '35': cols.blue,
  '29': cols.red, '27': cols.yellow,
  '28': cols.red, '25': cols.pinkish , '23': cols.orange, '20': cols.purple}}

let block_cols = {
  test: ['blue', 'green'],
  train: ['red', 'yellow']
}
let block_cols_short = {
  test: [block_cols.test[0][0], block_cols.test[1][0]],
  train: [block_cols.train[0][0], block_cols.train[1][0]]
}
