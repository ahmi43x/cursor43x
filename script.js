const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize the canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store particles
const particles = [];
const maxParticles = 500;

// Track the mouse position and velocity
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let mouseVelocityX = 0;
let mouseVelocityY = 0;
let lastMouseX = mouseX;
let lastMouseY = mouseY;

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    const newMouseX = event.clientX;
    const newMouseY = event.clientY;
    
    mouseVelocityX = newMouseX - lastMouseX;
    mouseVelocityY = newMouseY - lastMouseY;

    lastMouseX = newMouseX;
    lastMouseY = newMouseY;

    mouseX = newMouseX;
    mouseY = newMouseY;
});

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 5; // Size range
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 80%)`; // Light and playful colors
        this.alpha = 1; // Opacity
        this.initialSize = this.size;
        this.sizeChangeRate = Math.random() * 0.1 + 0.05; // Size change rate
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += Math.sin(Date.now() * this.sizeChangeRate) * 2; // Pulsating effect
        this.alpha -= 0.02; // Fade out
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Background animation
function drawBackground() {
    const time = Date.now() * 0.0005;
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
    gradient.addColorStop(0, `rgba(10, 10, 20, 1)`); // Dark center
    gradient.addColorStop(1, `rgba(0, 0, 0, 1)`); // Black outer edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adding some cosmic stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
            if (Math.random() > 0.98) { // Sparse stars
                ctx.beginPath();
                ctx.arc(i + Math.random() * 20, j + Math.random() * 20, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Animation function
function animate() {
    // Clear the canvas
    drawBackground();

    // Create particles at mouse position
    for (let i = 0; i < Math.max(1, Math.abs(mouseVelocityX) * 0.3); i++) {
        particles.push(new Particle(mouseX, mouseY));
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Remove particles that are too small or faded out
        if (particles[i].size <= 0.5 || particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }

    // Draw a glowing cosmic effect at the cursor position
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Create a glowing effect
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 50 + Math.abs(mouseVelocityX) * 0.5, 0, Math.PI * 2);
    ctx.shadowColor = 'cyan';
    ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.fill();
    ctx.restore();

    // Request the next frame
    window.requestAnimationFrame(animate);
}

// Start the animation
window.requestAnimationFrame(animate);
