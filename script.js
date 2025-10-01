/*
  Interactive love card for Polina 💖
  Keeps logic modular and readable. No external dependencies.
*/

(() => {
  const dom = {
    modal: document.getElementById('modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    btnTheme: document.getElementById('btn-theme'),
    btnCompliment: document.getElementById('btn-compliment'),
    btnSurprise: document.getElementById('btn-surprise'),
    btnLetter: document.getElementById('btn-letter'),
    btnQuiz: document.getElementById('btn-quiz'),
    btnDodge: document.getElementById('btn-dodge'),
    btnHearts: document.getElementById('btn-hearts'),
    btnConfetti: document.getElementById('btn-confetti'),
    fxCanvas: document.getElementById('fx-canvas'),
  };

  const storage = {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const utils = {
    rnd(min, max) { return Math.random() * (max - min) + min; },
    pick(list) { return list[Math.floor(Math.random() * list.length)]; },
    clamp(n, a, b) { return Math.max(a, Math.min(b, n)); },
    create(tag, cls) { const el = document.createElement(tag); if (cls) el.className = cls; return el; },
  };

  // Theming
  const theme = {
    init() {
      const saved = storage.get('theme') || 'light';
      if (saved === 'dark') document.documentElement.classList.add('theme-dark');
    },
    toggle() {
      document.documentElement.classList.toggle('theme-dark');
      const isDark = document.documentElement.classList.contains('theme-dark');
      storage.set('theme', isDark ? 'dark' : 'light');
    }
  };

  // Modal helpers
  const modal = {
    open(title, contentNode) {
      dom.modalTitle.textContent = title;
      dom.modalContent.innerHTML = '';
      dom.modalContent.appendChild(contentNode);
      dom.modalBackdrop.classList.remove('hidden');
      dom.modal.showModal();
    },
    close() {
      dom.modal.close();
      dom.modalBackdrop.classList.add('hidden');
    },
    text(title, html) {
      const box = utils.create('div');
      box.innerHTML = html;
      modal.open(title, box);
    }
  };

  // Confetti engine (tiny)
  const confetti = (() => {
    const canvas = dom.fxCanvas;
    const ctx = canvas.getContext('2d');
    const colors = ['#ff8fab','#ffc6ff','#b8c0ff','#caffbf','#ffd6a5','#fdffb6'];
    let rafId = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function burst(x, y, count = 140) {
      resize();
      const pieces = Array.from({ length: count }, () => ({
        x, y,
        vx: utils.rnd(-6, 6),
        vy: utils.rnd(-10, -4),
        size: utils.rnd(4, 10),
        rot: utils.rnd(0, Math.PI * 2),
        vr: utils.rnd(-0.2, 0.2),
        color: utils.pick(colors),
        life: utils.rnd(60, 110)
      }));

      cancelAnimationFrame(rafId);
      let frame = 0;
      const gravity = 0.22;
      const drag = 0.995;

      function tick() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of pieces) {
          p.vx *= drag;
          p.vy = p.vy * drag + gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life -= 1;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.restore();
        }
        if (frame < 180) rafId = requestAnimationFrame(tick); else ctx.clearRect(0,0,canvas.width,canvas.height);
      }
      tick();
    }

    window.addEventListener('resize', resize);
    resize();

    return { burst };
  })();

  // Background floating hearts
  const bgHearts = {
    start() {
      const spawn = () => {
        const heart = utils.create('div', 'bg-heart');
        const size = utils.rnd(8, 18);
        heart.style.left = `${utils.rnd(-5, 100)}vw`;
        heart.style.bottom = `-20px`;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.animationDuration = `${utils.rnd(7, 15)}s`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 16000);
        setTimeout(spawn, utils.rnd(700, 1600));
      };
      spawn();
    }
  };

  // Features
  function complimentsFeature() {
    const compliments = [
      'Ты — мой лучший случайный подарок вселенной',
      'Твоя улыбка делает день светлее',
      'С тобой даже молчание — уютное',
      'Ты вдохновляешь меня становиться лучше',
      'Твои глаза — самое красивое небо',
      'Ты — мелодия моего дня',
      'С тобой мир точно на месте',
      'Ты делаешь обычные моменты волшебными'
    ];
    dom.btnCompliment.addEventListener('click', () => {
      const text = utils.pick(compliments);
      modal.text('Комплиментик для тебя', `<p style="font-size:20px;line-height:1.5">${text} 💖</p>`);
      confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.25, 90);
    });
  }

  function surpriseFeature() {
    dom.btnSurprise.addEventListener('click', (e) => {
      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || window.innerHeight / 2;
      confetti.burst(x, y, 160);
      setTimeout(() => {
        modal.text('Сюрприз!', '<p>Иногда счастье — это всего лишь один клик. Спасибо, что ты есть. ♥</p>');
      }, 160);
    });
  }

  

  function letterFeature() {
    dom.btnLetter.addEventListener('click', () => {
      const text = `
        Дорогая Полина,
        
        иногда самые тёплые слова — самые простые: спасибо, что ты есть. 
        Ты делаешь мир вокруг светлее и уютнее. Рядом с тобой я чувствую дом.
        
        Береги себя. А я — буду беречь тебя. ♥
      `;
      const box = utils.create('div');
      const p = utils.create('pre');
      p.style.whiteSpace = 'pre-wrap';
      p.style.font = '16px/1.6 Rubik, system-ui';
      p.style.margin = '8px 0 0';
      box.appendChild(p);
      modal.open('Письмо', box);
      typewriter(p, text.trim());
    });
  }

  function typewriter(node, text) {
    node.textContent = '';
    let i = 0;
    const tick = () => {
      node.textContent += text[i];
      i += 1;
      if (i < text.length) setTimeout(tick, Math.random() < 0.15 ? 60 : 22);
    };
    tick();
  }

  function quizFeature() {
    dom.btnQuiz.addEventListener('click', () => {
      const wrap = utils.create('div');
      const q = utils.create('p');
      q.textContent = 'Вопрос на засыпку: насколько сильно ты меня любишь?';
      wrap.appendChild(q);
      const answers = [
        'Очень-очень',
        'Эммммм?',
        'Бесконечно',
        'Сильнее конфетти',
        'Просто капец как'
      ];
      const list = utils.create('div');
      list.style.display = 'grid';
      list.style.gap = '10px';
      for (const a of answers) {
        const b = utils.create('button', 'btn');
        b.textContent = a;
        b.addEventListener('click', () => {
          confetti.burst(window.innerWidth * Math.random(), window.innerHeight * 0.35, 120);
          modal.text('Правильный ответ', '<p>И это тоже правильный ответ! Люблю тебя ♥</p>');
        });
        list.appendChild(b);
      }
      wrap.appendChild(list);
      modal.open('Мини-опрос', wrap);
    });
  }

  function dodgeFeature() {
    let attempts = 0;
    const maxTricks = 6;
    const btn = dom.btnDodge;
    btn.addEventListener('mouseenter', () => {
      if (attempts < maxTricks) {
        attempts += 1;
        const dx = utils.rnd(-120, 120);
        const dy = utils.rnd(-80, 80);
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      } else {
        btn.style.transform = 'none';
      }
    });
    btn.addEventListener('click', () => {
      modal.text('Поймала!', '<p>Ты всё равно поймала меня! Вот за это и люблю тебя 😊</p>');
      confetti.burst(window.innerWidth * 0.55, window.innerHeight * 0.3, 120);
      attempts = 0;
    });
  }

  function heartClicksFeature() {
    let clicks = 0;
    dom.btnHearts.addEventListener('click', (e) => {
      clicks += 1;
      spawnHeart(e.clientX, e.clientY);
      if (clicks === 10 || clicks === 20 || clicks === 30) {
        confetti.burst(e.clientX, e.clientY, 100 + clicks);
      }
      if (clicks >= 20 && clicks % 20 === 0) {
        modal.text('Ура!', `<p>Ты нащёлкала уже ${clicks} сердечек! Продолжим? ♥</p>`);
      }
    });

    function spawnHeart(x, y) {
      const h = utils.create('div');
      h.style.position = 'fixed';
      h.style.left = `${x}px`;
      h.style.top = `${y}px`;
      const size = utils.rnd(12, 26);
      h.style.width = `${size}px`;
      h.style.height = `${size}px`;
      h.style.transform = 'rotate(45deg)';
      h.style.borderRadius = '3px';
      h.style.background = 'radial-gradient(circle at 30% 30%, #ff8fab 0, #ff4d6d 60%, #ff0a54 100%)';
      h.style.pointerEvents = 'none';
      h.style.zIndex = 7;
      const b1 = utils.create('div');
      const b2 = utils.create('div');
      for (const b of [b1, b2]) {
        b.style.position = 'absolute';
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.top = `-${size/2}px`;
        b.style.left = `0px`;
        b.style.borderRadius = '50%';
        b.style.background = 'inherit';
      }
      b2.style.left = `-${size/2}px`;
      h.appendChild(b1); h.appendChild(b2);
      document.body.appendChild(h);

      const dx = utils.rnd(-80, 80);
      const dy = utils.rnd(-160, -80);
      const dur = utils.rnd(600, 1100);
      const start = performance.now();
      const startX = x, startY = y;
      const anim = (t) => {
        const p = utils.clamp((t - start) / dur, 0, 1);
        const ease = p < 0.5 ? 2*p*p : -1 + (4 - 2*p) * p;
        h.style.left = `${startX + dx * ease}px`;
        h.style.top = `${startY + dy * ease}px`;
        h.style.opacity = String(1 - p);
        h.style.transform = `rotate(45deg) scale(${1 + p*0.6})`;
        if (p < 1) requestAnimationFrame(anim); else h.remove();
      };
      requestAnimationFrame(anim);
    }
  }

  function confettiButtonFeature() {
    dom.btnConfetti.addEventListener('click', (e) => {
      confetti.burst(e.clientX, e.clientY, 200);
    });
  }

  function heroPhotoFeature() {
    const photo = document.getElementById('hero-photo');
    if (!photo) return;
    // Tilt on pointer move
    let rect = photo.getBoundingClientRect();
    const updateRect = () => { rect = photo.getBoundingClientRect(); };
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });
    photo.addEventListener('mousemove', (e) => {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = (-y * 8).toFixed(2);
      const rotY = (x * 8).toFixed(2);
      photo.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = '';
    });
    // Confetti on click
    photo.addEventListener('click', (e) => {
      confetti.burst(e.clientX, e.clientY, 160);
    });
  }

  function bindCloseModal() {
    dom.modal.addEventListener('close', () => dom.modalBackdrop.classList.add('hidden'));
    dom.modalBackdrop.addEventListener('click', () => modal.close());
  }

  function init() {
    theme.init();
    dom.btnTheme.addEventListener('click', theme.toggle);
    complimentsFeature();
    surpriseFeature();
    letterFeature();
    quizFeature();
    dodgeFeature();
    heartClicksFeature();
    confettiButtonFeature();
    heroPhotoFeature();
    bindCloseModal();
    bgHearts.start();
  }

  document.addEventListener('DOMContentLoaded', init);
})();


