const elapsedLabel = document.getElementById("elapsed-label");
const durationInput = document.getElementById("duration-input");
const button = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

durationInput.oninput = event => {
  const inputValue = event.target.value.replace(/\D/g, "");
  if (parseInt(inputValue) === 0) {
    event.target.value = "";
  } else if (parseInt(inputValue) > 3599) {
    event.target.value = 3599;
  }
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
    this.tick = this.tick.bind(this);
  }

  setDuration(durationInSecs) {
    if (!this.ticking) this.duration = durationInSecs * 1000;
  }

  tick() {
    this.elapsed += Date.now() - this.lastTickTime;
    this.lastTickTime = Date.now();
    updateArc(this.elapsed / this.duration);
    if (this.elapsed >= this.duration) {
      this.stop();
      setElapsed(this.duration);
      button.innerHTML = "Start";
      new Notification("Time is up", {
        body: `${Math.round(this.duration / 1000)} seconds has passed`
      });
    } else {
      setElapsed(this.elapsed);
    }
  }

  start() {
    this.ticking = true;
    if (this.elapsed >= this.duration) this.elapsed = 0;
    this.lastTickTime = Date.now();
    this.timeoutId = setInterval(this.tick, 1000);
  }

  stop() {
    this.ticking = false;
    clearInterval(this.timeoutId);
    durationInput.disabled = false;
  }
}
const timer = new Timer();

button.onclick = () => {
  if (timer.ticking) {
    timer.stop();
    button.innerHTML = "Continue";
  } else {
    timer.setDuration(durationInput.value);
    timer.start();
    durationInput.disabled = true;
    button.innerHTML = "Stop";
  }
};

resetButton.onclick = () => {
  if (timer.ticking) timer.stop();
  timer.elapsed = 0;
  button.innerHTML = "Start";
  elapsedLabel.innerHTML = "00 : 00";
  updateArc();
};

function polarToCartesian(centerX, centerY, radius, angleDegrees) {
  const angleRadians = ((angleDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians)
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const startCoords = `${start.x} ${start.y}`;
  const ellipse = `${radius} ${radius}`;
  const rotation = 0;
  const arc = endAngle - startAngle <= 180 ? "0" : "1";
  const sweep = 0;
  const endCoords = `${end.x} ${end.y}`;
  const d = `M ${startCoords} A ${ellipse} ${rotation} ${arc} ${sweep} ${endCoords}`;
  return d;
}

function updateArc(ratio) {
  const arcElement = document.getElementById("arc");
  if (!ratio) {
    arcElement.removeAttribute("d");
    return;
  }
  ratio = ratio === 0 ? 0.01 : ratio;
  const hue = 100 - ratio * 100;
  arcElement.setAttribute("stroke", `hsl(${hue}, 100%, 50%)`);

  let degree = ratio * 360;
  degree = degree >= 360 ? 359.99 : degree;
  const arc = describeArc(10, 10, 8, 0, degree);
  arcElement.setAttribute("d", arc);
}
