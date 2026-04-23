
// =====================================================
// FONDO DE PARTICULAS
// Efecto de estrellas en 3D que vuelan hacia la camara
// =====================================================

const canvas = document.getElementById('grid_canvas');
const ctx    = canvas.getContext('2d');

// El canvas tiene que cubrir toda la ventana del navegador.
// Se llama al inicio y cada vez que el usuario redimensiona la ventana.
function ajustar_canvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustar_canvas);
ajustar_canvas();

// Cantidad total de particulas que existen al mismo tiempo en pantalla
const CANTIDAD_PARTICULAS = 500;

// Crea una sola particula con posicion y velocidad aleatoria.
// Si centro = true, la particula nace cerca del centro de la pantalla
// (esto pasa cuando una particula muere y necesita renacer).
function crear_particula(centro) {
  const angle = Math.random() * Math.PI * 2;  // angulo aleatorio en circulo completo

  // Si renace (centro = true), aparece muy cerca del centro.
  // Si es nueva, puede aparecer en cualquier parte de la pantalla.
  let dist;
  if (centro) {
    dist = Math.random() * 0.1;  // cerca del centro
  } else {
    dist = Math.random();        // en cualquier lugar
  }

  // x e y van de 0 a 1 (coordenadas normalizadas, no pixeles todavia)
  // z representa la profundidad: 1 = muy lejos, 0 = muy cerca de la camara
  return {
    x:     0.5 + Math.cos(angle) * dist * 0.5,
    y:     0.5 + Math.sin(angle) * dist * 0.5,
    z:     Math.random(),
    speed: 0.00008 + Math.random() * 0.0001,  // velocidad de acercamiento a la camara
  };
}

// Genera el arreglo inicial con todas las particulas usando un for loop normal
const particulas = [];
for (let i = 0; i < CANTIDAD_PARTICULAS; i++) {
  particulas.push(crear_particula(false));
}


function dibujarParticulas() {
  // Borra todo lo del frame anterior antes de redibujar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const W  = canvas.width;
  const H  = canvas.height;
  const cx = W / 2;  // centro x de la pantalla en pixeles
  const cy = H / 2;  // centro y de la pantalla en pixeles

  for (const p of particulas) {

    // Cada frame la particula se acerca a la camara bajando su z
    p.z -= p.speed;

    // Si z llego a 0 (esta demasiado cerca), la mandamos de vuelta al centro.
    // Object.assign copia todas las propiedades de la particula nueva dentro de p.
    if (p.z <= 0) {
      Object.assign(p, crear_particula(true));
      p.z = 1;
    }

    // Proyeccion perspectiva: cuando z es pequeño (cerca), scale es grande,
    // lo que hace que la particula se vea mas grande y mas lejos del centro
    const scale = 1 / p.z;
    const sx    = (p.x - 0.5) * scale * W + cx;  // posicion final en pixeles X
    const sy    = (p.y - 0.5) * scale * H + cy;  // posicion final en pixeles Y

    // Si la particula salio de la pantalla, renace desde el centro
    if (sx < 0 || sx > W || sy < 0 || sy > H) {
      Object.assign(p, crear_particula(true));
      p.z = 1;
      continue;
    }

    // Tamaño y opacidad dependen de que tan cerca este la particula (z bajo = mas grande y visible)
    const size  = Math.max(0.3, (1 - p.z) * 2.2);
    const alpha = (1 - p.z) * 0.55;

    // Calcula donde estaba la particula un instante atras para dibujar la estela.
    // pz2 simula la posicion z anterior multiplicando la velocidad por 45 frames.
    const pz2 = p.z + p.speed * 45;
    const sc2 = 1 / pz2;
    const tx  = (p.x - 0.5) * sc2 * W + cx;  // posicion anterior X
    const ty  = (p.y - 0.5) * sc2 * H + cy;  // posicion anterior Y

    // Dibuja la linea que va desde donde estaba hasta donde esta ahora (estela)
    ctx.strokeStyle = `rgba(0,212,255,${alpha * 0.4})`;
    ctx.lineWidth   = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Dibuja el punto brillante al final de la estela
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${alpha})`;
    ctx.fill();
  }

  // Pide al navegador que llame a esta misma funcion en el proximo frame (~60fps)
  requestAnimationFrame(dibujarParticulas);
}

dibujarParticulas();


// =====================================================
// TRANSICION DE TEXTO (aparece de abajo hacia arriba)
// Usa IntersectionObserver para detectar cuando un
// elemento entra en pantalla y le agrega la clase 'listo'
// =====================================================

const revealEls = document.querySelectorAll('.aparecer');

// threshold: 0.15 significa que el elemento tiene que estar 15% visible para activarse
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('listo');     // activa la animacion CSS
      revealObserver.unobserve(e.target);  // deja de observarlo para que no se repita
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// =====================================================
// DOTS DE NAVEGACION LATERAL
// Detecta cual slide esta visible y pone el dot activo
// =====================================================

// Cada slide tiene un atributo data-s con su numero (0, 1, 2, 3)
const slides = document.querySelectorAll('[data-s]');
const pips   = document.querySelectorAll('.dot');

// threshold: 0.5 = la slide tiene que estar 50% visible para considerarse "activa"
const slideObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = parseInt(e.target.dataset.s);  // lee el numero de la slide (0, 1, 2 o 3)

      // Primero quita la clase activo de todos los dots
      pips.forEach(p => p.classList.remove('activo'));
      // Luego se la pone solo al dot que corresponde a esta slide
      pips[idx].classList.add('activo');
    }
  });
}, { threshold: 0.5 });

slides.forEach(s => slideObserver.observe(s));


// =====================================================
// EFECTO TYPEWRITER (texto que se escribe solo)
// Escribe el tagline letra por letra con un efecto
// de caracteres random antes de cada letra real.
// Cuando termina, espera y lo borra hacia atras.
// =====================================================

const tagline   = 'Tu auto limpio mientras estudias.';
const twEl      = document.getElementById('escribe_solo');
const glyphPool = '01!?@#$%&<>{}[]|\\/=+-*^~_░▒▓';  // caracteres random que aparecen antes de cada letra

// Pausa la ejecucion durante 'ms' milisegundos.
// Se usa con 'await' dentro de funciones async.
function sleep(ms) {
  return new Promise(function(resolver) {
    setTimeout(resolver, ms);
  });
}

// Muestra 3 caracteres random y luego escribe la letra real.
// prefix = lo que ya esta escrito, realChar = la letra que le toca ahora.
async function scrambleChar(prefix, realChar) {
  for (let k = 0; k < 3; k++) {
    twEl.textContent = prefix + glyphPool[Math.floor(Math.random() * glyphPool.length)];
    await sleep(32);
  }
  twEl.textContent = prefix + realChar;
}

async function startTypewriterLoop() {
  await sleep(400);  // espera un poco antes de empezar para que la pagina cargue

  while (true) {

    // Escribe el tagline completo, letra por letra
    for (let i = 0; i < tagline.length; i++) {
      await scrambleChar(tagline.slice(0, i), tagline[i]);
      await sleep(45 + Math.random() * 30);  // pausa variable entre letras para que se vea natural
    }

    await sleep(5000);  // se queda 5 segundos mostrando el texto completo

    // Borra el texto hacia atras, caracter por caracter
    for (let i = tagline.length; i >= 0; i--) {
      twEl.textContent = tagline.slice(0, i);
      await sleep(25 + Math.random() * 15);
    }

    await sleep(600);  // pausa antes de volver a escribir
  }
}

startTypewriterLoop();


// =====================================================
// CURSOR PERSONALIZADO
// Reemplaza el cursor del sistema por un punto azul
// que sigue al mouse con un pequeno retraso suavizado
// =====================================================

const cursor = document.getElementById('cursor');

// mouseX/mouseY guardan la posicion real del mouse
// curX/curY guardan la posicion actual del div del cursor (que va atras del mouse)
let curX = 0, curY = 0;
let mouseX = 0, mouseY = 0;

// Actualiza la posicion real del mouse en cada movimiento
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Cada frame mueve el cursor un 14% mas cerca de donde esta el mouse real.
// Esto crea el efecto de retraso suavizado (lerp = linear interpolation).
function animarCursor() {
  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animarCursor);
}
animarCursor();

// El cursor se hace mas grande al pasar sobre links y botones
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expandido'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expandido'));
});

// El cursor se hace aun mas grande al hacer clic
document.addEventListener('mousedown', () => cursor.classList.add('clic'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clic'));


// =====================================================
// INDICADOR DE SCROLL
// El icono del scroll en el fondo desaparece cuando
// el usuario ya bajo mas de 100px en la pagina
// =====================================================

const scrollIndicator = document.querySelector('.indicador_scroll');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator.style.opacity = '0';  // oculta el indicador
  } else {
    scrollIndicator.style.opacity = '1';  // lo vuelve a mostrar si sube
  }
});


// =====================================================
// ANIMACION DE CONTADORES
// Los numeros de la slide 2 suben desde 0 hasta su
// valor real cuando entran en pantalla
// =====================================================

// Anima un solo contador: lee el valor final de data-target y lo sube en 1200ms
function animarContador(el) {
  const objetivo = parseInt(el.dataset.target);  // valor final (ej: 66)
  const duracion = 1200;                          // tiempo total de la animacion en ms
  const inicio   = performance.now();             // marca de tiempo del momento en que empieza

  function paso(ahora) {
    // progreso va de 0 a 1 segun cuanto tiempo paso vs la duracion total
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    el.textContent = Math.floor(progreso * objetivo);

    if (progreso < 1) {
      requestAnimationFrame(paso);  // sigue animando hasta llegar a 1
    } else {
      el.textContent = objetivo;    // asegura que termine en el numero exacto
    }
  }

  requestAnimationFrame(paso);
}

// Observa cada contador y lo activa cuando entra en pantalla
const observador_contadores = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animarContador(e.target);
      observador_contadores.unobserve(e.target);  // solo se anima una vez
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.contador_stat').forEach(el => observador_contadores.observe(el));


// =====================================================
// BOTON MAGNETICO (slide 4)
// El boton se mueve levemente hacia donde esta el mouse
// para dar sensacion de que lo "atrae"
// =====================================================

const btn_cta = document.getElementById('btn_cta');

btn_cta.addEventListener('mousemove', e => {
  const rect    = btn_cta.getBoundingClientRect();  // posicion y tamaño del boton en pantalla
  const centroX = rect.left + rect.width  / 2;      // centro del boton en X
  const centroY = rect.top  + rect.height / 2;      // centro del boton en Y

  // El boton se desplaza un 25% de la distancia entre el mouse y su centro
  const dx = (e.clientX - centroX) * 0.25;
  const dy = (e.clientY - centroY) * 0.25;
  btn_cta.style.transform = `translate(${dx}px, ${dy}px)`;
});

// Cuando el mouse sale del boton, vuelve a su posicion original
btn_cta.addEventListener('mouseleave', () => {
  btn_cta.style.transform = 'translate(0, 0)';
});
