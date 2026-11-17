// ---------- Proteção: só o administrador entra ----------

function obterUsuarioLogado() {
  const salvo = localStorage.getItem("usuarioLogado");
  if (salvo === null) {
    return null;
  }
  return JSON.parse(salvo);
}

const usuarioLogado = obterUsuarioLogado();

// Cada página diz pra quem ela é, com <body data-perfil="cliente">.
// Sem esse atributo, vale "admin" (então as páginas de admin continuam iguais).
const perfilDaPagina = document.body.dataset.perfil || "admin";

if (usuarioLogado === null || usuarioLogado.perfil !== perfilDaPagina) {
  window.location.replace("index.html");
}

// ---------- Nome do usuário no cabeçalho ----------

const nomeNoTopo = document.querySelector("#topo-nome-usuario");
if (nomeNoTopo !== null && usuarioLogado !== null) {
  nomeNoTopo.textContent = usuarioLogado.nome;
}

// ---------- Link da página atual ----------

const paginaAtual = document.body.dataset.pagina;

document.querySelectorAll("a[data-pagina]").forEach(function (link) {
  if (link.dataset.pagina === paginaAtual) {
    link.classList.add("ativo");
    link.setAttribute("aria-current", "page");
  }
});

// ---------- Sair ----------

document.querySelectorAll("[data-sair]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
});

// ---------- Menu lateral (celular) ----------

const menuLateral = document.querySelector("#menu-lateral");
const menuFundo = document.querySelector("#menu-fundo");
const botaoAbrirMenu = document.querySelector("#abrir-menu");
const botaoFecharMenu = document.querySelector("#fechar-menu");

function abrirMenu() {
  menuLateral.classList.add("aberto");
  menuFundo.classList.add("aberto");
  document.body.classList.add("menu-aberto");
  botaoAbrirMenu.setAttribute("aria-expanded", "true");
  botaoFecharMenu.focus();
}

function fecharMenu() {
  menuLateral.classList.remove("aberto");
  menuFundo.classList.remove("aberto");
  document.body.classList.remove("menu-aberto");
  botaoAbrirMenu.setAttribute("aria-expanded", "false");
  botaoAbrirMenu.focus();
}

botaoAbrirMenu.addEventListener("click", abrirMenu);
botaoFecharMenu.addEventListener("click", fecharMenu);
menuFundo.addEventListener("click", fecharMenu);

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menuLateral.classList.contains("aberto")) {
    fecharMenu();
  }
});
