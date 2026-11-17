const gradeLinhas = document.querySelector("#grade-linhas");
const campoBuscaCliente = document.querySelector("#busca");
const contadorCliente = document.querySelector("#contador");
const mensagemVaziaCliente = document.querySelector("#mensagem-vazia");
const botaoMostrarMais = document.querySelector("#mostrar-mais");

const POR_PAGINA = 12;
let quantosMostrar = POR_PAGINA;

function desenharLinhasCliente() {
  const todas = carregarLinhas();
  const favoritas = carregarFavoritos(usuarioLogado.email).linhas;
  const termo = campoBuscaCliente.value.trim().toLowerCase();

  const filtradas = todas.filter(function (linha) {
    return (
      linha.numero.toLowerCase().includes(termo) ||
      linha.nome.toLowerCase().includes(termo)
    );
  });

  filtradas.sort(function (a, b) {
    return a.numero.localeCompare(b.numero, "pt-BR", { numeric: true });
  });

  // Mostra só as primeiras (o resto vem pelo botão "Mostrar mais")
  const visiveis = filtradas.slice(0, quantosMostrar);

  let html = "";
  visiveis.forEach(function (linha) {
    html += htmlCartaoLinha(linha, favoritas.includes(linha.id));
  });
  gradeLinhas.innerHTML = html;

  const palavra = filtradas.length === 1 ? "linha" : "linhas";
  contadorCliente.textContent =
    "Mostrando " + visiveis.length + " de " + filtradas.length + " " + palavra;

  mensagemVaziaCliente.hidden = filtradas.length !== 0;
  botaoMostrarMais.hidden = filtradas.length <= quantosMostrar;
}

// Só roda na página de linhas do cliente
if (gradeLinhas !== null && usuarioLogado !== null) {
  campoBuscaCliente.addEventListener("input", function () {
    quantosMostrar = POR_PAGINA;
    desenharLinhasCliente();
  });

  botaoMostrarMais.addEventListener("click", function () {
    quantosMostrar += POR_PAGINA;
    desenharLinhasCliente();
  });

  // Ao favoritar, só troca a estrela clicada (sem redesenhar a lista,
  // pra não perder a posição da rolagem nem o foco do teclado)
  ligarEstrelas(function (botao, virouFavorito) {
    const icone = botao.querySelector("i");
    botao.classList.toggle("ativo", virouFavorito);
    botao.setAttribute("aria-pressed", String(virouFavorito));
    icone.classList.toggle("fa-solid", virouFavorito);
    icone.classList.toggle("fa-regular", !virouFavorito);
  });

  desenharLinhasCliente();
}
