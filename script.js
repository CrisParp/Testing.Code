const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const stars = [];
const maxStars = 500;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let mouseX = -1000; // Initial position off-canvas to avoid interference
let mouseY = -1000;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Generate stars
function createStar() {
    const star = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        radius: Math.random() * 1 + 0.5
    };
    stars.push(star);
    return star;
}

// Update star positions
function updateStars() {
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;
        
        // Re-create star if it moves out of bounds
        if (star.x < 0 || star.x > canvasWidth || star.y < 0 || star.y > canvasHeight) {
            stars.splice(i, 1);
            createStar();
        }
    }
}

// Draw stars and lines to nearby stars
function drawStars() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#fff'; // Set fill color to white for stars

    for (const star of stars) {
        // Distance from cursor to star
        const dx = star.x - mouseX;
        const dy = star.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Strobe effect: increase star radius if close to cursor
        let currentRadius = star.radius;
        if (distance < 100) {
            currentRadius += 2; // Make nearby stars appear bigger
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`; // Fade with distance
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(star.x, star.y);
            ctx.stroke();
        }

        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animation loop
function animate() {
    updateStars();
    drawStars();
    requestAnimationFrame(animate);
}

// Initialize stars
for (let i = 0; i < maxStars; i++) {
    createStar();
}

animate();

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Adjust canvas size on resize
window.addEventListener('resize', () => {
    canvas.width = canvasWidth = window.innerWidth;
    canvas.height = canvasHeight = window.innerHeight;
});
