const themeManager = {
    init() {
        this.currentPreference = localStorage.getItem('user-theme') || 'system';
        this.darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listener para cambios del sistema
        this.darkQuery.addEventListener('change', () => {
            if (this.currentPreference === 'system') this.applyTheme();
        });

        // Crear la UI dinámicamente si no existe
        this.createUI();
        this.applyTheme();
    },

    createUI() {
        if (document.getElementById('theme-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'theme-panel';
        panel.innerHTML = `
            <button id="theme-light">Claro</button>
            <button id="theme-dark">Oscuro</button>
            <button id="theme-system">Auto</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('theme-light').onclick = () => this.setTheme('light');
        document.getElementById('theme-dark').onclick = () => this.setTheme('dark');
        document.getElementById('theme-system').onclick = () => this.setTheme('system');
    },

    applyTheme() {
        let themeToApply = this.currentPreference;

        if (this.currentPreference === 'system') {
            themeToApply = this.darkQuery.matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', themeToApply);
        
        // Aplicar Hack de Canvas al juego (webview)
        this.aplicarColorCampo(themeToApply);
        
        // Actualizar estados de botones
        const btns = ['light', 'dark', 'system'];
        btns.forEach(id => {
            const btn = document.getElementById(`theme-${id}`);
            if (btn) {
                if (this.currentPreference === id) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });
    },

    aplicarColorCampo(tema) {
        const webview = document.getElementById('game-view');
        if (!webview) return;
        
        // Enviamos el tema al contexto del webview
        webview.executeJavaScript(`window.__temaActual = '${tema}';`);
    },

    setTheme(pref) {
        this.currentPreference = pref;
        localStorage.setItem('user-theme', pref);
        this.applyTheme();
    }
};

// Iniciar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    
    // Asegurar que el hack se aplique cuando el webview termine de cargar
    const webview = document.getElementById('game-view');
    if (webview) {
        webview.addEventListener('dom-ready', () => {
            themeManager.applyTheme();
        });
    }
});
