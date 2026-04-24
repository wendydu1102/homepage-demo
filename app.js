const scenesData = [
    { title: "System Reliability & Resource Adequacy", desc: "Offshore wind alone cannot guarantee reliability in the Southern Grid. The \"2060 Gap\" shows a 30% probability of power shortfalls during drought years due to transmission bottlenecks." },
    { title: "Ratcheting Up Policy Targets", desc: "Current targets are insufficient. Scaling 2030 targets to 2,200 GW and shifting focus to a 56% generation share is required, accompanied by massive transmission investments." },
    { title: "The Temporal Bottleneck", desc: "Deployment pressure peaks between 2050-2060. Without Carbon Capture mitigating coal phase-outs, required deployment jumps 33% and shifts a full decade earlier." },
    { title: "Geographic Constraints", desc: "To avoid transmission losses, solar must be built within 100km of load centers. Eastern provinces will exhaust >80% of suitable land, making distributed (rooftop) solar essential." }
];

document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.viz-dot');
    const scenes = document.querySelectorAll('.viz-scene');
    const titleEl = document.getElementById('caption-title');
    const descEl = document.getElementById('caption-desc');
    const progressFill = document.getElementById('progress-fill');

    let currentScene = 0;
    const sceneCount = scenesData.length;
    const intervalTime = 6000;
    let startTime;
    let animationFrame;

    // Generate solar swarm for Scene 4
    const solarSwarm = document.getElementById('solar-swarm');
    let particles = [];
    let physicsActive = false;
    
    if (solarSwarm) {
        const CHINA_PATH_DATA = "M 235.1 250.6 L 230.1 253.5 L 225.3 251.6 L 225.1 246.6 L 228.0 243.9 L 234.4 242.3 L 237.8 242.4 L 239.1 244.7 L 236.5 247.2 L 235.1 250.6 Z Z M 336.8 68.2 L 347.0 70.1 L 353.9 74.3 L 356.3 79.8 L 365.2 79.8 L 370.3 77.5 L 380.0 75.8 L 376.9 81.1 L 374.6 83.2 L 372.6 89.6 L 368.7 95.3 L 361.6 94.3 L 356.5 96.4 L 358.1 101.4 L 357.2 108.3 L 354.2 108.5 L 354.3 111.5 L 350.5 108.0 L 348.1 111.3 L 339.1 113.8 L 340.0 116.9 L 334.9 116.7 L 332.1 114.9 L 328.1 119.0 L 321.6 122.2 L 316.9 125.9 L 308.7 127.6 L 304.3 130.4 L 298.0 132.0 L 301.1 129.3 L 299.9 127.0 L 304.6 123.0 L 301.5 120.0 L 296.3 122.0 L 289.7 126.1 L 286.1 129.9 L 280.3 130.2 L 277.3 132.9 L 280.4 136.9 L 285.2 137.9 L 285.4 140.5 L 290.1 142.2 L 296.7 138.0 L 301.9 140.3 L 305.7 140.5 L 306.6 143.5 L 298.3 145.2 L 295.6 148.3 L 289.9 151.3 L 286.8 155.4 L 293.2 158.6 L 295.5 164.4 L 299.0 169.8 L 303.0 174.3 L 302.9 178.6 L 299.2 180.2 L 300.6 183.4 L 304.1 185.2 L 303.2 190.0 L 301.7 194.6 L 298.4 195.1 L 294.1 201.5 L 289.4 209.2 L 283.9 216.2 L 275.9 221.6 L 267.7 226.5 L 261.1 227.2 L 257.5 229.8 L 255.5 227.9 L 252.2 230.8 L 244.0 233.8 L 237.8 234.7 L 235.8 240.9 L 232.5 241.2 L 231.0 237.0 L 232.4 234.7 L 224.5 232.8 L 221.7 233.8 L 215.8 232.2 L 213.0 229.9 L 213.9 226.5 L 208.6 225.4 L 205.7 223.2 L 200.7 226.3 L 195.0 227.0 L 190.4 227.0 L 187.2 228.4 L 184.2 229.3 L 185.1 236.0 L 181.9 235.8 L 181.4 234.4 L 181.2 232.0 L 176.9 233.7 L 174.4 232.7 L 170.0 230.4 L 171.7 225.6 L 168.0 224.4 L 166.6 219.0 L 160.4 220.0 L 161.1 213.0 L 166.7 208.1 L 166.9 203.3 L 166.7 198.8 L 164.2 197.4 L 162.2 194.0 L 158.8 194.4 L 152.5 193.5 L 154.4 191.1 L 151.7 187.4 L 147.5 189.9 L 142.6 188.4 L 135.8 192.2 L 130.5 196.5 L 125.7 197.3 L 123.2 195.7 L 120.1 195.6 L 115.9 194.2 L 112.7 195.7 L 108.8 200.0 L 108.3 195.4 L 104.8 196.7 L 97.9 196.1 L 91.3 194.7 L 86.5 192.2 L 82.0 191.0 L 80.0 188.2 L 76.7 187.3 L 70.8 183.5 L 66.1 181.7 L 63.6 183.1 L 55.5 179.0 L 49.7 175.3 L 48.1 168.8 L 52.3 169.6 L 52.5 166.6 L 50.1 163.6 L 50.7 158.8 L 44.4 152.0 L 34.8 149.6 L 33.0 145.1 L 28.7 142.3 L 27.7 140.7 L 26.8 137.3 L 27.0 135.0 L 23.4 133.7 L 21.5 134.3 L 20.0 128.9 L 21.7 127.5 L 20.9 126.1 L 26.5 123.4 L 30.5 122.2 L 36.7 123.0 L 38.9 119.3 L 46.5 118.6 L 48.6 116.2 L 57.8 113.1 L 58.6 111.7 L 58.2 108.4 L 62.2 106.9 L 56.9 96.7 L 68.5 94.3 L 71.5 93.0 L 75.8 82.5 L 87.4 84.4 L 90.7 81.8 L 91.0 75.9 L 95.8 75.4 L 100.3 71.4 L 102.6 71.0 L 104.1 75.1 L 109.1 78.2 L 117.4 80.4 L 121.5 85.1 L 119.2 92.0 L 121.3 94.5 L 128.3 95.5 L 136.2 96.3 L 143.3 100.0 L 146.9 100.6 L 149.6 106.0 L 153.0 109.5 L 159.5 109.4 L 171.6 110.7 L 179.4 109.9 L 185.2 110.8 L 193.9 114.3 L 201.0 114.3 L 203.6 116.1 L 210.4 113.0 L 219.9 111.0 L 228.7 110.7 L 235.6 108.7 L 239.8 105.5 L 243.9 103.6 L 242.9 101.6 L 241.1 99.4 L 244.1 95.6 L 247.4 96.1 L 253.5 97.3 L 259.3 94.2 L 268.3 91.9 L 272.6 88.0 L 276.7 86.4 L 285.2 85.6 L 289.9 86.2 L 290.5 84.2 L 285.2 80.1 L 280.5 78.2 L 276.0 80.4 L 270.2 79.4 L 266.8 80.2 L 265.3 77.8 L 269.5 71.9 L 272.3 67.5 L 279.4 69.7 L 287.7 66.0 L 287.6 63.4 L 292.9 57.2 L 296.2 55.3 L 296.1 52.1 L 292.9 50.7 L 297.7 47.8 L 305.0 46.7 L 312.8 46.5 L 321.6 48.3 L 326.7 50.5 L 330.3 56.4 L 332.5 58.9 L 334.6 62.5 L 336.8 68.2 Z Z";
        const dummyCanvas = document.createElement('canvas');
        const ctx = dummyCanvas.getContext('2d');
        const mapPath = new Path2D(CHINA_PATH_DATA);
        const mapWidth = 400;
        const mapHeight = 300;

        let spawnCount = 0;
        while (spawnCount < 70) {
            let x = Math.random() * mapWidth;
            let y = Math.random() * mapHeight;
            
            // Check if inside map, and outside the hub
            const cx = mapWidth / 2;
            const cy = mapHeight / 2;
            const distToCenter = Math.hypot(x - cx, y - cy);
            
            if (ctx.isPointInPath(mapPath, x, y) && distToCenter > 30) {
                const panel = document.createElement('div');
                panel.className = 'swarm-dot';
                panel.style.left = `${(x / mapWidth) * 100}%`;
                panel.style.top = `${(y / mapHeight) * 100}%`;
                panel.style.animationDelay = `${Math.random() * 2}s`;
                solarSwarm.appendChild(panel);
                
                particles.push({
                    el: panel,
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8
                });
                spawnCount++;
            }
        }

        let lastTime = performance.now();
        function updatePhysics(time) {
            const dt = Math.min((time - lastTime) / 16, 2);
            lastTime = time;

            if (physicsActive) {
                particles.forEach(p => {
                    let nextX = p.x + p.vx * dt;
                    let nextY = p.y + p.vy * dt;
                    
                    // Collision with China outline
                    if (!ctx.isPointInPath(mapPath, nextX, nextY)) {
                        const inX = ctx.isPointInPath(mapPath, nextX, p.y);
                        const inY = ctx.isPointInPath(mapPath, p.x, nextY);
                        
                        if (!inX && !inY) { p.vx *= -1; p.vy *= -1; }
                        else if (!inX) { p.vx *= -1; }
                        else if (!inY) { p.vy *= -1; }
                        else { p.vx *= -1; p.vy *= -1; }
                        
                        nextX = p.x + p.vx * dt;
                        nextY = p.y + p.vy * dt;
                        
                        // Failsafe
                        if (!ctx.isPointInPath(mapPath, nextX, nextY)) {
                            const cx = mapWidth / 2;
                            const cy = mapHeight / 2;
                            const d = Math.hypot(cx - p.x, cy - p.y);
                            if (d > 0) {
                                p.vx = ((cx - p.x) / d) * 0.8;
                                p.vy = ((cy - p.y) / d) * 0.8;
                            }
                            nextX = p.x + p.vx * dt;
                            nextY = p.y + p.vy * dt;
                        }
                    }
                    
                    // Radial constraint from central hub (repel)
                    const cx = mapWidth / 2;
                    const cy = mapHeight / 2;
                    const distToCenter = Math.hypot(nextX - cx, nextY - cy);
                    
                    if (distToCenter < 40) {
                        const pushX = (nextX - cx) / distToCenter;
                        const pushY = (nextY - cy) / distToCenter;
                        p.vx += pushX * 0.1;
                        p.vy += pushY * 0.1;
                    }
                    
                    // Speed limit
                    const speed = Math.hypot(p.vx, p.vy);
                    if (speed > 1.2) {
                        p.vx = (p.vx / speed) * 1.2;
                        p.vy = (p.vy / speed) * 1.2;
                    }
                    
                    p.x = nextX;
                    p.y = nextY;
                    p.el.style.left = `${(p.x / mapWidth) * 100}%`;
                    p.el.style.top = `${(p.y / mapHeight) * 100}%`;
                });
            }
            requestAnimationFrame(updatePhysics);
        }
        requestAnimationFrame(updatePhysics);
    }

    function updateScene(index) {
        scenes[currentScene].classList.remove('active');
        scenes[currentScene].style.display = 'none';
        dots[currentScene].classList.remove('active');

        currentScene = index;
        physicsActive = (currentScene === 3);

        scenes[currentScene].style.display = 'flex';
        // Small delay to ensure CSS animation reset trigger
        setTimeout(() => {
            scenes[currentScene].classList.add('active');
        }, 10);

        dots[currentScene].classList.add('active');
        titleEl.textContent = scenesData[currentScene].title;
        descEl.textContent = scenesData[currentScene].desc;

        resetTimer();
    }

    function animateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min((elapsed / intervalTime) * 100, 100);

        progressFill.style.width = `${progress}%`;

        if (elapsed < intervalTime) {
            animationFrame = requestAnimationFrame(animateProgress);
        } else {
            const nextIndex = (currentScene + 1) % sceneCount;
            updateScene(nextIndex);
        }
    }

    function resetTimer() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        startTime = null;
        progressFill.style.width = '0%';
        animationFrame = requestAnimationFrame(animateProgress);
    }

    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentScene !== index) updateScene(index);
        });
    });

    // Init
    scenes.forEach((scene, i) => {
        if (i !== 0) scene.style.display = 'none';
        else scene.classList.add('active');
    });
    titleEl.textContent = scenesData[0].title;
    descEl.textContent = scenesData[0].desc;

    resetTimer();
});