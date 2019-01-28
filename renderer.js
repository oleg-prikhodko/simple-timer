const elapsedLabel = document.getElementById("elapsed-label");
const durationInput = document.getElementById("duration-input");
durationInput.oninput = event => {
  event.target.value = event.target.value.replace(/\D/g, "");
};

function setElaplsed(elapsedMillis) {
  elapsedLabel.innerHTML = Math.round(elapsedMillis / 1000);
}

class Timer {
  constructor(durationInSecs = 10) {
    this.duration = durationInSecs * 1000;
    this.elapsed = 0;
    this.ticking = false;
  }

  setDuration(durationInSecs) {
    if (!this.ticking) this.duration = durationInSecs * 1000;
  }

  start() {
    this.ticking = true;
    this.elapsed = 0;
    this.startTime = Date.now();
    const timeoutId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      setElaplsed(this.elapsed);
      if (this.elapsed >= this.duration) {
        this.ticking = false;
        clearInterval(timeoutId);
        durationInput.disabled = false;
      }
    }, 1000);
  }
}
const timer = new Timer();

const button = document.getElementById("start-button");
button.onclick = () => {
  timer.setDuration(durationInput.value);
  timer.start();
  durationInput.disabled = true;
};
