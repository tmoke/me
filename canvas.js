// Shared particle network background animation
(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let nodes = [];
    const numberOfNodes = 55;
    const maxDistance = 150;
    const mouse = { x: null, y: null, radius: 200 };

    class Node {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1;
            // Increased speed: was 0.5, now 1.1
            this.vx = (Math.random() - 0.5) * 1.1;
            this.vy = (Math.random() - 0.5) * 1.1;
            // ensure non-zero velocity
            if (Math.abs(this.vx) < 0.2) this.vx = 0.2 * Math.sign(this.vx || 1);
            if (Math.abs(this.vy) < 0.2) this.vy = 0.2 * Math.sign(this.vy || 1);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 224, 0.65)';
            ctx.fill();
        }
        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.vx = -this.vx;
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.vy = -this.vy;
            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function init() {
        nodes = [];
        for (let i = 0; i < numberOfNodes; i++) nodes.push(new Node());
    }

    function connectNodes() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,240,224,${1 - dist / maxDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
            if (mouse.x !== null && mouse.y !== null) {
                const dx = nodes[i].x - mouse.x;
                const dy = nodes[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,240,224,${0.6 - dist / mouse.radius})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const node of nodes) node.update();
        connectNodes();
    }

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', () => { resizeCanvas(); init(); });

    init();
    animate();
})();
