const gradePontos = document.querySelector("#grade-pontos");
const campoBuscaCliente = document.querySelector("#busca");
const contadorCliente = document.querySelector("#contador");
const mensagemVaziaCliente = document.querySelector("#mensagem-vazia");
const botaoMostrarMais = document.querySelector("#mostrar-mais");

const POR_PAGINA = 12;
let quantosMostrar = POR_PAGINA;

function desenharPontosCliente() {
  const todos = carregarPontos();
  const favoritos = carregarFavoritos(usuarioLogado.email).pontos;
  const termo = campoBuscaCliente.value.trim().toLowerCase();

  const filtrados = todos.filter(function (ponto) {
    return (
      ponto.nome.toLowerCase().includes(termo) ||
      ponto.endereco.toLowerCase().includes(termo)
    );
  });

  filtrados.sort(function (a, b) {
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  const visiveis = filtrados.slice(0, quantosMostrar);

  let html = "";
  visiveis.forEach(function (ponto) {
    html += htmlCartaoPonto(ponto, favoritos.includes(ponto.id));
  });
  gradePontos.innerHTML = html;

  const palavra = filtrados.length === 1 ? "ponto" : "pontos";
  contadorCliente.textContent =
    "Mostrando " + visiveis.length + " de " + filtrados.length + " " + palavra;

  mensagemVaziaCliente.hidden = filtrados.length !== 0;
  botaoMostrarMais.hidden = filtrados.length <= quantosMostrar;
}

if (gradePontos !== null && usuarioLogado !== null) {
  campoBuscaCliente.addEventListener("input", function () {
    quantosMostrar = POR_PAGINA;
    desenharPontosCliente();
  });

  botaoMostrarMais.addEventListener("click", function () {
    quantosMostrar += POR_PAGINA;
    desenharPontosCliente();
  });

  ligarEstrelas(function (botao, virouFavorito) {
    const icone = botao.querySelector("i");
    botao.classList.toggle("ativo", virouFavorito);
    botao.setAttribute("aria-pressed", String(virouFavorito));
    icone.classList.toggle("fa-solid", virouFavorito);
    icone.classList.toggle("fa-regular", !virouFavorito);
  });

  desenharPontosCliente();
}
