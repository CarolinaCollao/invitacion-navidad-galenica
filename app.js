
"use strict";

// =====================================
// INVITACIÓN NAVIDEÑA GALÉNICA
// =====================================

// CONEXIÓN CON GOOGLE SHEETS
const URL_GOOGLE_SHEETS =
  "https://script.google.com/macros/s/AKfycbzhWw1772Qouh4tCw0PD8Iz5tq-EeeGlVG4liTN4Z5ncNlrdI9HPXCJgp7rB2u3Ulzn/exec";

// Ejecutar cuando el HTML esté cargado
function iniciarInvitacion() {

  // =====================================
  // 1. CARGAR IMÁGENES
  // =====================================

  // Los PNG están junto a index.html
  document.querySelectorAll("img[data-img]").forEach(img => {
    img.src = img.dataset.img + ".png";
  });

  // =====================================
  // 2. ELEMENTOS GENERALES
  // =====================================

  const sc = document.getElementById("scroll");
  const env = document.getElementById("envelope");
  const pages = [...document.querySelectorAll(".page")];

  const music = document.getElementById("christmas-audio");
  const musicToggle = document.getElementById("music-toggle");

  const openButton = document.getElementById("open");
  const nav = document.getElementById("nav");

  // =====================================
  // 3. MÚSICA NAVIDEÑA
  // =====================================

  function syncMusicButton() {
    if (!music || !musicToggle) return;

    const playing = !music.paused;

    musicToggle.textContent = playing
      ? "♫ Música: encendida"
      : "♫ Música: apagada";

    musicToggle.setAttribute(
      "aria-pressed",
      String(playing)
    );

    musicToggle.setAttribute(
      "aria-label",
      playing ? "Pausar música" : "Reproducir música"
    );
  }

  if (music && musicToggle) {

    music.addEventListener("play", syncMusicButton);
    music.addEventListener("pause", syncMusicButton);

    musicToggle.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(error => {
          console.warn("No se pudo reproducir la música:", error);
          syncMusicButton();
        });
      } else {
        music.pause();
      }
    });

    syncMusicButton();
  }

  // =====================================
  // 4. APERTURA DEL SOBRE
  // =====================================

  if (openButton && env) {

    openButton.addEventListener("click", () => {

      // Música al abrir el sobre
      if (music) {
        music.volume = 0.75;

        music.play().catch(error => {
          console.warn("Audio no disponible:", error);
        });
      }

      // Abrir solapas
      env.classList.add("reveal");

      // Activar invitación
      document.body.classList.add("open");

      if (nav) {
        nav.hidden = false;
      }

      // Finalizar apertura
      setTimeout(() => {
        env.classList.add("done");
      }, 1450);

    }, { once: true });

  } else {
    console.error("No se encontró el botón o el sobre.");
  }

  // =====================================
  // 5. ANIMACIONES POR SCROLL
  // =====================================

  const navbuttons = [
    ...document.querySelectorAll("[data-page]")
  ];

  if (sc && pages.length > 0) {

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        entry.target.classList.toggle(
          "in-view",
          entry.isIntersecting
        );

        if (entry.isIntersecting) {

          const index = pages.indexOf(entry.target);

          navbuttons.forEach((button, i) => {
            button.setAttribute(
              "aria-current",
              String(i === index)
            );
          });

        }

      });

    }, {
      root: sc,
      threshold: 0.32
    });

    pages.forEach(page => observer.observe(page));
  }

  // =====================================
  // 6. NAVEGACIÓN ENTRE PANTALLAS
  // =====================================

  navbuttons.forEach(button => {

    button.addEventListener("click", () => {

      const index = Number(button.dataset.page);

      if (pages[index]) {
        pages[index].scrollIntoView({
          behavior: "smooth"
        });
      }

    });

  });

  // Volver a la portada
  const restart = document.getElementById("restart");

  if (restart) {
    restart.addEventListener("click", () => {
      if (pages[0]) {
        pages[0].scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  }

  // =====================================
  // 7. FORMULARIO GOOGLE SHEETS
  // =====================================

  const rsvp = document.getElementById("rsvp");

  if (rsvp) {

    const submitButton = rsvp.querySelector(
      'button[type="submit"]'
    );

    const formNote = rsvp.querySelector(".formnote");

    rsvp.addEventListener("submit", async event => {

      event.preventDefault();

      if (!rsvp.reportValidity()) return;

      const data = new FormData(rsvp);

      const nombre = String(
        data.get("nombre") || ""
      ).trim();

      const asistencia = data.get("attendance");

      if (!nombre || !["si", "no"].includes(asistencia)) {
        alert("Completa tu nombre y selecciona una respuesta.");
        return;
      }

      // Desactivar botón mientras se envía
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      try {

        // Enviar a Google Apps Script
        await fetch(URL_GOOGLE_SHEETS, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            nombre: nombre,
            asiste: asistencia
          })
        });

        // IMPORTANTE:
        // no-cors no permite verificar si
        // Google Sheets guardó la respuesta.

        if (formNote) {
          formNote.textContent =
            "Solicitud enviada. Comprueba su recepción en Google Sheets.";
        }

        // Mostrar respuesta personalizada
        ["yes", "no", "pending"].forEach(id => {

          const result = document.getElementById(id);

          if (result) {
            result.classList.remove("show");
          }

        });

        const resultId =
          asistencia === "si" ? "yes" : "no";

        const result = document.getElementById(resultId);

        if (result) {
          result.classList.add("show");
        }

        // Avanzar a pantalla 5
        if (pages[4]) {
          pages[4].scrollIntoView({
            behavior: "smooth"
          });
        }

      } catch (error) {

        console.error("Error de envío:", error);

        if (formNote) {
          formNote.textContent =
            "No se pudo enviar. Inténtalo nuevamente.";
        }

        alert(
          "No fue posible enviar la confirmación. Inténtalo nuevamente."
        );

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar confirmación";
        }

      }

    });
  }

  // =====================================
  // 8. CUENTA REGRESIVA
  // =====================================

  // 24 de diciembre de 2026 a las 20:00
  // Horario de Santiago de Chile

  const target = new Date(
    "2026-12-24T20:00:00-03:00"
  ).getTime();

  function countdown() {

    const remaining = Math.max(
      0,
      target - Date.now()
    );

    const values = [
      Math.floor(remaining / 86400000),
      Math.floor(remaining / 3600000) % 24,
      Math.floor(remaining / 60000) % 60,
      Math.floor(remaining / 1000) % 60
    ];

    const ids = [
      "days",
      "hours",
      "minutes",
      "seconds"
    ];

    ids.forEach((id, index) => {

      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(
          values[index]
        ).padStart(2, "0");
      }

    });

  }

  countdown();
  setInterval(countdown, 1000);

  console.log("Invitación Galénica inicializada correctamente.");
}

// =====================================
// 9. INICIALIZACIÓN SEGURA
// =====================================

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    iniciarInvitacion
  );
} else {
  iniciarInvitacion();
}


