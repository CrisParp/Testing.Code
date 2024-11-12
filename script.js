const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const xpOrbs = [];
const maxOrbs = 500;
let mouseX = -1000; // Initial position off-canvas to avoid interference
let mouseY = -1000;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Generate XP orbs
function createOrb() {
    const orb = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        radius: Math.random() * 1.5 + 1,
        originalRadius: 1.5 // Base radius for pulsing effect
    };
    xpOrbs.push(orb);
    return orb;
}

// Update orbs' positions and sizes for pulse effect
function updateOrbs() {
    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        const orb = xpOrbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Pulse effect
        orb.radius = orb.originalRadius + Math.sin(Date.now() * 0.003) * 0.5;

        // Re-create orb if it moves out of bounds
        if (orb.x < 0 || orb.x > canvas.width || orb.y < 0 || orb.y > canvas.height) {
            xpOrbs.splice(i, 1);
            createOrb();
        }
    }
}

// Draw XP orbs with glow effect and interaction
function drawOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const orb of xpOrbs) {
        // Distance from cursor to orb
        const dx = orb.x - mouseX;
        const dy = orb.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close to cursor, make it slightly bigger
        let currentRadius = orb.radius;
        if (distance < 100) {
            currentRadius += 2;
            ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance / 100})`; // Faded line
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(orb.x, orb.y);
            ctx.stroke();
        }

        // Draw orb with green glow effect
        ctx.fillStyle = `rgba(0, 255, 0, 0.8)`; // Green XP color
        ctx.shadowColor = "rgba(0, 255, 0, 0.5)"; // Green shadow for glow effect
        ctx.shadowBlur = 10; // Amount of glow

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animation loop
function animate() {
    updateOrbs();
    drawOrbs();
    requestAnimationFrame(animate);
}

// Initialize XP orbs
for (let i = 0; i < maxOrbs; i++) {
    createOrb();
}

animate();

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Adjust canvas size on resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
