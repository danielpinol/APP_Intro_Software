/**
 * UWASH — SCRIPTS PRINCIPALES
 * Este archivo contiene únicamente la lógica para la barra de progreso de lectura.
 */

document.addEventListener("DOMContentLoaded", () => {
    initProgressBar();
});

/**
 * SCROLL PROGRESS BAR
 * Actualiza el ancho de la línea superior según el progreso del scroll del usuario.
 */
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        // Calculamos cuánto scroll ha hecho el usuario relativo al total de la página
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        // Aplicamos el porcentaje al ancho de la barra
        progressBar.style.width = scrolled + '%';
    });
}
