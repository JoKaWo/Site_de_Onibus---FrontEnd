// ---------- Tela: lista de pontos ----------

const tabelaPontos = document.querySelector("#tabela-pontos");
const cartoesPontos = document.querySelector("#cartoes-pontos");
const campoBusca = document.querySelector("#busca");
const contador = document.querySelector("#contador");
const resumoTabela = document.querySelector("#tabela-resumo");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const avisoSucesso = document.querySelector("#aviso");

function mostrarAviso(texto) {
  avisoSucesso.textContent = texto;
  setTimeout(function () {
    avisoSucesso.textContent = "";
  }, 4000);
}

function selosOuAviso(ponto) {
  const selos = htmlSelosDasLinhas(ponto.linhas);
  if (selos === "") {
    return '<span class="campo-ajuda">Nenhuma linha vinculada</span>';
  }
  return selos;
}

function desenharListaPontos() {
  const todos = carregarPontos();
  const termo = campoBusca.value.trim().toLowerCase();

  const filtrados = todos.filter(function (ponto) {
    return (
      ponto.nome.toLowerCase().includes(termo) ||
      ponto.endereco.toLowerCase().includes(termo)
    );
  });

  filtrados.sort(function (a, b) {
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  let htmlTabela = "";
  let htmlCartoes = "";

  filtrados.forEach(function (ponto) {
    const selos = selosOuAviso(ponto);

    htmlTabela += `
      <tr>
        <td>
          <div class="ponto-celula">
            <i class="fa-solid fa-location-dot ponto-icone" aria-hidden="true"></i>
            <div>
              <p class="tabela-nome">${escapar(ponto.nome)}</p>
              <p class="tabela-itinerario">${escapar(ponto.endereco)}</p>
            </div>
          </div>
        </td>
        <td><div class="selos">${selos}</div></td>
        <td>
          <div class="tabela-acoes">
            <a class="icone-botao" href="novo-ponto.html?id=${ponto.id}" aria-label="Editar ponto ${escapar(ponto.nome)}">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </a>
            <button type="button" class="icone-botao icone-botao-perigo" data-excluir="${ponto.id}" aria-label="Excluir ponto ${escapar(ponto.nome)}">
              <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
            </button>
          </div>
        </td>
      </tr>`;

    htmlCartoes += `
      <article class="cartao">
        <i class="fa-solid fa-location-dot ponto-icone" aria-hidden="true"></i>
        <h2 class="cartao-nome">${escapar(ponto.nome)}</h2>
        <p class="cartao-itinerario">${escapar(ponto.endereco)}</p>
        <div class="selos">${selos}</div>
        <div class="cartao-acoes">
          <a class="botao-secundario" href="novo-ponto.html?id=${ponto.id}">Editar</a>
          <button type="button" class="botao-perigo-suave" data-excluir="${ponto.id}">Excluir</button>
        </div>
      </article>`;
  });

  tabelaPontos.innerHTML = htmlTabela;
  cartoesPontos.innerHTML = htmlCartoes;

  const palavra =
    todos.length === 1 ? "ponto cadastrado" : "pontos cadastrados";
  contador.textContent = todos.length + " " + palavra;

  let faixa = "0";
  if (filtrados.length > 0) {
    faixa = "1-" + filtrados.length;
  }
  resumoTabela.textContent =
    "Mostrando " + faixa + " de " + todos.length + " pontos";

  mensagemVazia.hidden = filtrados.length !== 0;
}

if (tabelaPontos !== null) {
  campoBusca.addEventListener("input", desenharListaPontos);
  desenharListaPontos();

  // Aviso deixado pela tela do formulário (salvou ou atualizou)
  const avisoGuardado = sessionStorage.getItem("avisoPontos");
  if (avisoGuardado !== null) {
    mostrarAviso(avisoGuardado);
    sessionStorage.removeItem("avisoPontos");
  }
}

// ---------- Excluir ponto (modal) ----------

const modalExcluir = document.querySelector("#modal-excluir");
let pontoParaExcluir = null;

if (modalExcluir !== null) {
  document.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-excluir]");
    if (botao === null) {
      return;
    }
    const id = Number(botao.dataset.excluir);
    const ponto = carregarPontos().find(function (p) {
      return p.id === id;
    });
    if (ponto === undefined) {
      return;
    }
    pontoParaExcluir = ponto;
    document.querySelector("#modal-titulo").textContent =
      "Excluir ponto " + ponto.nome + "?";
    modalExcluir.showModal();
  });

  document
    .querySelector("#modal-cancelar")
    .addEventListener("click", function () {
      modalExcluir.close();
    });

  document
    .querySelector("#modal-fechar")
    .addEventListener("click", function () {
      modalExcluir.close();
    });

  modalExcluir.addEventListener("click", function (evento) {
    if (evento.target === modalExcluir) {
      modalExcluir.close();
    }
  });

  document
    .querySelector("#modal-confirmar")
    .addEventListener("click", function () {
      const restantes = carregarPontos().filter(function (p) {
        return p.id !== pontoParaExcluir.id;
      });
      salvarPontos(restantes);
      removerPontoDosFavoritos(pontoParaExcluir.id);
      modalExcluir.close();
      desenharListaPontos();
      mostrarAviso("Ponto " + pontoParaExcluir.nome + " excluído.");
    });
}

// ---------- Tela: novo ponto / editar ponto ----------

const formPonto = document.querySelector("#form-ponto");

if (formPonto !== null) {
  const campoNome = document.querySelector("#nome");
  const campoEndereco = document.querySelector("#endereco");
  const campoLatitude = document.querySelector("#latitude");
  const campoLongitude = document.querySelector("#longitude");
  const listaLinhas = document.querySelector("#lista-linhas");
  const contagemLinhas = document.querySelector("#contagem-linhas");
  const campos = [campoNome, campoEndereco];

  // Modo edição: a URL vem assim: novo-ponto.html?id=2
  const parametros = new URLSearchParams(window.location.search);
  const idTexto = parametros.get("id");
  let pontoEmEdicao = null;

  if (idTexto !== null) {
    const encontrado = carregarPontos().find(function (p) {
      return p.id === Number(idTexto);
    });

    if (encontrado === undefined) {
      window.location.replace("pontos.html");
    } else {
      pontoEmEdicao = encontrado;
      campoNome.value = encontrado.nome;
      campoEndereco.value = encontrado.endereco;
      // O mapa do colega lê estes dois campos pra colocar o marcador
      if (typeof encontrado.latitude === "number") {
        campoLatitude.value = encontrado.latitude;
      }
      if (typeof encontrado.longitude === "number") {
        campoLongitude.value = encontrado.longitude;
      }
      document.querySelector("#titulo-pagina").textContent = "Editar ponto";
      document.querySelector("#subtitulo-pagina").textContent =
        "Atualize os dados do ponto.";
      document.querySelector("#botao-salvar").textContent = "Salvar alterações";
      document.title = "Editar ponto · Canoas Bus";
    }
  }

  // Desenha as linhas como caixinhas de marcar
  let marcadas = [];
  if (pontoEmEdicao !== null) {
    marcadas = pontoEmEdicao.linhas || [];
  }

  const todasLinhas = carregarLinhas();
  todasLinhas.sort(function (a, b) {
    return a.numero.localeCompare(b.numero, "pt-BR", { numeric: true });
  });

  let htmlLinhas = "";
  todasLinhas.forEach(function (linha) {
    let atributo = "";
    if (marcadas.includes(linha.id)) {
      atributo = "checked";
    }
    htmlLinhas += `
      <label class="linha-opcao">
        <input type="checkbox" name="linhas" value="${linha.id}" ${atributo} />
        <span class="selo">${escapar(linha.numero)}</span>
        <span>${escapar(linha.nome)}</span>
      </label>`;
  });

  if (htmlLinhas === "") {
    htmlLinhas =
      '<p class="campo-ajuda">Nenhuma linha cadastrada ainda. <a class="link-destaque" href="nova-linha.html">Cadastrar linha</a></p>';
  }
  listaLinhas.innerHTML = htmlLinhas;

  function atualizarContagem() {
    const quantas = listaLinhas.querySelectorAll("input:checked").length;
    let texto = "Nenhuma linha selecionada";
    if (quantas === 1) {
      texto = "1 linha selecionada";
    } else if (quantas > 1) {
      texto = quantas + " linhas selecionadas";
    }
    contagemLinhas.textContent = texto;
  }

  listaLinhas.addEventListener("change", atualizarContagem);
  atualizarContagem();

  function mostrarErro(campo, texto) {
    campo.classList.add("campo-invalido");
    campo.setAttribute("aria-invalid", "true");
    document.querySelector("#erro-" + campo.id).textContent = texto;
  }

  function limparErros() {
    campos.forEach(function (campo) {
      campo.classList.remove("campo-invalido");
      campo.removeAttribute("aria-invalid");
      document.querySelector("#erro-" + campo.id).textContent = "";
    });
  }

  campos.forEach(function (campo) {
    campo.addEventListener("input", limparErros);
  });

  formPonto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparErros();

    const nome = campoNome.value.trim();
    const endereco = campoEndereco.value.trim();
    let temErro = false;

    if (nome === "") {
      mostrarErro(campoNome, "Informe o nome do ponto.");
      temErro = true;
    }
    if (endereco === "") {
      mostrarErro(campoEndereco, "Informe o endereço.");
      temErro = true;
    }
    if (temErro) {
      document.querySelector(".campo-invalido").focus();
      return;
    }

    // Ids das linhas marcadas
    const linhasEscolhidas = [];
    listaLinhas.querySelectorAll("input:checked").forEach(function (caixa) {
      linhasEscolhidas.push(Number(caixa.value));
    });

    // Posição no mapa (null enquanto o mapa não marcar nada)
    let latitude = null;
    let longitude = null;
    if (campoLatitude.value !== "" && campoLongitude.value !== "") {
      latitude = Number(campoLatitude.value);
      longitude = Number(campoLongitude.value);
    }

    const pontos = carregarPontos();

    if (pontoEmEdicao === null) {
      let maior = 0;
      pontos.forEach(function (p) {
        if (p.id > maior) {
          maior = p.id;
        }
      });
      pontos.push({
        id: maior + 1,
        nome: nome,
        endereco: endereco,
        linhas: linhasEscolhidas,
        latitude: latitude,
        longitude: longitude,
      });
      sessionStorage.setItem(
        "avisoPontos",
        "Ponto " + nome + " cadastrado com sucesso.",
      );
    } else {
      const alvo = pontos.find(function (p) {
        return p.id === pontoEmEdicao.id;
      });
      alvo.nome = nome;
      alvo.endereco = endereco;
      alvo.linhas = linhasEscolhidas;
      alvo.latitude = latitude;
      alvo.longitude = longitude;
      sessionStorage.setItem(
        "avisoPontos",
        "Ponto " + nome + " atualizado com sucesso.",
      );
    }

    salvarPontos(pontos);
    window.location.href = "pontos.html";
  });
}
