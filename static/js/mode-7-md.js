const {cos, sin} = Math
document.addEventListener('DOMContentLoaded',() => {

  var rboard = JXG.JSXGraph.initBoard('transformation-rotation-box', {boundingbox: [-2, 2,2, -2], axis: true, grid: false});
  var hboard = JXG.JSXGraph.initBoard('homogenous-transformation-box', {boundingbox: [-1, 6,6, -1], axis: true, grid: false});
  var ab1 = JXG.JSXGraph.initBoard('arbitrary-rotation-1', {boundingbox: [-4, 7,4, -1], axis: true, grid: false});
  var ab2 = JXG.JSXGraph.initBoard('arbitrary-rotation-2', {boundingbox: [-4, 7,4, -1], axis: true, grid: false});
  var ab3 = JXG.JSXGraph.initBoard('arbitrary-rotation-3', {boundingbox: [-4, 7,4, -1], axis: true, grid: false});
  var ab4 = JXG.JSXGraph.initBoard('arbitrary-rotation-4', {boundingbox: [-4, 7,4, -1], axis: true, grid: false});
  var bt1 = JXG.JSXGraph.initBoard('barycentric-triangle', {boundingbox: [-5, 45,45, -5], axis: true, grid: false});

  const unitSquare = [
    [0,0],
    [1,0],
    [1,1],
    [0,1]
  ]
  const c30 = cos(0.523599)
  const s30 = sin(0.523599)


  const transform = (points, transformer) => points.map(transformer)
  const drawSquare = (board, points) => {
    return board.create('polygon', points.map(p => {
      return board.create('point', p, {withLabel: false, size: 0, fixed:true})
    }))
  }

  let sq = drawSquare(rboard, unitSquare)

  const rotationTransformer = ([x,y]) => {
    return [
      x*c30 + y*-s30,
      x*s30 + y*c30
    ]
  }
  const rotatedSquare = transform(unitSquare, rotationTransformer)
  const rotsq = drawSquare(rboard, rotatedSquare)
  rotsq.setProperty({fillColor: '#ff00ff', fillOpacity: 0.5})

  drawSquare(hboard, unitSquare)

  const translation = {x: 2.25, y: 4.5}
  const translationTransformer = ([x,y]) => [x+translation.x, y + translation.y]
  const translatedSquare = transform(unitSquare,translationTransformer)
  const transq = drawSquare(hboard,translatedSquare)
  transq.setProperty({fillColor: '#ff00ff', fillOpacity: 0.5})

  const q = [-0.5, 1.25]
  const affineSquare0 = transform(unitSquare, ([x,y]) => [x+2, y + 4])
  const affinsq0 = drawSquare(ab1, affineSquare0)
  let qpnt = ab1.create('point', [q[0], q[1]], {size: 3, fixed: true, name: 'q0'})

  const q0 = [-q[0], -q[1]]
  const affineSquare1 = transform(affineSquare0, ([x, y]) => [x+q0[0], y+q0[1]])
  const affinsq1 = drawSquare(ab2, affineSquare1)
  qpnt = ab2.create('point', [q[0], q[1]], {size: 3, fixed: true, name: 'q0', fillOpacity: 0.1, strokeOpacity: 0.1})
  qpnt1 = ab2.create('point', [0, 0], {size: 3, fixed: true, name: 'q1'})

  const affineSquare2 = transform(affineSquare1, rotationTransformer)
  const affinsq2 = drawSquare(ab3, affineSquare2)
  qpnt = ab3.create('point', [q[0], q[1]], {size: 3, fixed: true, name: 'q0', fillOpacity: 0.1, strokeOpacity: 0.1})
  qpnt1 = ab3.create('point', [0, 0], {size: 3, fixed: true, name: 'q1'})

  const affineSquare3 = transform(affineSquare2, ([x, y]) => [x+q[0], y+q[1]])
  const affinsq3 = drawSquare(ab4, affineSquare3)
  qpnt = ab4.create('point', [q[0], q[1]], {size: 3, fixed: true, name: 'q0'})
  qpnt1 = ab4.create('point', [0, 0], {size: 3, fixed: true, name: 'q1', fillOpacity: 0.1, strokeOpacity: 0.1})

  const A = bt1.create('point',[40,25], {size:1, fixed: true, name: 'A'})
  const B = bt1.create('point',[40,5], {size:1, fixed: true, name: 'B'})
  const C = bt1.create('point',[5,5], {size:1, fixed: true, name: 'C'})
  const tri1 = bt1.create('polygon', [A,B,C])
  const p = bt1.create('point', [35,15], {size: 3, fixed: true, name: 'p'})

})
