// Centro aproximado de Canoas: [latitude, longitude].
const mapa = L.map("mapa", {
  zoomControl: false,
}).setView([-29.9177, -51.1833], 14);

L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">' +
      "OpenStreetMap</a> contributors",
  }
).addTo(mapa);

L.control.zoom({
  position: "topright",
}).addTo(mapa);

// Dados fictícios para testar a interface.
// Substituir por pontos e coordenadas verificados.
const pontos = [
  {
    id: 1,
    nome: "Estação Canoas",
    endereco: "Av. Guilherme Schell, Centro, Canoas",
    latitude: -29.9170724,
    longitude: -51.1828401,
    linhas: ["5000 Mathias Velho / Santos Dias", "5001 Florianópolis / Centro"],
  },

  {
    id: 2,
    nome: "Golden Center",
    endereco: "Rua Tiradentes, 381, Centro, Canoas",
    latitude: -29.9188584,
    longitude: -51.1817566,
    linhas: ["Box A", "Box B"],
  },

  {
    id: 3,
    nome: "Conjunto Comercial",
    endereco: "Rua Quinze de Janeiro, 481, Centro, Canoas",
    latitude: -29.91655,
    longitude: -51.17891,
    linhas: ["5100 L2 / Centro", "5107 L1 / Ideal / Canoas Shopping"],
  }
];

const painel = document.querySelector("#detalhes-ponto");

function abrirDetalhes(ponto) {
  document.querySelector("#nome-ponto").textContent = ponto.nome;
  document.querySelector("#endereco-ponto").textContent =
    ponto.endereco;

  document.querySelector("#linhas-ponto").textContent =
    `Linhas que passam aqui: ${ponto.linhas.join(", ")}`;

  painel.hidden = false;
}

const iconePonto = L.icon({
  iconUrl: "assets/pin-onibus.png",

  iconSize: [32, 32],
  iconAnchor: [16, 42],
  tooltipAnchor: [0, -42],
});

pontos.forEach((ponto) => {
  const marcador = L.marker(
    [ponto.latitude, ponto.longitude],
    {
      icon: iconePonto,
      title: ponto.nome,
      alt: ponto.nome,
    }
  ).addTo(mapa);

  marcador.bindTooltip(ponto.nome);

  marcador.on("click", () => {
    abrirDetalhes(ponto);
  });
});

document
  .querySelector("#fechar-detalhes")
  .addEventListener("click", () => {
    painel.hidden = true;
  });

// Ajusta a posição dos créditos quando o painel muda de altura.
new ResizeObserver(() => {
  document.querySelector(".mapa-area").style.setProperty(
    "--altura-painel",
    `${painel.getBoundingClientRect().height + 8}px`
  );
}).observe(painel);