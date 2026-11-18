const gradeFavoritas = document.querySelector("#grade-favoritas");
const gradePontosFavoritos = document.querySelector("#grade-pontos-favoritos");

function desenharFavoritosLinhas() {
  const ids = carregarFavoritos(usuarioLogado.email).linhas;

  const favoritas = carregarLinhas().filter(function (linha) {
    return ids.includes(linha.id);
  });

  favoritas.sort(function (a, b) {
    return a.numero.localeCompare(b.numero, "pt-BR", { numeric: true });
  });

  let html = "";
  favoritas.forEach(function (linha) {
    html += htmlCartaoLinha(linha, true);
  });
  gradeFavoritas.innerHTML = html;

  document.querySelector("#vazio-linhas").hidden = favoritas.length !== 0;
}

function desenharFavoritosPontos() {
  const ids = carregarFavoritos(usuarioLogado.email).pontos;

  const favoritos = carregarPontos().filter(function (ponto) {
    return ids.includes(ponto.id);
  });

  favoritos.sort(function (a, b) {
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  let html = "";
  favoritos.forEach(function (ponto) {
    html += htmlCartaoPonto(ponto, true);
  });
  gradePontosFavoritos.innerHTML = html;

  document.querySelector("#vazio-pontos").hidden = favoritos.length !== 0;
}

// Só roda na página de favoritos
if (gradeFavoritas !== null && usuarioLogado !== null) {
  // Abas: mostra o painel da aba clicada e esconde o outro
  document.querySelectorAll("[data-aba]").forEach(function (aba) {
    aba.addEventListener("click", function () {
      document.querySelectorAll("[data-aba]").forEach(function (outra) {
        const ativa = outra === aba;
        outra.setAttribute("aria-selected", String(ativa));
        document.querySelector("#painel-" + outra.dataset.aba).hidden = !ativa;
      });
    });
  });

  // Tirar a estrela faz o card sumir, então redesenha as duas listas
  ligarEstrelas(function () {
    desenharFavoritosLinhas();
    desenharFavoritosPontos();
  });

  desenharFavoritosLinhas();
  desenharFavoritosPontos();
}
