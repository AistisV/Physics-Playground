minWidth = 800
minHeight = 600

width = window.innerWidth
height = window.innerHeight - 50

if (width < minWidth) {
    width = minWidth
}

if (height < minHeight) {
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
        height: window.innerHeight - 50,
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
var ground = Bodies.rectangle(width / 2, height - 20, width, 40, { isStatic: true, render: { fillStyle: '#060a19' } })

var stack = Composites.stack(0, height-40-10*40, Math.round((width)/80), 10, 40, 0, function (x, y) {
    return Bodies.circle(x, y, 20);
});

//walls
wallL = Bodies.rectangle(-10, -height * 2, 20, height * 10, { isStatic: true })
wallR = Bodies.rectangle(width + 10, -height * 2, 20, height * 10, { isStatic: true })
wallR.render.visible = false
wallL.render.visible = false

Composite.add(engine.world, [ground, wallL, wallR, stack]);
changeOnResize.push([ground, wallL, wallR])

Events.on(engine, 'afterUpdate', function () {
    // newRockY = newRock.position.y
    // console.log(newRockY)
    // if (newRockY < 20) {
    //     Render.lookAt(render, {
    //         min: { x: 0, y: newRockY },
    //         max: { x: width, y: height }
    //     });
    // }

    highestBody = 0
    engine.world.composites[0].bodies.sort(compare).forEach(function (element) {
        if (element.isStatic == false) {
            highestBody = element
            return
        }
    });
    if (highestBody.position.y < 50) {
        Render.lookAt(render, {
            min: { x: 0, y: +highestBody.position.y - 50 },
            max: { x: width, y: height }
        });
    } else {
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: width, y: height }
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