// Monta o HTML de um card de linha, com a estrela de favorito
function htmlCartaoLinha(linha, favorita) {
  const tipoEstrela = favorita ? "fa-solid" : "fa-regular";
  const classeAtivo = favorita ? "ativo" : "";

  return `
    <article class="cartao">
      <div class="cartao-topo">
        <span class="selo">${escapar(linha.numero)}</span>
        <button type="button" class="botao-favorito ${classeAtivo}" data-favoritar-linha="${linha.id}" aria-pressed="${favorita}" aria-label="Favoritar linha ${escapar(linha.numero)}">
          <i class="${tipoEstrela} fa-star" aria-hidden="true"></i>
        </button>
      </div>
      <h2 class="cartao-nome">${escapar(linha.nome)}</h2>
      <p class="cartao-itinerario">${escapar(linha.itinerario)}</p>
    </article>`;
}

// Escuta cliques nas estrelas. Quando um clique acontece, guarda a mudança e
// avisa a página, chamando aoMudar(botao, virouFavorito)
function ligarEstrelas(aoMudar) {
  document.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-favoritar-linha]");
    if (botao === null) {
      return;
    }
    const id = Number(botao.dataset.favoritarLinha);
    const virouFavorito = alternarFavorito(usuarioLogado.email, "linhas", id);
    aoMudar(botao, virouFavorito);
  });
}
