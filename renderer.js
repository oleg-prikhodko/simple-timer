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
      updateArc(this.elapsed / this.duration);
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
    button.innerHTML = "Start";
  } else {
    timer.setDuration(durationInput.value);
    timer.start();
    durationInput.disabled = true;
    button.innerHTML = "Stop";
  }
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
  ratio = ratio === 0 ? 0.01 : ratio;
  const hue = 100 - ratio * 100;
  arcElement.setAttribute("stroke", `hsl(${hue}, 100%, 50%)`);

  let degree = ratio * 360;
  degree = degree >= 360 ? 359.99 : degree;
  const arc = describeArc(10, 10, 8, 0, degree);
  arcElement.setAttribute("d", arc);
}
