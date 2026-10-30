# Invitación Navideña · Galénica

Tarjeta virtual animada de cinco escenas, con apertura de sobre, ilustraciones PNG en capas, desplazamiento vertical, cuenta regresiva, confirmación de asistencia de demostración, música de fondo y logo de Galénica.

## Vista local

Abre `index.html` en el navegador. No necesitas instalar paquetes, Node.js ni un servidor para la mayoría de las funciones. Para probarla desde un servidor local puedes ejecutar `python -m http.server 8000` y visitar `http://localhost:8000`.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `invitacion-navidad-galenica`).
2. Sube **el contenido de esta carpeta** a la raíz del repositorio; `index.html` debe quedar en la raíz.
3. En el repositorio, abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`; guarda.
5. Una vez publicado, accede a `https://TU-USUARIO.github.io/invitacion-navidad-galenica/` (sustituye el usuario y el nombre del repositorio por los reales).

También puedes usar Git desde una terminal (dentro de esta carpeta):

```bash
git init
git add .
git commit -m "Invitación navideña Galénica"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/invitacion-navidad-galenica.git
git push -u origin main
```

## Estructura

- `index.html`: estructura de las cinco pantallas y el sobre.
- `css/styles.css`: diseño adaptable, posiciones y animaciones.
- `js/app.js`: lógica del sobre, audio, navegación, contador y respuestas.
- `assets/img/`: ilustraciones y logo originales de Galénica.
- `assets/audio/bajo-esta-luz.mp3`: canción de la invitación.

## Detalles importantes

- **Formulario de demostración**: el nombre y la asistencia NO se guardan ni se envían. Para recopilar respuestas reales hay que conectar un servicio/backend de forma explícita.
- **La música** comienza al abrir el sello. La reproducción puede depender de la política del navegador; hay un control para pausar/reanudar.
- **Cuenta regresiva**: está configurada para el 24 de diciembre de 2026 a las 20:00, zona horaria de Chile continental (UTC−03:00 en esa fecha).
- **Imagen de la patinadora**: la regla móvil está al final de `css/styles.css`, bajo `Ajuste específico de la escena 3`.
- **Publicación pública**: el repositorio puede exponer la música y las ilustraciones. Verifica que cuentas con los permisos necesarios antes de hacerlos públicos.

## Tecnología

HTML, CSS y JavaScript nativos. Sin dependencias de terceros ni proceso de compilación.
