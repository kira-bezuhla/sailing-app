//start
const btnStart = document.getElementById("button-start"); //button
const interval = document.getElementById("interval"); //input
//devices h1
const stopwatch = document.getElementById("stopwatch"); //stopwatch
const speedometer = document.getElementById("speedometer"); //speedometer

const list = document.getElementById("list"); //list for interval values

let timer; //for stopwatch
let listInterval,
  counter = 0; //for interval speed

let counter2 = 0;
let isClicked = false; //for button

//for calculating distance
let pos1 = { lat: 0.0, lon: 0.0 };
let pos2 = { lat: 0.0, lon: 0.0 };

btnStart.onclick = () => {
  if (!isClicked) {
    //Start
    isClicked = true;
    document.querySelector(".button").classList.remove("unclicked");
    document.querySelector(".button").classList.add("clicked");

    startStopwatch(); //Stopwatch start
    //debugger
    startIntervalSpeedList();
  } else {
    //Stop
    isClicked = false;
    document.querySelector(".button").classList.remove("clicked");
    document.querySelector(".button").classList.add("unclicked");

    stopStopwatch(); //Stopwatch stop
    stopIntervalSpeedList();
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
function calculateDistance(pos1, pos2) {
  const earthRadius = 3440.07; // Средний радиус Земли для морских миль

  // Преобразование градусов в радианы
  const φ1 = toRadians(pos1.lat);
  const φ2 = toRadians(pos2.lat);
  const Δφ = toRadians(pos2.lat - pos1.lat);
  const Δλ = toRadians(pos2.lon - pos1.lon);

  // Вычисление формулы гаверсинусов
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Вычисление расстояния
  const distance = earthRadius * c;
  return distance;
}
function addInterwalInfo(time = "время", speed = "скорость") {
  let str = time + "   ---   " + speed + " kt";
  //list.innerHTML = `<li>${str}</li>`;
  list.insertAdjacentHTML("afterbegin", `<li>${str}</li>`);
}
function loop() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      pos2.lat = position.coords.latitude;
      pos2.lon = position.coords.longitude;

      let dist = calculateDistance(pos1, pos2);
      let time = interval.value / 60;
      let speed = (dist / time).toFixed(2);

      if (counter > 0) {
        addInterwalInfo(stopwatch.textContent, speed);
      } else {
        addInterwalInfo(undefined, undefined);
      }

      pos1.lat = pos2.lat;
      pos1.lon = pos2.lon;

      counter++;

      sound();
    },
    () => {
      console.log("i broke");
    }
  );
}
function startIntervalSpeedList() {
  listInterval = setInterval(loop, interval.value * 60 * 1000);
}
function stopIntervalSpeedList() {
  clearInterval(listInterval);
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
