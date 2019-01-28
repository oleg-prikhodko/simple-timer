const elapsedLabel = document.getElementById("elapsed-label");
const durationInput = document.getElementById("duration-input");
durationInput.oninput = event => {
  event.target.value = event.target.value.replace(/\D/g, "");
};

function setElapsed(elapsedMillis) {
  const elapsedSeconds = Math.round(elapsedMillis / 1000);
  let minutes = Math.floor(elapsedSeconds / 60);
  let seconds = elapsedSeconds % 60;
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  elapsedLabel.innerHTML = `${minutes} : ${seconds}`;
}

class Timer {
  constructor(durationInSecs = 10) {
    this.duration = durationInSecs * 1000;
    this.elapsed = 0;
    this.ticking = false;
    this.stop = this.stop.bind(this);
  }

  setDuration(durationInSecs) {
    if (!this.ticking) this.duration = durationInSecs * 1000;
  }

  start() {
    this.ticking = true;
    this.elapsed = 0;
    this.startTime = Date.now();
    this.timeoutId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      if (this.elapsed >= this.duration) {
        this.stop();
        setElapsed(this.duration);
      } else {
        setElapsed(this.elapsed);
      }
    }, 1000);
  }

  stop() {
    this.ticking = false;
    clearInterval(this.timeoutId);
    durationInput.disabled = false;
  }
}
const timer = new Timer();

const button = document.getElementById("start-button");
button.onclick = () => {
  if (timer.ticking) {
    timer.stop();
    button.innerHTML = "Start"
  } else {
    timer.setDuration(durationInput.value);
    timer.start();
    durationInput.disabled = true;
    button.innerHTML = "Stop"
  }
};
