// Card de uma linha, com a estrela de favorito
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

// Card de um ponto, com a estrela de favorito
function htmlCartaoPonto(ponto, favorito) {
  const tipoEstrela = favorito ? "fa-solid" : "fa-regular";
  const classeAtivo = favorito ? "ativo" : "";

  let selos = htmlSelosDasLinhas(ponto.linhas);
  if (selos === "") {
    selos = '<span class="campo-ajuda">Nenhuma linha vinculada</span>';
  }

  return `
    <article class="cartao">
      <div class="cartao-topo">
        <i class="fa-solid fa-location-dot ponto-icone" aria-hidden="true"></i>
        <button type="button" class="botao-favorito ${classeAtivo}" data-favoritar-ponto="${ponto.id}" aria-pressed="${favorito}" aria-label="Favoritar ponto ${escapar(ponto.nome)}">
          <i class="${tipoEstrela} fa-star" aria-hidden="true"></i>
        </button>
      </div>
      <h2 class="cartao-nome">${escapar(ponto.nome)}</h2>
      <p class="cartao-itinerario">${escapar(ponto.endereco)}</p>
      <div class="selos">${selos}</div>
    </article>`;
}

// Escuta cliques nas estrelas (de linha ou de ponto), guarda a mudança
// e avisa a página, chamando aoMudar(botao, virouFavorito)
function ligarEstrelas(aoMudar) {
  document.addEventListener("click", function (evento) {
    const botao = evento.target.closest(
      "[data-favoritar-linha], [data-favoritar-ponto]",
    );
    if (botao === null) {
      return;
    }

    let tipo = "linhas";
    let id = Number(botao.dataset.favoritarLinha);
    if (botao.dataset.favoritarPonto !== undefined) {
      tipo = "pontos";
      id = Number(botao.dataset.favoritarPonto);
    }

    const virouFavorito = alternarFavorito(usuarioLogado.email, tipo, id);
    aoMudar(botao, virouFavorito);
  });
}
