// ---------- Tela: lista de linhas ----------

const tabelaLinhas = document.querySelector("#tabela-linhas");
const cartoesLinhas = document.querySelector("#cartoes-linhas");
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

function desenharLista() {
  const todas = carregarLinhas();
  const termo = campoBusca.value.trim().toLowerCase();

  const filtradas = todas.filter(function (linha) {
    return (
      linha.numero.toLowerCase().includes(termo) ||
      linha.nome.toLowerCase().includes(termo)
    );
  });

  filtradas.sort(function (a, b) {
    return a.numero.localeCompare(b.numero, "pt-BR", { numeric: true });
  });

  let htmlTabela = "";
  let htmlCartoes = "";

  filtradas.forEach(function (linha) {
    htmlTabela += `
      <tr>
        <td class="tabela-numero">${escapar(linha.numero)}</td>
        <td class="tabela-nome">${escapar(linha.nome)}</td>
        <td class="tabela-itinerario">${escapar(linha.itinerario)}</td>
        <td>
          <div class="tabela-acoes">
            <a class="icone-botao" href="nova-linha.html?id=${linha.id}" aria-label="Editar linha ${escapar(linha.numero)}">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </a>
            <button type="button" class="icone-botao icone-botao-perigo" data-excluir="${linha.id}" aria-label="Excluir linha ${escapar(linha.numero)}">
              <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
            </button>
          </div>
        </td>
      </tr>`;

    htmlCartoes += `
      <article class="cartao">
        <span class="selo">${escapar(linha.numero)}</span>
        <h2 class="cartao-nome">${escapar(linha.nome)}</h2>
        <p class="cartao-itinerario">${escapar(linha.itinerario)}</p>
        <div class="cartao-acoes">
          <a class="botao-secundario" href="nova-linha.html?id=${linha.id}">Editar</a>
          <button type="button" class="botao-perigo-suave" data-excluir="${linha.id}">Excluir</button>
        </div>
      </article>`;
  });

  tabelaLinhas.innerHTML = htmlTabela;
  cartoesLinhas.innerHTML = htmlCartoes;

  const palavra =
    todas.length === 1 ? "linha cadastrada" : "linhas cadastradas";
  contador.textContent = todas.length + " " + palavra;

  let faixa = "0";
  if (filtradas.length > 0) {
    faixa = "1-" + filtradas.length;
  }
  resumoTabela.textContent =
    "Mostrando " + faixa + " de " + todas.length + " linhas";

  mensagemVazia.hidden = filtradas.length !== 0;
}

if (tabelaLinhas !== null) {
  campoBusca.addEventListener("input", desenharLista);
  desenharLista();

  // Aviso deixado pela tela de formulário (salvou ou atualizou)
  const avisoGuardado = sessionStorage.getItem("avisoLinhas");
  if (avisoGuardado !== null) {
    mostrarAviso(avisoGuardado);
    sessionStorage.removeItem("avisoLinhas");
  }
}

// ---------- Excluir linha (modal) ----------

const modalExcluir = document.querySelector("#modal-excluir");
let linhaParaExcluir = null;

if (modalExcluir !== null) {
  // Os botões "Excluir" são redesenhados a cada busca, então escutamos o clique
  // na página inteira e vemos se ele veio de um botão com data-excluir
  document.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-excluir]");
    if (botao === null) {
      return;
    }
    const id = Number(botao.dataset.excluir);
    const linha = carregarLinhas().find(function (l) {
      return l.id === id;
    });
    if (linha === undefined) {
      return;
    }
    linhaParaExcluir = linha;
    document.querySelector("#modal-titulo").textContent =
      "Excluir linha " + linha.numero + "?";
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

  // Clicar no fundo escuro também fecha
  modalExcluir.addEventListener("click", function (evento) {
    if (evento.target === modalExcluir) {
      modalExcluir.close();
    }
  });

  document
    .querySelector("#modal-confirmar")
    .addEventListener("click", function () {
      const restantes = carregarLinhas().filter(function (l) {
        return l.id !== linhaParaExcluir.id;
      });
      salvarLinhas(restantes);
      removerLinhaDosFavoritos(linhaParaExcluir.id);
      removerLinhaDosPontos(linhaParaExcluir.id);
      modalExcluir.close();
      desenharLista();
      mostrarAviso("Linha " + linhaParaExcluir.numero + " excluída.");
    });
}

// ---------- Tela: nova linha / editar linha ----------

const formLinha = document.querySelector("#form-linha");

if (formLinha !== null) {
  const campoNumero = document.querySelector("#numero");
  const campoNome = document.querySelector("#nome");
  const campoItinerario = document.querySelector("#itinerario");
  const avisoLateral = document.querySelector("#aviso-lateral");
  const campos = [campoNumero, campoNome, campoItinerario];

  // Modo edição: a URL vem assim: nova-linha.html?id=2
  const parametros = new URLSearchParams(window.location.search);
  const idTexto = parametros.get("id");
  let linhaEmEdicao = null;

  if (idTexto !== null) {
    const encontrada = carregarLinhas().find(function (l) {
      return l.id === Number(idTexto);
    });

    if (encontrada === undefined) {
      window.location.replace("linhas.html");
    } else {
      linhaEmEdicao = encontrada;
      campoNumero.value = encontrada.numero;
      campoNome.value = encontrada.nome;
      campoItinerario.value = encontrada.itinerario;
      document.querySelector("#titulo-pagina").textContent = "Editar linha";
      document.querySelector("#subtitulo-pagina").textContent =
        "Atualize os dados da linha.";
      document.querySelector("#botao-salvar").textContent = "Salvar alterações";
      document.title = "Editar linha · Canoas Bus";
    }
  }

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
    avisoLateral.classList.remove("visivel");
  }

  // Ao digitar, o erro some
  campos.forEach(function (campo) {
    campo.addEventListener("input", limparErros);
  });

  formLinha.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparErros();

    const numero = campoNumero.value.trim();
    const nome = campoNome.value.trim();
    const itinerario = campoItinerario.value.trim();
    let temErro = false;

    if (numero === "") {
      mostrarErro(campoNumero, "Informe o número da linha.");
      temErro = true;
    }
    if (nome === "") {
      mostrarErro(campoNome, "Informe o nome da linha.");
      temErro = true;
    }
    if (itinerario === "") {
      mostrarErro(campoItinerario, "Informe o itinerário.");
      temErro = true;
    }
    if (temErro) {
      document.querySelector(".campo-invalido").focus();
      return;
    }

    const linhas = carregarLinhas();

    // Número repetido (ignora a própria linha, no caso de edição)
    const duplicada = linhas.some(function (l) {
      const mesmoNumero = l.numero.toLowerCase() === numero.toLowerCase();
      const outraLinha = linhaEmEdicao === null || l.id !== linhaEmEdicao.id;
      return mesmoNumero && outraLinha;
    });

    if (duplicada) {
      mostrarErro(campoNumero, "Número já cadastrado");
      document.querySelector("#aviso-numero").textContent = numero;
      document.querySelector("#aviso-texto").textContent =
        "Já existe uma linha com o número " +
        numero +
        ". Use outro número ou edite a linha cadastrada.";
      avisoLateral.classList.add("visivel");
      campoNumero.focus();
      return;
    }

    if (linhaEmEdicao === null) {
      let maior = 0;
      linhas.forEach(function (l) {
        if (l.id > maior) {
          maior = l.id;
        }
      });
      linhas.push({
        id: maior + 1,
        numero: numero,
        nome: nome,
        itinerario: itinerario,
      });
      sessionStorage.setItem(
        "avisoLinhas",
        "Linha " + numero + " cadastrada com sucesso.",
      );
    } else {
      const alvo = linhas.find(function (l) {
        return l.id === linhaEmEdicao.id;
      });
      alvo.numero = numero;
      alvo.nome = nome;
      alvo.itinerario = itinerario;
      sessionStorage.setItem(
        "avisoLinhas",
        "Linha " + numero + " atualizada com sucesso.",
      );
    }

    salvarLinhas(linhas);
    window.location.href = "linhas.html";
  });
}
