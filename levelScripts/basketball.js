minWidth = 800
minHeight = 600

width = window.innerWidth
height = window.innerHeight-50

if(width<minWidth){
    width = minWidth
}

if(height<minHeight){
    height = minHeight
}

changeOnResize = []

function compare(a, b) {
    const posA = a.position.y
    const posB = b.position.y

    let comparison = 0;
    if (posA > posB) {
        comparison = 1;
    } else if (posA < posB) {
        comparison = -1;
    }
    return comparison * -1;
}

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Bounds = Matter.Bounds,
    Vector = Matter.Vector;

// create engine
var engine = Engine.create(),
    world = engine.world;

var canvas = document.getElementById('canvas')

// create renderer
var render = Render.create({
    canvas: canvas,
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight-50,
        hasBounds: true,
        showAngleIndicator: false,
        wireframes: false,
        background: '#2D333B',
    }
});

Render.run(render);

// create runner
var runner = Runner.create({
    isFixed: true,
  })
runner.delta = 1000 / 60
Runner.run(runner, engine);

// add bodies
var ground = Bodies.rectangle(width / 2, height - 20, width, 40, { isStatic: true, render: { fillStyle: '#060a19' } }),
    rockOptions = { density: 0.004, restitution: 0.7 },
    rock = Bodies.polygon(170, height - 250, 1, 20, rockOptions),
    anchor = { x: 170, y: height - 250 },
    elastic = Constraint.create({
        pointA: anchor,
        bodyB: rock,
        stiffness: 0.01
    });

var cloth = cloth(width - 195, height - 400, 6, 4, 5, 5, false, 8);
cloth.bodies[0].isStatic = true
cloth.bodies[5].isStatic = true

//basket
mainBasket = Bodies.rectangle(width - 80, height - 265, 15, 450, { isStatic: true })

//walls
wallL = Bodies.rectangle(-10, -height *2, 20, height * 10, { isStatic: true })
wallR = Bodies.rectangle(width + 10, -height*2, 20, height * 10, { isStatic: true })
wallR.render.visible = false
wallL.render.visible = false

Composite.add(engine.world, [ground, wallL, wallR, rock, cloth, mainBasket, elastic]);
changeOnResize.push([ground, wallL, wallR, rock, cloth, mainBasket, elastic])

Events.on(engine, 'afterUpdate', function () {
    //newRock = engine.world.bodies[engine.world.bodies.length-2]
    if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < height - 320)) {
        rock = Bodies.polygon(170, height - 250, 1, 20, rockOptions);
        Composite.add(engine.world, rock);
        elastic.bodyB = rock;
    }
    // newRockY = newRock.position.y
    // console.log(newRockY)
    // if (newRockY < 20) {
    //     Render.lookAt(render, {
    //         min: { x: 0, y: newRockY },
    //         max: { x: width, y: height }
    //     });
    // }

    highestBody = 0
    engine.world.bodies.sort(compare).forEach(function (element) {
        if (element.isStatic == false) {
            highestBody = element
            return
        }
    });
    if (highestBody.position.y < 50) {
        Render.lookAt(render, {
            min: { x: 0, y: +highestBody.position.y-50 },
            max: { x: width, y: height}
        });
    } else {
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: width, y: height}
        });
    }
});

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

//  // get the centre of the viewport
//  var viewportCentre = {
//     x: render.options.width * 0.5,
//     y: render.options.height * 0.5
// };

// // create limits for the viewport
// var extents = {
//     min: { x: 0, y: 0 },
//     max: { x: width, y: height }
// };

// // keep track of current bounds scale (view zoom)
// var boundsScaleTarget = 1,
//     boundsScale = {
//         x: 1,
//         y: 1
//     };

// // use a render event to control our view
// Events.on(render, 'beforeRender', function() {
//     var world = engine.world,
//         mouse = mouseConstraint.mouse,
//         translate;

//     // mouse wheel controls zoom
//     var scaleFactor = mouse.wheelDelta * -0.1;
//     if (scaleFactor !== 0) {
//         if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
//             boundsScaleTarget += scaleFactor;
//         }
//     }

//     // if scale has changed
//     if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
//         // smoothly tween scale factor
//         scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.1;
//         boundsScale.x += scaleFactor;
//         boundsScale.y += scaleFactor;

//         // scale the render bounds
//         render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
//         render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

//         // translate so zoom is from centre of view
//         translate = {
//             x: render.options.width * scaleFactor * -0.5,
//             y: render.options.height * scaleFactor * -0.5
//         };

//         Bounds.translate(render.bounds, translate);

//         // update mouse
//         Mouse.setScale(mouse, boundsScale);
//         Mouse.setOffset(mouse, render.bounds.min);
//     }

//     // get vector from mouse relative to centre of viewport
//     var deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
//         centreDist = Vector.magnitude(deltaCentre);

//     // translate the view if mouse has moved over 50px from the centre of viewport
//     if (centreDist > 50) {
//         // create a vector to translate the view, allowing the user to control view speed
//         var direction = Vector.normalise(deltaCentre),
//             speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

//         translate = Vector.mult(direction, speed);

//         // prevent the view moving outside the extents
//         if (render.bounds.min.x + translate.x < extents.min.x)
//             translate.x = extents.min.x - render.bounds.min.x;

//         if (render.bounds.max.x + translate.x > extents.max.x)
//             translate.x = extents.max.x - render.bounds.max.x;

//         if (render.bounds.min.y + translate.y < extents.min.y)
//             translate.y = extents.min.y - render.bounds.min.y;

//         if (render.bounds.max.y + translate.y > extents.max.y)
//             translate.y = extents.max.y - render.bounds.max.y;

//         // move the view
//         Bounds.translate(render.bounds, translate);

//         // we must update the mouse too
//         Mouse.setOffset(mouse, render.bounds.min);
//     }
// });

window.addEventListener("resize", function () {
    location.reload();
    // canvas.width = window.innerWidth - 300;
    // canvas.height = window.innerHeight;
    // changeOnResize[0].forEach(element => {
    //     if(element.type != 'constraint' && element.type != 'composite'){
    //         Matter.Body.set(ele, "position", {x: 100, y: 100})
    //     }
    // });
});

function cloth(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composites = Matter.Composites;

    var group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: false } }, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.1, render: { type: 'line', anchors: false } }, constraintOptions);

    var cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};