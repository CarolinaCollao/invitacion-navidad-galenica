
 // Galénica · Invitación navideña · Interacciones y animaciones
const URL_GOOGLE_SHEETS = "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT_TERMINADA_EN_EXEC";

// IMÁGENES: todas están en la misma carpeta que index.html
for (const img of document.querySelectorAll('img[data-img]')) {
  img.src = `${img.dataset.img}.png`;
}

// ELEMENTOS PRINCIPALES
const sc = document.getElementById('scroll');
const env = document.getElementById('envelope');
const pages = [...document.querySelectorAll('.page')];

const music = document.getElementById('christmas-audio');
const musicToggle = document.getElementById('music-toggle');

// CONTROL DE MÚSICA
function syncMusicButton() {
  const playing = !music.paused;

  musicToggle.textContent = playing
    ? '♫ Música: encendida'
    : '♫ Música: apagada';

  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute(
    'aria-label',
    playing ? 'Pausar música' : 'Reproducir música'
  );
}

music.addEventListener('play', syncMusicButton);
music.addEventListener('pause', syncMusicButton);

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => syncMusicButton());
  } else {
    music.pause();
  }
});

// APERTURA DEL SOBRE
document.getElementById('open').addEventListener('click', () => {
  music.volume = 0.75;
  music.play().catch(() => syncMusicButton());

  env.classList.add('reveal');
  document.body.classList.add('open');
  document.getElementById('nav').hidden = false;

  setTimeout(() => env.classList.add('done'), 1450);
}, { once: true });

// NAVEGACIÓN Y ANIMACIONES POR SCROLL
const navbuttons = [...document.querySelectorAll('[data-page]')];

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('in-view', e.isIntersecting);

    if (e.isIntersecting) {
      const i = pages.indexOf(e.target);

      navbuttons.forEach((b, n) => {
        b.setAttribute('aria-current', String(n === i));
      });
    }
  });
}, {
  root: sc,
  threshold: 0.32
});

pages.forEach(p => obs.observe(p));

navbuttons.forEach(b => {
  b.addEventListener('click', () => {
    pages[+b.dataset.page].scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// VOLVER AL INICIO
document.getElementById('restart').addEventListener('click', () => {
  pages[0].scrollIntoView({ behavior: 'smooth' });
});

// FORMULARIO DE CONFIRMACIÓN
// Envía los datos a Google Apps Script.
// IMPORTANTE: no-cors no permite comprobar
// si la información se guardó en Google Sheets.

const rsvp = document.getElementById('rsvp');
const submitButton = rsvp.querySelector('button[type="submit"]');
const formNote = rsvp.querySelector('.formnote');

rsvp.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!rsvp.reportValidity()) return;

  const data = new FormData(rsvp);

  const nombre = String(data.get('nombre') || '').trim();
  const attendance = data.get('attendance');

  if (!nombre || !['si', 'no'].includes(attendance)) return;

  // Comprobar que exista una URL de Apps Script
  if (
    !URL_GOOGLE_SHEETS.startsWith(
      'https://script.google.com/macros/s/'
    ) ||
    !URL_GOOGLE_SHEETS.endsWith('/exec')
  ) {
    alert(
      'Configura primero la URL de Google Apps Script en app.js.'
    );
    return;
  }

  submitButton.disabled = true;

  const originalLabel = submitButton.textContent;
  submitButton.textContent = 'Enviando…';

  try {
    await fetch(URL_GOOGLE_SHEETS, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        nombre: nombre,
        asiste: attendance
      })
    });

    // La respuesta no-cors es opaca.
    // No confirma que Sheets guardó la información.
    if (formNote) {
      formNote.textContent =
        'Solicitud enviada. La recepción debe verificarse en Google Sheets.';
    }

    // Mostrar mensaje personalizado
    ['yes', 'no', 'pending'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });

    const resultId = attendance === 'si' ? 'yes' : 'no';

    document.getElementById(resultId).classList.add('show');

    // Avanzar a la quinta pantalla
    pages[4].scrollIntoView({
      behavior: 'smooth'
    });

  } catch (error) {
    console.error(
      'No fue posible enviar el formulario:',
      error
    );

    if (formNote) {
      formNote.textContent =
        'No se pudo enviar. Revisa tu conexión e inténtalo otra vez.';
    }

    alert(
      'No se pudo enviar la confirmación. Inténtalo nuevamente.'
    );

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

// CUENTA REGRESIVA
// 24 de diciembre de 2026, 20:00 horas de Chile

const target = new Date(
  '2026-12-24T20:00:00-03:00'
).getTime();

function countdown() {
  const remaining = Math.max(0, target - Date.now());

  const vals = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60
  ];

  ['days', 'hours', 'minutes', 'seconds'].forEach((x, i) => {
    document.getElementById(x).textContent =
      String(vals[i]).padStart(2, '0');
  });
}

countdown();
setInterval(countdown, 1000);

