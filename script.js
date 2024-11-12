const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const xpOrbs = [];
const maxOrbs = 500;
let mouseX = -1000; // Initial position off-canvas to avoid interference
let mouseY = -1000;

// Color options for the orbs
const colors = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ffffff'];
let currentColorIndex = 0; // Start with the first color (red)

// Set canvas dimensions
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
    ctx.shadowBlur = 10; // Glow effect

    for (const orb of xpOrbs) {
        // Distance from cursor to orb
        const dx = orb.x - mouseX;
        const dy = orb.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Increase size if close to cursor
        let currentRadius = orb.radius;
        if (distance < 100) {
            currentRadius += 2;
            ctx.strokeStyle = `rgba(${hexToRgb(colors[currentColorIndex], 1 - distance / 100)})`;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(orb.x, orb.y);
            ctx.stroke();
        }

        // Draw orb with current color and glow
        ctx.fillStyle = colors[currentColorIndex];
        ctx.shadowColor = colors[currentColorIndex];
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Function to convert hex color to rgba
function hexToRgb(hex, alpha = 1) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

// Color switch button event listener
document.getElementById('colorSwitch').addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length; // Cycle to next color
});

// Adjust canvas size on resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
