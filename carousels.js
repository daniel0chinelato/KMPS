/* ==========================================================================
   CAROUSELS.JS — carrossel manual dos Torneios (cards quadrados),
   grade de Dicas (mapas), e o carrossel automático com dissolve do rodapé.
   ========================================================================== */

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
}

// ===== TORNEIOS (carrossel manual por setas) =====
function montarCardTorneio(t) {
    const classeExtra = t.emBreve ? ' em-breve' : '';
    const conteudo = t.imagem
        ? `<img src="${t.imagem}" alt="${escapeHtml(t.nome)}">`
        : `<span class="tc-label">${escapeHtml(t.nome)}</span>`;
    const onclick = t.link ? ` onclick="window.location.href='${t.link}'"` : '';
    return `<div class="tournament-card${classeExtra}" title="${escapeHtml(t.nome)}"${onclick}>${conteudo}</div>`;
}
function renderizarTorneios() {
    const lista = document.getElementById('torneiosList');
    if (!lista) return;
    lista.innerHTML = torneiosData.map(montarCardTorneio).join('');
}
function scrollarCarrossel(id, direcao) {
    const el = document.getElementById(id);
    if (!el) return;
    const card = el.querySelector('.tournament-card, .dica-card');
    const gap = 18;
    const distancia = card ? (card.getBoundingClientRect().width + gap) : 320;
    el.scrollBy({ left: direcao * distancia, behavior: 'smooth' });
}

// ===== DICAS (grade de mapas — cada um abre a página de dicas do Tavernas) =====
function renderizarDicas() {
    const lista = document.getElementById('dicasList');
    if (!lista) return;
    const nomes = Object.keys(mapaImagens).sort();
    lista.innerHTML = nomes.map(nome => {
        const img = mapaImagens[nome];
        const url = `tavernas.html?mapa=${encodeURIComponent(nome)}&dicas=1#page-maps`;
        return `<a class="dica-card" href="${url}" style="background-image:url('${img}')"><span>${escapeHtml(nome)}</span></a>`;
    }).join('');
}

// ===== RODAPÉ — carrossel automático com dissolve =====
function iniciarCarrosselFooter() {
    const wrap = document.getElementById('footerBgCarousel');
    if (!wrap || !footerCarouselImages.length) return;
    wrap.innerHTML = footerCarouselImages.map((src, i) =>
        `<img src="${src}" class="footer-bg-slide${i === 0 ? ' active' : ''}" alt="" onerror="this.style.display='none'">`
    ).join('');
    if (footerCarouselImages.length < 2) return;
    let atual = 0;
    setInterval(() => {
        const imgs = wrap.querySelectorAll('.footer-bg-slide');
        if (!imgs.length) return;
        imgs[atual].classList.remove('active');
        atual = (atual + 1) % imgs.length;
        imgs[atual].classList.add('active');
    }, 6000);
}
