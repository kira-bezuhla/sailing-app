//start
const btnStart = document.getElementById("button-start"); //button
const interval = document.getElementById("interval"); //input
//devices h1
const stopwatch = document.getElementById("stopwatch"); //stopwatch
const speedometer = document.getElementById("speedometer"); //speedometer

const list = document.getElementById("list"); //list for interval values

let isClicked = false;

btnStart.onclick = function () {
  let timer;
  if (!isClicked) {
    //Start
    isClicked = true;
    document.querySelector(".button").classList.remove("unclicked");
    document.querySelector(".button").classList.add("clicked");

    //let intervalValue = interval.value * 60000;

    startStopwatch(); //Stopwatch start
  } else {
    //Stop
    isClicked = false;
    document.querySelector(".button").classList.remove("clicked");
    document.querySelector(".button").classList.add("unclicked");

    stopStopwatch(); //Stopwatch stop

    console.log(isClicked);
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
    }else{
        time=min;
    }
    if (sec < 10) {
        time += ":0" + sec;
      }else{
        time+=':'+sec;
      }
    stopwatch.textContent = time;
  }, 1000);
}
function stopStopwatch() {
  clearInterval(timer);
  console.log(timer, typeof timer);
}
