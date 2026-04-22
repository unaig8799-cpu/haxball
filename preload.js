// ==========================================
// CONFIGURACIÓN DE TEMA SIMPLE (SOLO FONDO NEGRO)
// ==========================================
const ID_ESTILO = "tema-cliente";
const TEMA_CSS = `
    /* Fondo negro simple para todo (eliminando imágenes) */
    html, body, .view-wrapper, .game-view, .room-view, #root, .home-view, .rooms-view, .login-view, .content { 
        background-color: #000000 !important; 
        background: #000000 !important;
        background-image: none !important;
        color: #fff !important;
    }

    /* BARRA DE URL Y FLECHA (Funcional) */
    #hax-url-container {
        position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
        transform: translateY(-44px); transition: transform 0.2s;
    }
    #hax-url-container.visible { transform: translateY(0); }
    #hax-url-bar {
        height: 44px; background: #111; border-bottom: 1px solid #22c55e;
        display: flex; align-items: center; padding: 0 15px;
    }
    #hax-url-input {
        flex: 1; background: #000; border: 1px solid #333; color: #fff; padding: 8px; border-radius: 4px;
    }
    #hax-url-btn {
        background: #22c55e; color: #000; margin-left: 10px; padding: 8px 15px;
        border-radius: 4px; cursor: pointer; font-weight: bold; border: none;
    }
    #hax-url-toggle {
        position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
        background: #111; border: 1px solid #22c55e; border-top: none;
        color: #22c55e; padding: 0 15px; height: 20px; border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px; cursor: pointer; font-size: 10px;
    }
    #hax-url-toggle.desaparecer-en-sala { display: none !important; }

    #hax-arrow-visibility-btn {
        background: #222; border: 1px solid #444; color: #fff; padding: 4px 8px;
        margin-right: 5px; cursor: pointer; display: none; font-size: 11px;
    }
    #hax-arrow-visibility-btn.visible-in-room { display: inline-block !important; }
`;

function inyectarTema() {
    if (!document.head) return;
    let styleTag = document.getElementById(ID_ESTILO);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = ID_ESTILO;
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = TEMA_CSS;
    
    // Forzado directo por JS para el body
    if (document.body) {
        document.body.style.backgroundColor = "#000000";
        document.body.style.backgroundImage = "none";
    }
}

// ==========================================
// OPTIMIZACIONES Y AD-BLOCK
// ==========================================
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 1);

window.addEventListener('DOMContentLoaded', () => {
    inyectarTema();

    const observer = new MutationObserver(() => {
        if (!document.getElementById(ID_ESTILO)) inyectarTema();
        
        // Forzado agresivo en cada mutación
        if (document.body && (document.body.style.backgroundColor !== "rgb(0, 0, 0)" || document.body.style.backgroundImage !== "none")) {
            document.body.style.setProperty('background-color', '#000000', 'important');
            document.body.style.setProperty('background-image', 'none', 'important');
        }
        
        const wrapper = document.querySelector('.view-wrapper');
        if(wrapper && wrapper.style.backgroundColor !== "rgb(0, 0, 0)") {
            wrapper.style.setProperty('background-color', '#000000', 'important');
            wrapper.style.setProperty('background-image', 'none', 'important');
        }

        // Mantener botón de flecha en la cabecera
        const headerButtons = document.querySelector('.header .buttons');
        const arrowControlBtn = document.getElementById('hax-arrow-visibility-btn');
        if (headerButtons && arrowControlBtn && !headerButtons.contains(arrowControlBtn)) {
            headerButtons.insertBefore(arrowControlBtn, headerButtons.firstChild);
        }

        // Matar anuncios
        document.querySelectorAll('iframe[src*="googleads"], .adsbygoogle, #ad-unit').forEach(ad => ad.remove());
    });
    observer.observe(document.head, { childList: true });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- RESTO DE LÓGICA DE LA BARRA DE URL (IGUAL QUE ANTES) ---
    const container = document.createElement('div');
    container.id = 'hax-url-container';
    container.innerHTML = `<div id="hax-url-bar"><input type="text" id="hax-url-input" placeholder="Pega link..."><button id="hax-url-btn">JOIN</button></div><div id="hax-url-toggle">▼</div>`;
    document.body.appendChild(container);

    const arrowControlBtn = document.createElement('button');
    arrowControlBtn.id = 'hax-arrow-visibility-btn';
    arrowControlBtn.textContent = 'FLECHA';
    document.body.appendChild(arrowControlBtn);

    let flechaForzadaVisible = false;
    const input = document.getElementById('hax-url-input');
    const toggle = document.getElementById('hax-url-toggle');

    function alternarBarra() {
        container.classList.toggle('visible');
        toggle.textContent = container.classList.contains('visible') ? '▲' : '▼';
        if (container.classList.contains('visible')) input.focus();
    }

    toggle.addEventListener('click', alternarBarra);
    document.getElementById('hax-url-btn').onclick = () => {
        if (input.value.includes('haxball.com/play')) window.location.href = input.value;
    };
    input.onkeydown = (e) => { if (e.key === 'Enter') document.getElementById('hax-url-btn').click(); };

    arrowControlBtn.onclick = () => {
        flechaForzadaVisible = !flechaForzadaVisible;
        toggle.classList.toggle('desaparecer-en-sala', !flechaForzadaVisible);
    };

    window.onkeydown = (e) => { if (e.key === '´' || e.code === 'Backquote') { alternarBarra(); e.preventDefault(); } };

    setInterval(() => {
        const enSala = !!document.querySelector('.room-view, .game-view');
        arrowControlBtn.classList.toggle('visible-in-room', enSala);
        if (enSala && !flechaForzadaVisible) toggle.classList.add('desaparecer-en-sala');
        else toggle.classList.remove('desaparecer-en-sala');
    }, 500);
});