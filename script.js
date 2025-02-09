const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = {
  x: null,
  y: null,
  radius: 50,
};

// Создание формы сердца
ctx.font = "bold 40px Verdana";
ctx.fillText("❤️", 50, 50);
const textCoordinates = ctx.getImageData(0, 0, 500, 500);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }

  draw() {
    ctx.fillStyle = "red"; // Цвет частиц
    ctx.shadowColor = "red"; // Цвет тени
    ctx.shadowBlur = 10; // Размытие тени (увеличь, если нужно сильнее)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = (dx / distance) * force * this.density;
    let directionY = (dy / distance) * force * this.density;

    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
    this.draw();
  }
}

function init() {
  particlesArray = [];
  for (let y = 0; y < textCoordinates.height; y++) {
    for (let x = 0; x < textCoordinates.width; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x * 10;
        let positionY = y * 10;
        particlesArray.push(new Particle(positionX, positionY));
      }
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Полупрозрачный белый для эффекта шлейфа
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Постепенное очищение
  particlesArray.forEach((particle) => particle.update());
  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

init();
animate();
