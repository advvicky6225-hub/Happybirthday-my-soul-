document.addEventListener('DOMContentLoaded', () => {
    // Generate Stars background
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        star.style.width = star.style.height = Math.random() * 3 + 'px';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        star.style.animationDelay = (Math.random() * 2) + 's';
        starsContainer.appendChild(star);
    }

    // Generate Floating Hearts
    const heartsContainer = document.getElementById('hearts-container');
    function createHeart() {
        let heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.transform = `scale(${Math.random() * 0.5 + 0.5}) rotate(-45deg)`;
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }
    setInterval(createHeart, 800);

    // Elements
    const loginSection = document.getElementById('login-section');
    const surpriseSection = document.getElementById('surprise-section');
    const passInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');
    const bgMusic = document.getElementById('bg-music');
    
    // Modals
    const giftBox = document.getElementById('gift-box');
    const giftModal = document.getElementById('gift-modal');
    const closeGift = document.getElementById('close-gift');
    const letterBtn = document.getElementById('read-letter-btn');
    const letterModal = document.getElementById('letter-modal');
    const closeLetter = document.getElementById('close-letter');

    // 🔐 Check if already logged in (sessionStorage)
    if (sessionStorage.getItem('loggedIn') === 'true') {
        // நேரடியாக surprise பகுதியைக் காட்டு
        loginSection.classList.remove('active');
        loginSection.classList.add('hidden');
        surpriseSection.classList.remove('hidden');
        surpriseSection.classList.add('active');
        
        // Music play attempt
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
        
        initFireworks();
        startCountdown();
    }

    // Login logic
    unlockBtn.addEventListener('click', () => {
        if (passInput.value === 'VS1625') {
            // ✅ Login success - store flag
            sessionStorage.setItem('loggedIn', 'true');

            loginSection.classList.remove('active');
            loginSection.classList.add('hidden');
            setTimeout(() => {
                surpriseSection.classList.remove('hidden');
                surpriseSection.classList.add('active');
                
                bgMusic.volume = 0.5;
                bgMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
                
                initFireworks();
                startCountdown();
            }, 1000);
        } else {
            errorMsg.classList.remove('hidden');
            errorMsg.style.animation = 'none';
            void errorMsg.offsetWidth;
            errorMsg.style.animation = 'shake 0.5s ease-in-out';
        }
    });

    // Gift modal logic
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');
        setTimeout(() => {
            giftModal.classList.remove('hidden');
        }, 800);
    });

    closeGift.addEventListener('click', () => {
        giftModal.classList.add('hidden');
        const video = document.getElementById('surprise-video');
        if (video) video.pause();
    });

    // Letter modal logic
    letterBtn.addEventListener('click', () => {
        letterModal.classList.remove('hidden');
    });

    closeLetter.addEventListener('click', () => {
        letterModal.classList.add('hidden');
    });

    // Countdown Logic
    function startCountdown() {
        const timerEl = document.getElementById('countdown');
        // 🔁 இங்கே உங்கள் நண்பரின் உண்மையான பிறந்தநாள் தேதியை அமைக்கவும்
        const targetDate = new Date('March 16, 2026 00:00:00');  // example

        function update() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                timerEl.innerHTML = "<div>00<span>Days</span></div><div>00<span>Hours</span></div><div>00<span>Mins</span></div><div>00<span>Secs</span></div>";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 1000 / 60) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            timerEl.innerHTML = `
                <div>${days.toString().padStart(2, '0')}<span>Days</span></div>
                <div>${hours.toString().padStart(2, '0')}<span>Hours</span></div>
                <div>${mins.toString().padStart(2, '0')}<span>Mins</span></div>
                <div>${secs.toString().padStart(2, '0')}<span>Secs</span></div>
            `;
        }
        update();
        setInterval(update, 1000);
    }

    // Canvas Fireworks Setup
    function initFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        
        function rnd(min, max) { return Math.random() * (max - min) + min; }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                let angle = rnd(0, Math.PI * 2);
                let speed = rnd(1, 5);
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = rnd(30, 80);
                this.size = rnd(1, 3);
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.05;
                this.life--;
                this.size *= 0.95;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function createFirework() {
            let x = rnd(100, canvas.width - 100);
            let y = rnd(100, canvas.height / 2);
            let colors = ['#ff4d85', '#a855f7', '#ffd700', '#00e5ff'];
            let color = colors[Math.floor(Math.random() * colors.length)];
            
            for(let i = 0; i < 50; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        setInterval(createFirework, 1500);

        function animate() {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for(let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if(particles[i].life <= 0) {
                    particles.splice(i, 1);
                }
            }
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Simple Slideshow
    const slideImg = document.getElementById('slide-img');
    const images = ['assets/images/photo1.jpg', 'assets/images/photo2.jpg', 'assets/images/photo3.jpg','assets/images/photo4.jpg','assets/images/photo5.jpg','assets/images/photo6.jpg']; // உங்கள் படங்கள்
    let currentSlide = 0;
    setInterval(() => {
        if(slideImg && !giftModal.classList.contains('hidden')) {
            slideImg.style.opacity = 0;
            setTimeout(() => {
                currentSlide = (currentSlide + 1) % images.length;
                slideImg.src = images[currentSlide];
                slideImg.style.opacity = 1;
            }, 500);
        }
    }, 3000);
});