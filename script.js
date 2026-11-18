// Elementos da página
const campoSenha = document.querySelector("#senha");
const botaoMostrarSenha = document.querySelector(".botao-mostrar-senha");
const iconeOlho = botaoMostrarSenha.querySelector("i");

// Mostrar / esconder senha
botaoMostrarSenha.addEventListener("click", function () {
  if (campoSenha.type === "password") {
    // Estava escondida: mostra
    campoSenha.type = "text";
    iconeOlho.classList.remove("fa-eye");
    iconeOlho.classList.add("fa-eye-slash");
    botaoMostrarSenha.setAttribute("aria-label", "Esconder senha");
  } else {
    // Estava visível: esconde
    campoSenha.type = "password";
    iconeOlho.classList.remove("fa-eye-slash");
    iconeOlho.classList.add("fa-eye");
    botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
  }
});

// ---------- Funções de apoio ----------

// Lê a lista de usuários guardada no navegador
function carregarUsuarios() {
  const salvo = localStorage.getItem("usuarios");
  let usuarios = [];
  if (salvo !== null) {
    usuarios = JSON.parse(salvo);
  }

  // Garante que o administrador de demonstração sempre exista
  const temAdmin = usuarios.some(function (u) {
    return u.email === "admin@canoasbus.com";
  });
  if (!temAdmin) {
    usuarios.push({
      nome: "Administrador",
      email: "admin@canoasbus.com",
      senha: "admin12345",
      perfil: "admin",
    });
  }

  return usuarios;
}

// Guarda a lista de usuários no navegador
function salvarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Mostra a mensagem acima do botão (tipo: "erro" ou "sucesso")
function mostrarMensagem(texto, tipo) {
  const mensagem = document.querySelector("#mensagem");
  mensagem.textContent = texto;
  mensagem.className = "mensagem mensagem-" + tipo;
}

// ---------- Cadastro (US01) ----------

const formCadastro = document.querySelector("#form-cadastro");

// Só roda na página de cadastro (no login esse elemento não existe)
if (formCadastro !== null) {
  formCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#e-mail").value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (nome === "" || email === "" || senha === "") {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }

    if (!email.includes("@")) {
      mostrarMensagem("Digite um e-mail válido.", "erro");
      return;
    }

    if (senha.length < 8) {
      mostrarMensagem("A senha precisa ter no mínimo 8 caracteres.", "erro");
      return;
    }

    const usuarios = carregarUsuarios();
    const jaExiste = usuarios.some(function (usuario) {
      return usuario.email === email;
    });

    if (jaExiste) {
      mostrarMensagem("Este e-mail já está cadastrado.", "erro");
      return;
    }

    usuarios.push({
      nome: nome,
      email: email,
      senha: senha,
      perfil: "cliente",
    });
    salvarUsuarios(usuarios);

    mostrarMensagem("Conta criada com sucesso!", "sucesso");
    formCadastro.reset();
  });
}

// ---------- Login (US02) ----------

const formLogin = document.querySelector("#form-login");

// Só roda na página de login
if (formLogin !== null) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = document.querySelector("#e-mail").value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (email === "" || senha === "") {
      mostrarMensagem("Preencha e-mail e senha.", "erro");
      return;
    }

    const usuarios = carregarUsuarios();
    const usuario = usuarios.find(function (u) {
      return u.email === email;
    });

    if (usuario === undefined || usuario.senha !== senha) {
      mostrarMensagem("E-mail ou senha incorretos.", "erro");
      return;
    }

    // Guarda quem entrou, pras outras telas saberem
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      }),
    );

    mostrarMensagem("Entrando...", "sucesso");

    // Redireciona conforme o perfil
    let destino = "mapa-cliente.html";
    if (usuario.perfil === "admin") {
      destino = "mapa-admin.html";
    }

    setTimeout(function () {
      window.location.href = destino;
    }, 800);
  });
}
