// ---------- Linhas ----------

function carregarLinhas() {
  const salvo = localStorage.getItem("linhas");
  if (salvo === null) {
    // Primeira vez: vêm duas linhas de exemplo, como no Figma
    return [
      {
        id: 1,
        numero: "101",
        nome: "Centro · Unilasalle",
        itinerario: "Estação Canoas → Av. Victor Barreto → Unilasalle",
      },
      {
        id: 2,
        numero: "205",
        nome: "Centro · Mathias Velho",
        itinerario: "Estação Canoas → Unilasalle → Mathias Velho",
      },
    ];
  }
  return JSON.parse(salvo);
}

function salvarLinhas(linhas) {
  localStorage.setItem("linhas", JSON.stringify(linhas));
}

// ---------- Favoritos ----------
// Guardados assim: { "email": { linhas: [ids], pontos: [ids] } }

function carregarTodosFavoritos() {
  const salvo = localStorage.getItem("favoritos");
  if (salvo === null) {
    return {};
  }
  return JSON.parse(salvo);
}

function carregarFavoritos(email) {
  const meus = carregarTodosFavoritos()[email] || {};
  return { linhas: meus.linhas || [], pontos: meus.pontos || [] };
}

// tipo é "linhas" ou "pontos". Devolve true se virou favorito, false se saiu
function alternarFavorito(email, tipo, id) {
  const todos = carregarTodosFavoritos();
  const meus = todos[email] || { linhas: [], pontos: [] };
  const lista = meus[tipo] || [];
  const posicao = lista.indexOf(id);
  let virouFavorito;

  if (posicao === -1) {
    lista.push(id);
    virouFavorito = true;
  } else {
    lista.splice(posicao, 1);
    virouFavorito = false;
  }

  meus[tipo] = lista;
  todos[email] = meus;
  localStorage.setItem("favoritos", JSON.stringify(todos));
  return virouFavorito;
}

// Quando algo é excluído, some dos favoritos de todo mundo
function removerDosFavoritos(tipo, id) {
  const todos = carregarTodosFavoritos();
  Object.keys(todos).forEach(function (email) {
    const lista = todos[email][tipo] || [];
    todos[email][tipo] = lista.filter(function (x) {
      return x !== id;
    });
  });
  localStorage.setItem("favoritos", JSON.stringify(todos));
}

function removerLinhaDosFavoritos(idLinha) {
  removerDosFavoritos("linhas", idLinha);
}

function removerPontoDosFavoritos(idPonto) {
  removerDosFavoritos("pontos", idPonto);
}

// ---------- Pontos ----------
// Amanhã: cada ponto vai guardar as linhas que passam por ele assim:
// { id, nome, ..., linhas: [ids das linhas] }

function removerLinhaDosPontos(idLinha) {
  const salvo = localStorage.getItem("pontos");
  if (salvo === null) {
    return;
  }
  const pontos = JSON.parse(salvo);
  pontos.forEach(function (ponto) {
    ponto.linhas = (ponto.linhas || []).filter(function (id) {
      return id !== idLinha;
    });
  });
  localStorage.setItem("pontos", JSON.stringify(pontos));
}

// ---------- Segurança do HTML ----------
// Evita que "<" ou aspas digitados num campo quebrem a página

function escapar(texto) {
  const caixa = document.createElement("div");
  caixa.textContent = texto;
  return caixa.innerHTML.replaceAll('"', "&quot;");
}
