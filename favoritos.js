const gradeFavoritas = document.querySelector("#grade-favoritas");

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

// AMANHÃ: quando existir a tela de pontos, desenha aqui os pontos favoritos
// (mesma ideia da função de cima, usando carregarFavoritos(...).pontos)
function desenharFavoritosPontos() {
  document.querySelector("#vazio-pontos").hidden = false;
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

  // Aqui, tirar a estrela faz o card sumir, então redesenha a lista
  ligarEstrelas(function () {
    desenharFavoritosLinhas();
  });

  desenharFavoritosLinhas();
  desenharFavoritosPontos();
}
