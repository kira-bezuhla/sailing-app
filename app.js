//start
const btnStart = document.getElementById("button-start"); //start button
const interval = document.getElementById("interval"); //user input
//devices h1
const stopwatch = document.getElementById("stopwatch"); //stopwatch
const speedometer = document.getElementById("speedometer"); //speedometer

const list = document.getElementById("list"); //list to display interval values

let timer; //for stopwatch timer
let intervalLoop = null,
  counter = 0; //for interval speed
let speedWatch = null; //for speedometer
let currentPosition = null; //to get position

let isClicked = false; //for button

let audioContext = new (window.AudioContext || window.webkitAudioContext)(); //for sound()

//for calculating distance
let pos1 = { lat: 0.0, lon: 0.0 };
let pos2 = { lat: 0.0, lon: 0.0 };

btnStart.onclick = () => {
  if (!isClicked) {
    //Start
    isClicked = true;
    document.querySelector(".button").classList.remove("unclicked");
    document.querySelector(".button").classList.add("clicked");
    list.innerHTML = "";

    startStopwatch(); //Stopwatch start

    startSpeedometer();
    startIntervalLoop();

    positionTimer = setInterval(
      () => updatePositions(currentPosition),
      interval.value * 60 * 1000
    );
  } else {
    //Stop
    isClicked = false;
    document.querySelector(".button").classList.remove("clicked");
    document.querySelector(".button").classList.add("unclicked");

    stopStopwatch(); //Stopwatch stop
    stopIntervalLoop();
    stopSpeedometer();
    clearInterval(positionTimer);
  }
};

function startStopwatch() {
  let sec = 0;
  let min = 0;
  let time = "";
  timer = setInterval(() => {
    sec++;
    if (sec === 60) {
      sec = 0;
      min++;
    }
    if (min < 10) {
      time = "0" + min;
    } else {
      time = min;
    }
    if (sec < 10) {
      time += ":0" + sec;
    } else {
      time += ":" + sec;
    }
    stopwatch.textContent = time;
  }, 1000);
}
function stopStopwatch() {
  clearInterval(timer);
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
function calculateDistance() {
  const earthRadius = 3440.07; // Average radius of the Earth for nautical miles

  // Convert degrees to radians
  const φ1 = toRadians(pos1.lat);
  const φ2 = toRadians(pos2.lat);
  const Δφ = toRadians(pos2.lat - pos1.lat);
  const Δλ = toRadians(pos2.lon - pos1.lon);

  // Compute haversine formula
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Compute distance
  const distance = earthRadius * c;
  return distance;
}
function addIntervalInfo(time = "time", speed = "speed") {
  let str = time + "   ---   " + speed + " kt";
  list.insertAdjacentHTML("afterbegin", `<li>${str}</li>`);
}
function startIntervalLoop() {
  intervalLoop = setInterval(
    calculateSpeedInterval,
    interval.value * 60 * 1000
  );
}
function stopIntervalLoop() {
  clearInterval(intervalLoop);
}
function sound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = 100;

  const now = audioContext.currentTime;

  gainNode.gain.setValueAtTime(20, now);
  gainNode.gain.exponentialRampToValueAtTime(0.11, now + 1);

  oscillator.start(now);
  oscillator.stop(now + 1);
}
function calculateSpeedInterval() {
  let dist = calculateDistance();
  let time = interval.value / 60;
  let speed = (dist / time).toFixed(2);

  if (counter > 1) {
    addIntervalInfo(stopwatch.textContent, speed);
  } else {
    addIntervalInfo(undefined, undefined);
  }

  console.log("speed interval");
  console.log(counter);
  console.log(pos1, pos2);
  counter++;

  sound();
}
function startSpeedometer() {
  speedWatch = navigator.geolocation.watchPosition(
    (position) => {
      currentPosition = position;
      console.log(position, currentPosition);

      speedometer.textContent =
        (position.coords.speed / 0.5144).toFixed(2).toString() + " kt";
    },
    () => {
      alert("Разрешите приложению пользоваться геоданными, чтобы это работало");
    }
  );
}
function stopSpeedometer() {
  navigator.geolocation.clearWatch(speedWatch);
}
function updatePositions(position) {
  if (position && position.coords) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    if (latitude !== null && longitude !== null) {
      pos1.lat = pos2.lat;
      pos1.lon = pos2.lon;

      pos2.lat = latitude;
      pos2.lon = longitude;
    } else {
      console.log("latitude and longitude = null");
    }
  } else {
    console.log("didn`t achieve position");
  }
}
