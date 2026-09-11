// Modo escuro/claro + destaque do link ativo no menu.
// Compartilhado entre todas as páginas do site.

document.addEventListener('DOMContentLoaded', () => {
    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
            document.body.classList.add('dark-mode');
            toggleDark.textContent = '☀️';
        }
        toggleDark.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                toggleDark.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                toggleDark.textContent = '🌙';
            }
        });
    }

    document.querySelectorAll('nav a').forEach((link) => {
        link.addEventListener('click', function () {
            document.querySelectorAll('nav a').forEach((l) => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
