var socket;
var previous;
var previous2;
var t;
var tdif = 0.01;
var m = 6;
var p0;
var tmin;
var tmax;
var heart;
var a;
var r;
var g;
var b;
var size = 32;
var rslider;
var gslider;
var bslider;
var NumOfClients = 1;
var IsHost = false;
var thing = [];


function drawHeart(posx, posy) {
  p0 = createVector(0,0);
  tmin= -PI;
  tmax = PI;
  t = tmin;

  strokeWeight(1);
  calcPos(p0.x, p0.y, t, m);
  beginShape();
  while (t < tmax) {
    calcPos(p0.x, p0.y, t, m);
    vertex(p0.x + posx, p0.y + posy);
    t += tdif;
  }
  endShape(CLOSE);
}

function setup() {
  r = random(255);
  g = random(255);
  b = random(255);
  a = random(255);
  aslider = createSlider(0, 255, a);
  rslider = createSlider(0, 255, r);
  gslider = createSlider(0, 255, g);
  bslider = createSlider(0, 255, b);
  sizeslider = createSlider(1, 64, size);
  createCanvas(innerWidth, innerHeight - rslider.height - 4);
  background(51);
  socket = io.connect(window.location.host);
  socket.on('mouse', newDrawing);
  socket.on('heart', newHeart);
  socket.on('fill', drawFill);
  socket.on('returnClientData', gatherClientData);
  socket.on('host', doHost);
  socket.on('resetOthers', completeReset);
  socket.emit('startup', null);
  previous = createVector(0,0);
}

function completeReset() {
  background(51);

}

function doHost() {
  console.log('I am Host');
  IsHost = true;
}

function gatherClientData(data) {
  NumOfClients = data.num;
}

function drawFill() {
  background(100,255,0);
}
function keyPressed() {
  var i;
  var j;
  var k;
  if (keyCode === 72) {
      if (heart) {
          heart = false;
      } else {
          heart = true;
      }
  }
}

function newHeart(data) {
  fill(255,0,100, a)
  stroke(255,0,0, a);
  drawHeart(data.x, data.y);
}

function newDrawing(data) {
  console.log("Got: " + data.x + " " + data.y);
  if (!data.px == 0 && !data.py == 0) {
    stroke(data.r,data.g,data.b, data.a);
    strokeWeight(data.size);
    line(data.x, data.y, data.px, data.py);
  } else {
    noStroke();
    fill(data.r,data.g,data.b, data.a)
    ellipse(data.x, data.y, data.size, data.size);
  }


}

function mouseReleased() {
    previous = createVector(0,0);
}

function mousePressed() {
  if (!heart == true) {
    console.log('Sending: ' + mouseX + ',' + constrain(mouseY, 0, innerHeight))
    fill(r, g, b, a);
    noStroke();
    ellipse(mouseX, constrain(mouseY, 0, innerHeight), size, size);
    var data = {
      x: mouseX,
      y: constrain(mouseY, 0, innerHeight),
      px: previous.x,
      py: previous.y,
      a:a,
      r: r,
      g: g,
      b: b,
	  size: size
    };
    previous  = createVector(mouseX, constrain(mouseY, 0, innerHeight));
    socket.emit('mouse', data);
  } else {
    fill(255,0,0, a);
    stroke(255,0,100, a);
      drawHeart(mouseX, constrain(mouseY, 0, innerHeight));
      var data = {
        x: mouseX,
        y: constrain(mouseY, 0, innerHeight)
      };
      socket.emit('heart', data);
  }


}

function calcPos(vx, vy, t, hsize) {
  vx = 16 * pow( sin(t), 3);
  vy = -(13*cos(t) - 5 * cos(2*t) -2*cos(3*t) - cos(4*t));
  p0 = createVector(vx, vy);
  p0.mult(hsize);
}

function mouseDragged() {
  if (!heart) {
    console.log('Sending: ' + mouseX + ',' + constrain(mouseY, 0, innerHeight))
    fill(r, g, b, a);
    if (!previous.x == 0 && !previous.y == 0) {
      stroke(r, g, b, a);
      strokeWeight(size);
      line(mouseX, constrain(mouseY, 0, innerHeight), previous.x, previous.y);
    } else if (previous.x == 0 && previous.y == 0) {
      noStroke();
      ellipse(mouseX, constrain(mouseY, 0, innerHeight), size, size);
    }
    var data = {
      x: mouseX,
      y: constrain(mouseY, 0, innerHeight),
      px: previous.x,
      py: previous.y,
      a: a,
      r: r,
      g: g,
      b: b,
	  size: size
    };
    previous  = createVector(mouseX, constrain(mouseY, 0, innerHeight));


    socket.emit('mouse', data);
  }

}

function GetClientData() {
  socket.emit('requestClients');
}

function mouseClicked() {
  if(mouseX > (width / 2) - (textWidth('RESET') / 2) && mouseX < (width / 2) + (textWidth('RESET') / 2) && mouseY < 50 && IsHost) {
    background(51);
    socket.emit('reset');
    console.log('reset');
  }
}

function draw() {
  a = aslider.value();
  r = rslider.value();
  g = gslider.value();
  b = bslider.value();
  size = sizeslider.value();
  fill(51);
  noStroke();
  rect(0, 0, 100, 20);
  fill(255);
  GetClientData();
  text(NumOfClients, 20, 20);
  if (IsHost) {
    fill(255);
    textSize(32)
    text('RESET', (width / 2) - (textWidth('RESET') / 2), 40);
  }
}
