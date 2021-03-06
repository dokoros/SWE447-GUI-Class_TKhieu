
var cube = undefined;
var gl = undefined;
var angle = 0;

function init() {
  var canvas = document.getElementById( "webgl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );

  if ( !gl ) {
    alert("Unable to setup WebGL");
    return;
  }

  //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
  gl.enable(gl.CULL_FACE);
  gl.enable( gl.DEPTH_TEST );
  

  cube = new Cube();

  render();
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  angle += 2.0; // degrees

  cube.MV = rotate( angle, [1, 1, 0] );

  cube.render();

  requestAnimationFrame( render ); // schedule another call to render()
}

window.onload = init;
