/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;

//---------------------------------------------------------------------------
//
//  Declare our array of planets (each of which is a sphere)
//
// The list of planets to render.  Uncomment any planets that you are
// including in the scene. For each planet in this list, make sure to
// set its distance from the Sun, as well its size, color, and orbit
// around the Sun.

var Planets = {
  Sun : undefined,
  Mercury : undefined,
  Venus : undefined,
  Earth : undefined,
   Moon : undefined,
   Mars : undefined,
   Jupiter : undefined,
   Saturn : undefined,
   Uranus : undefined,
   Neptune : undefined,
   Pluto : undefined
};

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
//var near = 10;      // near clipping plane's distance
//var far = 120;      // far clipping plane's distance
var near = 1;      // near clipping plane's distance
var far = 200;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;

  for (var name in Planets ) {

    // Create a new sphere object for our planet, and assign it into the
    // appropriate place in the Planets dictionary.  And to simplify the code
    // assign that same value to the local variable "p", for later use.

    var planet = Planets[name] = new Sphere();

    // For each planet, we'll add a new property (which itself is a
    // dictionary) that contains the uniforms that we will use in
    // the associated shader programs for drawing the planets.  These
    // uniform's values will be set each frame in render().

    planet.uniforms = {
      color : gl.getUniformLocation(planet.program, "color"),
      MV : gl.getUniformLocation(planet.program, "MV"),
      P : gl.getUniformLocation(planet.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the
  // matrix stack

  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);

  // Create a few temporary variables to make it simpler to work with
  // the various properties we'll use to render the planets.  The Planets
  // dictionary (created in init()) can be indexed by each planet's name.
  // We'll use the temporary variables "planet" to reference the geometric
  // information (e.g., sphere model) we created in the Planets array.
  // Likewise, we'll use "data" to reference the database of information
  // about the planets in SolarSystem.  Look at how these are
  // used; it'll simplify the work you need to do.

  var name, planet, data;

  name = "Sun";
  planet = Planets[name];
  data = SolarSystem[name];

  // Set PointMode to true to render all the vertices as points, as
  // compared to filled triangles.  This can be useful if you think
  // your planet might be inside another planet or the Sun.  Since the
  // "planet" variable is set for each object, you will need to set this
  // for each planet separately.

  planet.PointMode = false;

  // Use the matrix stack to configure and render a planet.  How you rener
  // each planet will be similar, but not exactly the same.  In particular,
  // here, we're only rendering the Sun, which is the center of the Solar
  // system (and hence, has no translation to its location).

  ms.push();
  ms.scale(data.radius);
  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));
  planet.render();
  ms.pop();

  //
  //  Add your code for more planets here!

  // ===MECURY=====
  name = "Mercury";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((data.year * time), [0, 1, 0]);
  ms.translate(((data.distance * 5) + 3), 0, 0);
  ms.scale(data.radius/1.1);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===VENUS=====
  name = "Venus";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((data.year * time), [0, 1, 0]);
  ms.translate(((data.distance * 5) + 5), 0, 0);
  ms.scale(data.radius);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===EARTH=====
  name = "Earth";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((data.year * time), [0, 1, 0]);
  ms.translate(((data.distance * 5) + 5), 0, 0);

  ms.push();
  ms.rotate(((data.year * 365) * time), [0, 1, 0]);
  ms.scale(data.radius);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();


  // ===MOON=====
  name = "Moon";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.rotate(((data.year * 24) * time), [0, 1, 0]);
  ms.translate((data.distance * 500), 0, 0);
  ms.scale(data.radius);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();


  // ===MARS=====
  name = "Mars";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time / data.year), [0, 1, 0]);
  ms.translate(((data.distance * 5) + 5), 0, 0);
  ms.scale(data.radius);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===JUPITER=====
  name = "Jupiter";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time * (data.year/50) ), [0, 1, 0]);
  ms.translate(((data.distance * 5) + 10), 0, 0);
  ms.scale(data.radius / 1.1);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===SATURN=====
  name = "Saturn";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time * (data.year/100)), [0, 1, 0]);
  ms.translate(((data.distance * 5) - 5), 0, 0);
  ms.scale(data.radius/1.2);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===URANUS=====
  name = "Uranus";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time * (data.year/300)), [0, 1, 0]);
  ms.translate(((data.distance * 5) - 40), 0, 0);
  ms.scale(data.radius/1.5);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===NEPTUNE=====
  name = "Neptune";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time * (data.year/700)), [0, 1, 0]);
  ms.translate(((data.distance * 5) - 80), 0, 0);
  ms.scale(data.radius/1.5);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();

  // ===Pluto=====
  name = "Pluto";
  planet = Planets[name];
  data = SolarSystem[name];

  planet.PointMode = false;

  ms.push();
  ms.rotate((time * (data.year/1300)), [0, 1, 0]);
  ms.translate(((data.distance *2) + 10), 0, 0);
  ms.scale(data.radius);

  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));

  planet.render();
  ms.pop();
  //

  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 60.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;
