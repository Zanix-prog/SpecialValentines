// --- CONFIG ---
const QUESTIONS = [
    {
        q: "Who show more tantrums?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        // User requested: "it should be you are my little angry bird"
        rightRoast: "Correct! Iam the little angry bird 🐦💕",
        wrongRoast: "Incorrect! Iam the little angry bird 🐦😤"
    },
    {
        q: "Who apologizes first?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        // User requested: "i am your sorry king"
        rightRoast: "Yes! I am your sorry king 👑",
        wrongRoast: "Wrong! I am your sorry king 👑"
    },
    {
        q: "Who is more dramatic?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        rightRoast: "Dramakingggg its me Chimpanzee 🎭💕",
        wrongRoast: "Dramakingggg its me Talib 🎭💕"
    },
    {
        q: "Who loves more?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        rightRoast: "You know I love u moree cuz iam bigger 💖",
        wrongRoast: "No! You know I love u moree cuz you are small 💖"
    },
    {
        q: "Who is the boss?",
        options: ["Talib", "Shifa"],
        correct: "Shifa",
        // User: "yes you are the boss😎💪"
        rightRoast: "Yes! you are the boss 😎💪",
        wrongRoast: "Wrong! I am not the boss 😎💪"
    },
    {
        q: "Who initiates the flirt?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        rightRoast: "It's me I can't resist Flirting with u 💕",
        wrongRoast: "You know it! It's me I can't resist Flirting with u 💕"
    },
    {
        q: "Who is the sleepy head?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        rightRoast: "Yes! Iam Sleepy Head! 😴💕",
        wrongRoast: "Doraemon! 😴 It's definitely me!"
    },
    {
        q: "Who is the Tutor?",
        options: ["Talib", "Shifa"],
        correct: "Talib",
        rightRoast: "Yes, Its me 😏💕",
        wrongRoast: "Nopw its me 😏💕"
    }
];

// --- STATE ---
let currentQuestionIndex = 0;
let noCount = 0;
let currentImageIndex = 0;
let zIndexCounter = 100;

// Physics State
const images = []; // Array to store image objects { element, x, y, vx, vy, width, height, isDragging }
const BOUNCE_FACTOR = 0.8;
const REPULSION_RADIUS = 200; // Increased radius for better separation
const MAX_SPEED = 1.5; // Slightly slower base speed
const EXCLUSION_ZONE_FORCE = 0.05;

// --- DOM ELEMENTS ---
// Layers
const layerPassword = document.getElementById('layer-password');
const layerProposal = document.getElementById('layer-proposal');
const layerContract = document.getElementById('layer-contract');
const layerQuiz = document.getElementById('layer-quiz');
const layerCountdown = document.getElementById('layer-countdown');
const layerSlideshow = document.getElementById('layer-slideshow');

// Audio
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');

// Password Inputs
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');

// Proposal Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noMsg = document.getElementById('noMsg');
const redFlash = document.getElementById('red-flash');
const scatterContainer = document.getElementById('scatter-container');

// Finale Elements
const layerFinale = document.getElementById('layer-finale');
const finalScore = document.getElementById('final-score'); // Ensure this ID exists in HTML or I will add it dynamically if needed. Wait, the previous HTML had p id="final-score".


// Contract Elements
const startQuizBtn = document.getElementById('startQuizBtn');

// Quiz Elements
const quizContainer = document.getElementById('quiz-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizProgress = document.getElementById('quiz-progress');
const roastMessage = document.getElementById('roast-message');

// Image lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

// Slideshow
const finalSlideshowImg = document.getElementById('final-slideshow-img');
const countdownTimer = document.getElementById('countdown-timer');

// --- FUNCTIONS ---

function showLayer(layer) {
    document.querySelectorAll('.layer').forEach(l => l.classList.add('hidden'));
    layer.classList.remove('hidden');
}

// 1. PASSWORD LOGIC (Single Input Romantic Date Guess)

unlockBtn.addEventListener('click', () => {
    const answer = document.getElementById('pass1').value.trim().toLowerCase();

    // Accepted answers (you can add more variations)
    const validAnswers = [
        "02/09/2025 ",
        "02-09-2025 ",
        "02/09/2025",
        "02/09/2025"
    ];

    if (validAnswers.includes(answer)) {
        startProposal();
    } else {
        errorMsg.classList.remove('hidden');
        shake(unlockBtn);
    }
});

function shake(element) {
    element.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });
}

function startProposal() {
    showLayer(layerProposal);
    // Play Audio 1
    audio1.volume = 0.5;
    audio1.play().catch(e => console.log("Auto-play blocked:", e));
    initPhysicsGallery();
}

// 2. PHYSICS GALLERY LOGIC & GAME LOOP
function initPhysicsGallery() {
    scatterContainer.innerHTML = '';
    images.length = 0;

    const totalImages = 9; // ✅ YOU HAVE ONLY 9 IMAGES
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;

    for (let i = 1; i <= totalImages; i++) {
        const div = document.createElement('div');
        div.className = 'scatter-img';

        // Start from boundary edges
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const imgW = 120;
        const imgH = 140;

        switch (side) {
            case 0:
                x = Math.random() * (containerW - imgW);
                y = -imgH - 20;
                break;
            case 1:
                x = containerW + 20;
                y = Math.random() * (containerH - imgH);
                break;
            case 2:
                x = Math.random() * (containerW - imgW);
                y = containerH + 20;
                break;
            case 3:
                x = -imgW - 20;
                y = Math.random() * (containerH - imgH);
                break;
        }

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        const img = document.createElement('img');
        img.src = `photo${i}.jpg`; // photo1.jpg → photo9.jpg
        img.draggable = false;

        div.appendChild(img);
        scatterContainer.appendChild(div);

        const obj = {
            element: div,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            width: 120,
            height: 140,
            isDragging: false,
            id: i
        };

        if (side === 0 && obj.vy < 0) obj.vy *= -1;
        if (side === 1 && obj.vx > 0) obj.vx *= -1;
        if (side === 2 && obj.vy > 0) obj.vy *= -1;
        if (side === 3 && obj.vx < 0) obj.vx *= -1;

        images.push(obj);

        attachInteraction(div, obj, () => openLightbox(i - 1));
    }

    requestAnimationFrame(animateImages);
}

function animateImages() {
    if (layerProposal.classList.contains('hidden')) return;
    updatePhysics();
    requestAnimationFrame(animateImages);
}

function updatePhysics() {
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;

    for (let i = 0; i < images.length; i++) {
        const obj = images[i];
        if (obj.isDragging) continue;

        obj.x += obj.vx;
        obj.y += obj.vy;

        if (obj.x <= -50) { obj.x = -50; obj.vx *= -1; }
        if (obj.x + obj.width >= containerW + 50) {
            obj.x = containerW + 50 - obj.width;
            obj.vx *= -1;
        }

        if (obj.y <= -50) { obj.y = -50; obj.vy *= -1; }
        if (obj.y + obj.height >= containerH + 50) {
            obj.y = containerH + 50 - obj.height;
            obj.vy *= -1;
        }

        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);

        if (speed > 1.0) {
            obj.vx *= 0.95;
            obj.vy *= 0.95;
        }

        if (speed < 0.2) {
            obj.vx += (Math.random() - 0.5) * 0.1;
            obj.vy += (Math.random() - 0.5) * 0.1;
        }

        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
    }
}

// 2.5 INTERACTION HELPERS


function attachInteraction(element, obj, onClick) {
    let startX = 0, startY = 0;

    // Mouse
    element.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));

    // Touch
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    }, { passive: false });

    function startDrag(x, y) {
        obj.isDragging = true;
        startX = x;
        startY = y;

        zIndexCounter++;
        element.style.zIndex = zIndexCounter;

        // Add move/up listeners
        if (typeof window.ontouchstart !== 'undefined') {
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', endDrag);
        } else {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', endDrag);
        }
    }

    function onMove(e) {
        e.preventDefault(); // Stop scroll
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

        // Calculate delta for tossing effect
        const dx = clientX - startX;
        const dy = clientY - startY;

        // Update velocity based on drag speed
        obj.vx = dx * 0.2; // Damping factor for toss
        obj.vy = dy * 0.2;

        obj.x = clientX - obj.width / 2;
        obj.y = clientY - obj.height / 2;

        // Update DOM immediately for responsiveness
        element.style.left = `${obj.x}px`;
        element.style.top = `${obj.y}px`;

        startX = clientX;
        startY = clientY;
    }

    function endDrag() {
        obj.isDragging = false;

        // Check if it was a click (very low velocity on release)
        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        if (speed < 1) { // Threshold for click
            onClick();
        }

        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', endDrag);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', endDrag);
    }
}


// 3. PROPOSAL LOGIC
yesBtn.addEventListener('click', () => {
    showLayer(layerContract);
});

// Remove static mouseover. We will handle it dynamically.
// noBtn.addEventListener('mouseover', moveNoButton); 

noBtn.addEventListener('click', (e) => {
    // Logic: First 5 clicks show messages.
    // User Update: Do NOT move/disappear for first 5 clicks. Just show message.
    if (noCount < 5) {
        const msgs = [
            "Penalty: 5 kisses 💋",
            "Buttons are slippery! 😈",
            "Wrong choice babe 😝",
            "Try the other one! 🥺",
            "Okay this is funny now 😌"
        ];
        const currentMsg = msgs[noCount];
        noMsg.innerText = currentMsg;

        // Grow Yes button
        const currentScale = 1 + ((noCount + 1) * 0.2);
        yesBtn.style.transform = `scale(${currentScale})`;

        // do NOT move the button. Keep it there so they can click it 5 times easily.
        // moveNoButton(); 

    } else {
        // After 5 times, it gets impossible
        noMsg.innerText = "Okay, you have no choice now! ❤️";
        noBtn.style.display = "none"; // Hide after 5 clicks
        yesBtn.style.transform = `scale(2.5)`;
    }

    noCount++;
    flashRed();

    // We removed the mouseover listener logic, so it won't run away.
});

function moveNoButton() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    // Ensure it doesn't go off screen
    const maxLeft = w - btnW - 50;
    const maxTop = h - btnH - 50;

    const newLeft = Math.max(20, Math.random() * maxLeft);
    const newTop = Math.max(20, Math.random() * maxTop);

    noBtn.style.position = 'fixed';
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
}

function flashRed() {
    redFlash.classList.remove('hidden');
    setTimeout(() => {
        redFlash.classList.add('hidden');
    }, 200);
}

// 4. IMAGE LIGHTBOX
function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = `photo${index + 1}.jpg`;
    lightbox.classList.remove('hidden');
}

closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
    }
});

// 5. CONTRACT & QUIZ LOGIC
startQuizBtn.addEventListener('click', () => {
    showLayer(layerQuiz);
    loadQuestion(0);
});

function loadQuestion(index) {
    if (index >= QUESTIONS.length) {
        finishQuiz();
        return;
    }

    const q = QUESTIONS[index];
    questionText.innerText = `${index + 1}. ${q.q}`;
    quizProgress.innerText = `${index + 1} / ${QUESTIONS.length}`;
    roastMessage.innerText = '';
    roastMessage.className = 'roast-message';

    optionsContainer.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, opt);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(index, selectedAnswer) {
    const q = QUESTIONS[index];
    const isCorrect = selectedAnswer === q.correct;

    // Show roast message
    roastMessage.innerText = isCorrect ? q.rightRoast : q.wrongRoast;
    roastMessage.className = isCorrect ? 'roast-message correct' : 'roast-message wrong';

    // Wait 2 seconds before next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }, 2500);
}

// 6. FINALE, COUNTDOWN & SLIDESHOW
function finishQuiz() {
    if (layerFinale) {
        showLayer(layerFinale);
        startCountdownInFinale();
    } else {
        startFinalSlideshow();
    }
}

function startCountdownInFinale() {
    const finalTimer = document.getElementById('final-timer');
    const heart = document.querySelector('.heart-beat');
    if (!finalTimer) return;

    let seconds = 10;
    finalTimer.innerText = seconds;

    const interval = setInterval(() => {
        seconds--;
        finalTimer.innerText = seconds;

        finalTimer.style.transition = "transform 0.1s ease-out";
        finalTimer.style.transform = "scale(1.3)";

        if (heart) {
            heart.style.transition = "transform 0.1s ease-out";
            heart.style.transform = "scale(1.5)";
            heart.style.animationDuration = (0.4 + (seconds / 15)) + "s";
        }

        playHeartbeat();

        setTimeout(() => {
            finalTimer.style.transform = "scale(1)";
            if (heart) heart.style.transform = "scale(1)";
        }, 150);

        if (seconds <= 0) {
            clearInterval(interval);
            startFinalSlideshow();
        }
    }, 1000);
}

// Synthesized Heartbeat Sound
function playHeartbeat() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    function beat(time, freq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.3);
    }

    const now = ctx.currentTime;
    beat(now, 60);
    beat(now + 0.2, 50);
}

function startFinalSlideshow() {
    showLayer(layerSlideshow);

    // Stop Audio 1
    audio1.pause();

    // Play Audio 2
    audio2.volume = 0.5;
    audio2.play().catch(e => {
        console.log("Audio 2 play error:", e);
    });

    let slideIndex = 1;
    const totalSlides = 9; // ✅ ONLY 9 IMAGES NOW

    startEmojiRain();

    // Initial load
    finalSlideshowImg.src = `photo1.jpg`;

    setInterval(() => {
        slideIndex++;
        if (slideIndex > totalSlides) slideIndex = 1;

        finalSlideshowImg.src = `photo${slideIndex}.jpg`;
    }, 1500);
}


function startEmojiRain() {
    setInterval(() => {
        const e = document.createElement("div");
        e.className = "rain";
        e.innerHTML = ["💖", "🌹", "💋", "❤️", "😍", "💕", "✨", "🎀"][Math.floor(Math.random() * 8)];
        e.style.left = Math.random() * 100 + "vw";
        e.style.animationDuration = (3 + Math.random() * 3) + "s"; // 3-6 seconds
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 6000);
    }, 300);
}
