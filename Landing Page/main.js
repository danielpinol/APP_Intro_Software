
// FONDO DE PARTICULAS (efecto 2D y estrellas que se mueven lento)
// ----------------------------------------------------
const canvas = document.getElementById('grid_canvas');
const ctx    = canvas.getContext('2d');

// El canvas tiene que ocupar toda la pantalla
function ajustar_canvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('ajustar', ajustar_canvas);
ajustar_canvas();

// Cuantas particulas salen en el fondo
const CANTIDAD_PARTICULAS = 500;

// Crea una particula en una posicion aleatoria
// centro = true: spawnea cerca del centro (cuando reaparece)
function crear_particula(centro) {
  const angle = Math.random() * Math.PI * 2;
  const dist  = centro ? Math.random() * 0.1 : Math.random();
  return {
    x:     0.5 + Math.cos(angle) * dist * 0.5,
    y:     0.5 + Math.sin(angle) * dist * 0.5,
    z:     Math.random(),   // profundidad (1 = lejos, 0 = cerca)
    speed: 0.00008 + Math.random() * 0.0001,
  };
}

const particulas = Array.from({ length: CANTIDAD_PARTICULAS }, () => crear_particula(false));

function dibujarParticulas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const W  = canvas.width;
  const H  = canvas.height;
  const cx = W / 2;  // centro x
  const cy = H / 2;  // centro y

  for (const p of particulas) {
    p.z -= p.speed;  // la particula se acerca (z baja)

    // Si llego muy cerca, renace desde el centro
    if (p.z <= 0) {
      Object.assign(p, crear_particula(true));
      p.z = 1;
    }

    // Proyeccion: entre mas cerca (z bajo), mas grande y mas al borde
    const scale = 1 / p.z;
    const sx    = (p.x - 0.5) * scale * W + cx;
    const sy    = (p.y - 0.5) * scale * H + cy;

    // Si se salio de la pantalla, renace
    if (sx < 0 || sx > W || sy < 0 || sy > H) {
      Object.assign(p, crear_particula(true));
      p.z = 1;
      continue;
    }

    const size  = Math.max(0.3, (1 - p.z) * 2.2);
    const alpha = (1 - p.z) * 0.55;

    // Dibuja la linea de movimiento (estela)
    const pz2 = p.z + p.speed * 45;
    const sc2 = 1 / pz2;
    const tx  = (p.x - 0.5) * sc2 * W + cx;
    const ty  = (p.y - 0.5) * sc2 * H + cy;

    ctx.strokeStyle = `rgba(0,212,255,${alpha * 0.4})`;
    ctx.lineWidth   = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Dibuja el punto de la particula
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(dibujarParticulas);
}

dibujarParticulas();


// TRANSICION DE TEXTO (APARECE DE ABAJO HACIA ARRIBA)
// ----------------------------------------------------
const revealEls = document.querySelectorAll('.aparecer');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('listo');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Detecta la slide que esta visible y activa el dot que corresponde (DOTS)
const slides = document.querySelectorAll('[data-s]');
const pips   = document.querySelectorAll('.dot');

const slideObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = parseInt(e.target.dataset.s);
      pips.forEach((p, i) => p.classList.toggle('activo', i === idx));
    }
  });
}, { threshold: 0.5 });

slides.forEach(s => slideObserver.observe(s));


// VISUAL QUE ESCRIBE SOLO. CURSOR TITILANDO
// ----------------------------------------------------
const tagline   = 'Tu auto limpio mientras estudias.';
const twEl      = document.getElementById('escribe_solo');
const glyphPool = '01!?@#$%&<>{}[]|\\/=+-*^~_░▒▓';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrambleChar(prefix, realChar) {
  // Escribe 3 caracteres random antes de escribir la letra real
  for (let k = 0; k < 3; k++) {
    twEl.textContent = prefix + glyphPool[Math.floor(Math.random() * glyphPool.length)];
    await sleep(32);
  }
  twEl.textContent = prefix + realChar;
}

async function startTypewriterLoop() {
  await sleep(400);

  while (true) {
    // Escribe hacia adelante
    for (let i = 0; i < tagline.length; i++) {
      await scrambleChar(tagline.slice(0, i), tagline[i]);
      await sleep(45 + Math.random() * 30);
    }

    // Espera 5 segundos
    await sleep(5000);

    // Borra hacia atras
    for (let i = tagline.length; i >= 0; i--) {
      twEl.textContent = tagline.slice(0, i);
      await sleep(25 + Math.random() * 15);
    }

    // Pausa antes de volver a escribir
    await sleep(600);
  }
}

startTypewriterLoop();

// CURSOR PERSONALIZADO
// ----------------------------------------------------
const cursor = document.getElementById('cursor');
let curX = 0, curY = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// El cursor sigue al mouse con un pequeño retraso (0.14 = velocidad de seguimiento)
function animarCursor() {
  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animarCursor);
}
animarCursor();

// Se expande cuando el mouse esta sobre elementos clickeables
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expandido'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expandido'));
});

// Se agranda al hacer clic
document.addEventListener('mousedown', () => cursor.classList.add('clic'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clic'));


// Indicador SCROLL
const scrollIndicator = document.querySelector('.indicador_scroll');

window.addEventListener('scroll', () => {
  scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
});




// ANIMACION DE CONTADORES (sube el numero desde 0 hasta el valor real)
// ----------------------------------------------------
function animarContador(el) {
  const objetivo = parseInt(el.dataset.target);
  const duracion = 1200;
  const inicio   = performance.now();

  function paso(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    el.textContent = Math.floor(progreso * objetivo);
    if (progreso < 1) requestAnimationFrame(paso);
    else el.textContent = objetivo;
  }

  requestAnimationFrame(paso);
}

const observador_contadores = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animarContador(e.target);
      observador_contadores.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.contador_stat').forEach(el => observador_contadores.observe(el));
