/* ==========================================================================
   MAIN.JS — menu (hambúrguer + scroll suave), Canais, Produtos, Atualizações,
   partículas vermelhas da Home, e a inicialização geral da página.
   ========================================================================== */

// ===== MENU =====
function toggleMenu() {
    document.getElementById('navbarLinks').classList.toggle('open');
    document.getElementById('navbarBurger').classList.toggle('open');
}
function fecharMenuSeMobile() {
    const links = document.getElementById('navbarLinks');
    const burger = document.getElementById('navbarBurger');
    if (links.classList.contains('open')) { links.classList.remove('open'); burger.classList.remove('open'); }
}
function marcarLinkAtivo() {
    const alvo = location.hash || '#hero';
    document.querySelectorAll('.navbar-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === alvo || (alvo === '#hero' && a.dataset.home === 'true'));
    });
}
window.addEventListener('hashchange', marcarLinkAtivo);

// ===== CANAIS EM DESTAQUE =====
function renderizarCanaisDestaque() {
    const lista = document.getElementById('canaisDestaqueList');
    if (!lista) return;
    lista.innerHTML = canaisDestaque.map(c => {
        const url = `https://www.youtube.com/@${c.handle}`;
        const avatar = `https://unavatar.io/youtube/${c.handle}`;
        return `<a class="channel-card" href="${url}" target="_blank" rel="noopener noreferrer">
            <div class="channel-avatar"><img src="${avatar}" onerror="this.parentElement.innerHTML='▶'"></div>
            <div class="channel-name">${escapeHtml(c.nome)}</div>
            <div class="channel-tag">YouTube</div>
        </a>`;
    }).join('');
}

// ===== NOSSOS PRODUTOS =====
function renderizarProdutos() {
    const lista = document.getElementById('produtosList');
    const linkVerMais = document.getElementById('produtosVerMaisLink');
    if (!lista) return;
    if (linkVerMais) linkVerMais.href = produtosLoja.linkVerMais;
    lista.innerHTML = produtosLoja.itens.map(p => p.imagem
        ? `<div class="product-card"><img src="${p.imagem}" alt="${escapeHtml(p.alt)}"></div>`
        : `<div class="product-card"><span class="product-card-label">${escapeHtml(p.alt)}</span></div>`
    ).join('');
}

// ===== ATUALIZAÇÕES (notícia em destaque) =====
async function carregarNovidadesAoM() {
    const container = document.getElementById('featuredNewsContainer');
    if (!container) return;
    try {
        const url = `${CHALLONGE_PROXY_URL}?path=aom-news`;
        const resp = await fetch(url);
        const dados = await resp.json();
        if (!Array.isArray(dados) || dados.length === 0) return;
        const destaque = dados[0];
        container.style.display = 'grid';
        document.getElementById('featuredNewsTitle').textContent = destaque.titulo;
        document.getElementById('featuredNewsText').textContent = 'Confira a novidade mais recente direto do site oficial de Age of Mythology: Retold.';
        document.getElementById('featuredNewsLink').href = destaque.url;
        const img = document.getElementById('featuredNewsImg');
        if (destaque.imagem) { img.src = destaque.imagem; img.style.display = 'block'; }
        else img.style.display = 'none';
    } catch (e) { /* silencioso: a home fica sem a notícia em destaque, sem quebrar o resto da página */ }
}

// ===== PARTÍCULAS VERMELHAS (somente na Home) =====
function gerarBrasasHome() {
    const layer = document.getElementById('homeEmbers');
    if (!layer) return;
    layer.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const e = document.createElement('div');
        e.className = 'home-ember';
        e.style.left = Math.random() * 100 + '%';
        e.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
        e.style.animationDuration = (7 + Math.random() * 7) + 's';
        e.style.animationDelay = (Math.random() * 9) + 's';
        e.style.width = e.style.height = (2 + Math.random() * 3) + 'px';
        layer.appendChild(e);
    }
}

// ===== INICIALIZAÇÃO =====
window.addEventListener('DOMContentLoaded', () => {
    renderizarCanaisDestaque();
    renderizarProdutos();
    carregarNovidadesAoM();
    renderizarTorneios();
    renderizarDicas();
    iniciarCarrosselFooter();
    gerarBrasasHome();
    marcarLinkAtivo();

    // Fecha o menu mobile ao clicar em qualquer link
    document.querySelectorAll('.navbar-links a').forEach(a => a.addEventListener('click', fecharMenuSeMobile));
});
