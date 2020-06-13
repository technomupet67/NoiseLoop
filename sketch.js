// this code will only work with chrome if there is a local server running
// use : python -m SimpleHTTPServer
// then load in chrome the page 127.0.0.1:8000//index.html
// or http://localhost:8000
// annoying but only way I could make it work
// can also use python -m http.server for python3


// might also work with node.js
// to install npm install -g http-server
// then to launch the server command in the folder :>  http-server -c-1
// page is at a different port address : http://localhost:8080/


// Create a CCapture object
var capturer = new CCapture({
    framerate: 30,
    format: 'gif',
    workersPath: './js/',
    verbose: false

});

// stuff for the gui
var gui;
var visible = true;

var rad = 2.5;
var radMin = 0.1;
var radMax = 10.0;
var radStep = 0.1;

var m = 1000;
var mMin = 200;
var mMax = 2000;
var mStep = 50;

var nperiod = 2.0;
var nperiodMin = 0.5;
var nperiodMax = 5.0;
var nperiodStep = 0.1;


// stuff for the code in general
var s = 10 + Math.random(1000);
var numFrames = 120;
const Simplex = openSimplexNoise(Date.now());
var capture_to_gif = false;



function setup() {
    // this is switch off the Retina display pixel doubling to render 1 point = 1 pixel
    // make the code run a lot faster as well
    pixelDensity(1);
    // Saving the canvas into a variable so it can be used by capturer
    let p5canvas = createCanvas(200, 100);
    canvas = p5canvas.canvas;
    // put the usual code below this
    background(255);
    stroke(255, 0, 0);
    noFill();

    // for the gui
    gui = createGui("Parameters for Scribles on fire !");
    gui.addGlobals('rad','m','nperiod');
    if (visible) gui.show();
    else gui.hide();

    // just initialising the capturer
    if (capture_to_gif == true) {
        capturer.start();
    }
}

// check for keyboard events
function keyPressed() {
    switch (key) {
        // type "g" to hide / show the GUI
        case 'p':
            visible = !visible;
            if (visible) gui.show();
            else gui.hide();
            break;
    }
}

function draw() {
    // Test for end of looping
    // this will finish the GIF capture and save after 2 seconds
    // other methods could be used here
    if (capture_to_gif == true) {
        // if capturing and end of number of frames to make a perfect loop then stop and save
        if (frameCount >= numFrames) {
            // end the capture 
            capturer.stop();
            // assemble to make a gif with save
            capturer.save();
            // stop the program
            noLoop();
            console.log(`Render time ${floor(millis() / 1000)} seconds `);
        }
    }
    // usual code below here
    // t is used to make the perfect loop for the GIFs
    let t = 1 * frameCount / numFrames;
    background(255, 200);

    for (let i = 0; i < m; i++) {
        let p = 1.0 * i / m;
        let dx = 25 * Simplex.noise3D(s + rad * cos(TWO_PI * (nperiod * p - t)), rad * sin(TWO_PI * (nperiod * p - t)), 4.0 * p);
        let dy = 25 * Simplex.noise3D(2 * s + rad * cos(TWO_PI * (nperiod * p - t)), rad * sin(TWO_PI * (nperiod * p - t)), 4.0 * p);
        stroke(255, 255 - map(dy, 0, 20, 80, 240), 0, 85);
        //let r2 = random(1, 3);
        // ellipse(p * width + dx, height / 2 + 5 * dy,r2,r2);
        cx = p * width + dx;
        cy = height / 2 + 2 * dy;
        if (frameCount < 2) {
            px = cx;
            py = cy;
        }

        if (cx<px){
            px = cx;
        }

        line(px, py, cx, cy);
        px = cx;
        py = cy;

    }


    // Important to have this after the frame is drawnand looping back
    if (capture_to_gif == true) {
        capturer.capture(canvas);
    }
}
var visible = true;