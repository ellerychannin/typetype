// import 'ball.js';

// Serial
let serial;          // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbserial-2110';  // fill in your serial port name here


// UI
let cnv;
const cnvW = 1720; //1000;
const cnvH = 950; //600;
const inputW = 500;
const inputH = 38;
const buttonW = 100;
const inputX = (cnvW - inputW - buttonW)/2 - 50;
const inputY = cnvH - 50 - inputH/2;
const buttonX = inputX + inputW;
const buttonY = inputY;
const buttonH = 40;
let inp;
let button;

// messages
let numMessages = 0;
var sentence = "";
let messages = [];

// emotional detection
var afinn;
var averageScore = 0;
var averageScoreSent = 0;
var col;
var textColor;

// typing sound
var isTyping = false;
let mic, recorder, soundFile;
let soundFiles = [];

// typing speed
let startFrameCount = 0;
let lastFrameCount = 0;
let averageSpeed = 0;
let typingCount = 0;
let speedRecorded;

// matter js setup
var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var box1;
var ground;
var world;
var engine;
var render;

// walls
const thickness = 100;
const ceilX = cnvW/2;
const ceilY = -thickness-1;
let wallW = cnvW;
let wallH = thickness*2;
const leftX = -thickness-1;
const leftY = cnvH/2;
const rightX = cnvW + thickness+1;
const rightY = cnvH/2;
const groundX = cnvW/2;
const groundY = cnvH + thickness + 1;


function preload() {
  afinn = loadJSON('afinn111.json');
  windsorReg = loadFont('assets/WindsorProBold.TTF');
 
}

function setup() {
  
  // Serial
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  // serial.on('list', printList);  // callback to list all the ports
  serial.on('connected', serverConnected); // callback for connecting to server
  serial.on('open', portOpen);        // callback to check port opening
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  // console.log(afinn);
  cnv = createCanvas(cnvW, cnvH);
  cnv.id('theCanvas');
  // create engine and renderer
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = -1;
  world.gravity.scale = 0.0005;
  Runner.run(engine);

  var ceiling = Bodies.rectangle(ceilX, ceilY, wallW, wallH, { isStatic: true, label: "-1"});
  
  var leftWall = Bodies.rectangle(leftX, leftY, wallH, wallW, { isStatic: true, label: "-2"});
  
  var rightWall = Bodies.rectangle(rightX, rightY, wallH, wallW, { isStatic: true, label: "-3"});
  
  var ground = Bodies.rectangle(groundX, groundY, wallW, wallH, { isStatic: true, label: "-4"});
  World.add(world, [ceiling, leftWall, rightWall, ground]);

  // when collided, message disappears
//   Matter.Events.on(engine, 'collisionStart', function(event) {
//     const pairs = event.pairs[0];
//     const bodyA = pairs.bodyA;
//     const bodyB = pairs.bodyB;
//     const idxA = parseInt(bodyA.label);
//     const idxB = parseInt(bodyB.label);
//     if (idxA >= 0) {
//       messages[idxA].textTransparency = 255;
//     }

//     if (idxB >= 0) {
//       messages[idxB].textTransparency = 255;
//     }
//   });
  
    // after collision, text appears again
//   Matter.Events.on(engine, 'collisionEnd', function(event) {
//     const pairs = event.pairs[0];
//     const bodyA = pairs.bodyA;
//     const bodyB = pairs.bodyB;
//     const idxA = parseInt(bodyA.label);
//     const idxB = parseInt(bodyB.label);

//     if (idxA >= 0) {
//       messages[idxA].textTransparency = 0;
//     }

//     if (idxB >= 0) {
//       messages[idxB].textTransparency = 0;
//     }
//   });
  textFont(windsorReg);
  inp = createInput('').attribute('placeholder', '  How is your day?');
  inp.position(inputX, inputY);
  inp.size(inputW,inputH);
  inp.style("font-family", "windsorPro");
  // inp.style("font-weight", "bold");
  inp.style("font-size", "20px");
  // inp.style("color", "#FF0000")
  // inp.style("borderColor", "Black");
  inp.input(inputMessage);

  
  button = createButton('SEND');
  button.position(buttonX, buttonY);
  // button.mousePressed(sendMessage);
  button.size(buttonW, buttonH);
  button.style("font-family", "windsorPro");
  // button.style("font-weight", "bold");
  button.style("font-size", "20px");
  button.style("color", "#535353");
  button.style("outline", "none");
  // button.style("borderColor", "Black");
  // button.style("backgroundColor", "White");
  button.mousePressed(addMessage);
  
  
  // sound
  // create an audio in
  mic = new p5.AudioIn();
  // mic.getSources(gotSources);
  mic.start();
  // create a sound recorder
  recorder = new p5.SoundRecorder();
  // connect the mic to the recorder
  recorder.setInput(mic);
  userStartAudio();
}

function serverConnected() {
  console.log('connected to server.');
}
 
function portOpen() {
  console.log('the serial port opened.')
}
 
function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  console.log('The serial port closed.');
}

function draw() {
  background("#E0E4E9");
  // box1.show();
  messages.forEach(m => {
    m.show();
  });  
  push();
  fill(170);
  rectMode(CENTER);
  rect(ceilX, ceilY, wallW, wallH);
  rect(leftX, leftY, wallH, wallW);
  rect(rightX, rightY, wallH, wallW);
  pop();
  
  if (averageSpeed >= 1) {
    averageSpeed = 1;
  } 
  
  if (isNaN(averageScore)) {
    averageScoreSent = 0;
  } else {
    averageScoreSent = int(averageScore);
  }
  let speedtosend = int(map(averageSpeed, 0, 0.2, 0, 21));
  let speedtosend_constrained = int(constrain(speedtosend, 0, 21));
  // console.log(averageScoreSent);
  serial.write(averageScoreSent + ',');
  // console.log('here is speed sent');
  // console.log(speedtosend_constrained);
  serial.write(speedtosend_constrained + ',');
  // serial.write(randomColor[2] + ',');
  serial.write('\n');
  
//   push();
//   fill("#D9D9D9");
//   text("How's your day?", inputX, inputY + inputH/2);
//   pop();
}

function mousePressed() {
  // messages.forEach(m => {
  //   if (m.hover()) {
  //     m.sound.play();
  //   }
  // });  

}

function keyPressed() {
  if (keyCode === RETURN) {
    addMessage();
  }
}
function inputMessage() {
  if (!isTyping && mic.enabled) {
    isTyping = true;
    // console.log(isTyping);
    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile();
    recorder.record(soundFile, 0, saveSoundFile);
  }
  
  sentence = this.value();
  var words = sentence.split(/\W/);
  var filteredWords = words.filter(function(w) {
    return w;
  });
  var score = 0;
  var afinnCount = 0;
  for (var i=0; i<filteredWords.length;i++) {
    var word = filteredWords[i].toLowerCase();
    if (afinn.hasOwnProperty(word)) {
      score += Number(afinn[word]);
      afinnCount += 1
      }
  }
  averageScore = score/afinnCount;
  if (isNaN(averageScore)) {
    averageScoreSent = 0;
  }
  if (typingCount == 0) {
    startFrameCount = frameCount;
    typingCount += 1;
  } else if (typingCount == 1) {
    let speed = 2/(frameCount - startFrameCount);
    averageSpeed += speed;
    averageSpeed = averageSpeed/2;
    // console.log(averageSpeed);
    typingCount = 0;
  }
  
}

function addMessage(){
  // console.log("final speed:");
  if (averageSpeed >= 1) {
    averageSpeed = 1;
  } 
  speedRecorded = map(int(averageSpeed*100), 0, 100, 0, 50);
  // speedRecorded = constrain(speedRecorded, 0, 50);
  // console.log(int(averageSpeed*100));
  averageSpeed = 0;
  typingCount = 0;
  if (isTyping && mic.enabled) {
      isTyping = false;
      // console.log(isTyping);
      recorder.stop(); // stop recorder, and send the result to soundFile
      
  }
  // console.log(averageScore);
  switch(averageScore) {
    case 5:
      col = "#FF5C5C";
      textColor = "#FFFFFF";
      break;
    case 4:
      col = "#FB7979";
      textColor = "#FFFFFF";
      break;
    case 3:
      col = "#F79595";
      textColor = "#FF5C5C";
      break;
    case 2:
      col = "#F4B2B2";
      textColor = "#FF5C5C";
      break;
    case 1:
      col = "#EFCECE";
      textColor = "#FF5C5C";
      break;
    case 0:
      col = "#E3D0FF";
      textColor = "#FFFFFF";
      break;
    case -1:
      col = "#C5DBEE";
      textColor = "#2E9BFF";
      break;
    case -2:
      col = "#9FCBF2";
      textColor = "#2E9BFF";
      break;
    case -3:
      col = "#7ABBF7";
      textColor = "#FFFFFF";
      break;
    case -4:
      col = "#54ABFB";
      textColor = "#FFFFFF";
      break;
    case -5:
      col = "#2E9BFF";
      textColor = "#FFFFFF";
      break;
    default:
      col = "#E3D0FF";
      textColor = "#FFFFFF";
  }
  inp.value('');
  averageScore = 0;
}
  

function saveSoundFile() {
  // console.log('saved');
  soundFiles.push(soundFile);
  // soundFile.play(); // play the result!
  
  // console.log("amp here");
  
  // console.log(getAvg(soundFile.getPeaks(5)));
  amp = getAvg(soundFile.getPeaks(5));
  if (amp*1000 >= 20) {
    amp = 0.02;
  } else if (amp < 0) {
    amp = -amp;
  }
  // saveSound(soundFile, 'typing-' + str(numBalls)+'.wav'); // save file
  messages.push(new Message(
    inputX + inputW/2,
    buttonY,
    numMessages,
    sentence,
    col,
    textColor,
    speedRecorded,
    0.005
  ));
  numMessages += 1;
}

function getAvg(amplitudes) {
  const total = amplitudes.reduce((acc, c) => acc + c);
  return total / amplitudes.length;
}
