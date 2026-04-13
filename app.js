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
    if (solarSwarm) {
        for (let i = 0; i < 70; i++) {
            const panel = document.createElement('div');
            panel.className = 'swarm-dot';
            const top = 5 + Math.random() * 90;
            const left = 5 + Math.random() * 90;
            // keep some distance from center hub
            if (top > 40 && top < 60 && left > 40 && left < 60) continue;
            panel.style.top = `${top}%`;
            panel.style.left = `${left}%`;
            panel.style.animationDelay = `${Math.random() * 2}s`;
            solarSwarm.appendChild(panel);
        }
    }

    function updateScene(index) {
        scenes[currentScene].classList.remove('active');
        scenes[currentScene].style.display = 'none';
        dots[currentScene].classList.remove('active');

        currentScene = index;

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
