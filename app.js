// function Dynamic() {
//   var Kurss = document.getElementById("Kurss").value;
//   document.getElementById("DlugoscSzerokosc").innerHTML =
//     "Kurs " +
//     Kurss +
//     "<br>" +
//     document.getElementById("DlugoscSzerokosc").innerHTML;
// }

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

//    function Bearr(){
//	var Bearing = 190;
//	let BearingText = Bearing.toString();
//	let Dlugosc = BearingText.length;
//	if(Dlugosc == 1) {BearingText = "00" + BearingText;}
//	if(Dlugosc == 2) {BearingText = "0" + BearingText;}
//
//	document.getElementById("DlugoscSzerokosc").innerHTML += BearingText;
//	}

function Sound() {
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
let No = 1;
function Start() {
  document.querySelector(".button").classList.add("clicked");
  var Interwal = document.getElementById("Interwal").value * 60000;
  var Licznik = Interwal;
  
  

  function petla() {
    if (Licznik >= Interwal) {
      navigator.geolocation.getCurrentPosition(function (location) {
        var lat = location.coords.latitude;
        var lon = location.coords.longitude;

        let latOld = Number(document.getElementById("latOld2").textContent);
        let lonOld = Number(document.getElementById("lonOld2").textContent);

        var Interwal = document.getElementById("Interwal").value * 60000;

        var theta = lon - lonOld;
        var Dystans =
          60 *
          (180 / Math.PI) *
          Math.acos(
            Math.sin(lat * (Math.PI / 180)) *
              Math.sin(latOld * (Math.PI / 180)) +
              Math.cos(lat * (Math.PI / 180)) *
                Math.cos(latOld * (Math.PI / 180)) *
                Math.cos(theta * (Math.PI / 180))
          );

        var Predkosc = ((Dystans * 3600144) / Interwal).toFixed(2);

        document.getElementById("DlugoscSzerokosc").innerHTML =
          `${No} - ${Predkosc} kn<br>` +
          document.getElementById("DlugoscSzerokosc").innerHTML;

        document.getElementById("latOld2").innerHTML = lat;
        document.getElementById("lonOld2").innerHTML = lon;
        No++;

        // Sound();
      });
      Licznik = 0;
    }
    Licznik += 100;
  }
  setInterval(petla, 100);
}
