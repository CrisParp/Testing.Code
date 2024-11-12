const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const stars = [];
const maxStars = 500;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

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

function updateStars() {
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;
        
        if (star.x < 0 || star.x > canvasWidth || star.y < 0 || star.y > canvasHeight) {
            stars.splice(i, 1);
            createStar();
        }
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    updateStars();
    drawStars();
    requestAnimationFrame(animate);
}

for (let i = 0; i < maxStars; i++) {
    createStar();
}

animate();

window.addEventListener('resize', () => {
    canvas.width = canvasWidth = window.innerWidth;
    canvas.height = canvasHeight = window.innerHeight;
});
