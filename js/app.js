
document.addEventListener("DOMContentLoaded", function () {
  inicializarPaginaInicial();
  inicializarPaginaAcervo();
  inicializarPaginaColecao();
  inicializarPaginaLeitor();
  inicializarPaginaNewsletter();
  inicializarPaginaContato();
  inicializarPaginaSobrePura();
});

function criarHtmlDoCartao(publicacao) {
  return `
    <article class="card cartao-edicao h-100 shadow-sm">
      <img src="${publicacao.imagem}" class="card-img-top imagem-capa-cartao" alt="Capa de ${publicacao.titulo}" onerror="this.src='img/capa-padrao.png'">
      <div class="card-body d-flex flex-column">
        <span class="badge bg-secondary mb-2 align-self-start">${publicacao.categoria} • ${publicacao.ano}</span>
        <h3 class="card-title h5">${publicacao.titulo}</h3>
        <p class="card-text flex-grow-1">${publicacao.resumo}</p>
        <a href="leitor.html?id=${publicacao.id}" class="btn btn-dark mt-3">Ler Edição</a>
      </div>
    </article>
  `;
}

function renderizarCartoesDePublicacoes(listaFiltrada, idContainerDestino) {
  const containerDestino = document.getElementById(idContainerDestino);
  if (!containerDestino) {
    return;
  }

  let htmlAcumulado = "";

  for (let indice = 0; indice < listaFiltrada.length; indice++) {
    const itemAtual = listaFiltrada[indice];
    htmlAcumulado += criarHtmlDoCartao(itemAtual);
  }

  if (listaFiltrada.length === 0) {
    containerDestino.innerHTML = `<div class="alert alert-warning">Nenhuma publicação encontrada para este filtro.</div>`;
  } else {
    containerDestino.innerHTML = htmlAcumulado;
  }
}

function inicializarPaginaInicial() {
  const gradeDestaques = document.getElementById("grade-destaques-home");
  if (gradeDestaques) {
    const tresPrimeirasEdicoes = listaDePublicacoesDoAcervo.slice(0, 3);
    renderizarCartoesDePublicacoes(tresPrimeirasEdicoes, "grade-destaques-home");
  }
}

function inicializarPaginaAcervo() {
  const containerAcervo = document.getElementById("lista-completa-acervo");
  const seletorCategoria = document.getElementById("filtro-categoria-acervo");
  const contadorResultados = document.getElementById("contador-edicoes-acervo");

  if (!containerAcervo) {
    return;
  }

  renderizarCartoesDePublicacoes(listaDePublicacoesDoAcervo, "lista-completa-acervo");
  if (contadorResultados) {
    contadorResultados.textContent = `Exibindo ${listaDePublicacoesDoAcervo.length} publicações no acervo.`;
  }

  if (seletorCategoria) {
    seletorCategoria.addEventListener("change", function () {
      const categoriaEscolhida = seletorCategoria.value;
      const listaFiltrada = [];

      for (let i = 0; i < listaDePublicacoesDoAcervo.length; i++) {
        if (categoriaEscolhida === "Todas" || listaDePublicacoesDoAcervo[i].categoria === categoriaEscolhida) {
          listaFiltrada.push(listaDePublicacoesDoAcervo[i]);
        }
      }

      renderizarCartoesDePublicacoes(listaFiltrada, "lista-completa-acervo");
      if (contadorResultados) {
        contadorResultados.textContent = `Exibindo ${listaFiltrada.length} publicações para "${categoriaEscolhida}".`;
      }
    });
  }
}

function inicializarPaginaColecao() {
  const containerColecao = document.getElementById("cartoes-colecao-tematica");
  const botoesDecada = document.querySelectorAll(".botao-filtro-decada");

  if (!containerColecao) {
    return;
  }

  renderizarCartoesDePublicacoes(listaDePublicacoesDoAcervo, "cartoes-colecao-tematica");

  for (let i = 0; i < botoesDecada.length; i++) {
    botoesDecada[i].addEventListener("click", function () {
      const decadaSelecionada = this.getAttribute("data-decada");
      const resultadoDecada = [];

      for (let j = 0; j < listaDePublicacoesDoAcervo.length; j++) {
        if (decadaSelecionada === "Todas" || listaDePublicacoesDoAcervo[j].decada === decadaSelecionada) {
          resultadoDecada.push(listaDePublicacoesDoAcervo[j]);
        }
      }

      renderizarCartoesDePublicacoes(resultadoDecada, "cartoes-colecao-tematica");
    });
  }
}

function inicializarPaginaLeitor() {
  const areaLeitura = document.getElementById("area-leitura-edicao");
  if (!areaLeitura) {
    return;
  }

  const parametrosUrl = new URLSearchParams(window.location.search);
  const idBuscado = parametrosUrl.get("id") || "mad-1963-01";
  let edicaoEncontrada = listaDePublicacoesDoAcervo[0];

  for (let i = 0; i < listaDePublicacoesDoAcervo.length; i++) {
    if (listaDePublicacoesDoAcervo[i].id === idBuscado) {
      edicaoEncontrada = listaDePublicacoesDoAcervo[i];
      break;
    }
  }

  let paginaAtual = 1;
  const totalPaginas = edicaoEncontrada.paginas || 24;
  const imagemPagina = document.getElementById("imagem-edicao-leitor");
  const indicadorPagina = document.getElementById("indicador-pagina-leitor");

  function atualizarPaginaVisualizada() {
    const numeroFormatado = String(paginaAtual).padStart(3, "0");
    imagemPagina.src = `img/revistas/${edicaoEncontrada.id}/p-${numeroFormatado}.webp`;
    if (indicadorPagina) {
      indicadorPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    }
  }

  document.getElementById("titulo-edicao-leitor").textContent = edicaoEncontrada.titulo;
  document.getElementById("meta-edicao-leitor").textContent = `${edicaoEncontrada.categoria} | Ano: ${edicaoEncontrada.ano} | Editora: ${edicaoEncontrada.editora}`;
  document.getElementById("texto-edicao-leitor").textContent = edicaoEncontrada.conteudoCompleto;
  atualizarPaginaVisualizada();

  const botaoAnterior = document.getElementById("botao-pagina-anterior");
  const botaoProxima = document.getElementById("botao-pagina-proxima");
  const somVirarPagina = new Audio("audio/virar-pagina.mp3");

  if (botaoAnterior) {
    botaoAnterior.addEventListener("click", function () {
      if (paginaAtual > 1) {
        paginaAtual -= 1;
        atualizarPaginaVisualizada();
        somVirarPagina.play().catch(function () {});
      }
    });
  }

  if (botaoProxima) {
    botaoProxima.addEventListener("click", function () {
      if (paginaAtual < totalPaginas) {
        paginaAtual += 1;
        atualizarPaginaVisualizada();
        somVirarPagina.play().catch(function () {});
      }
    });
  }

  const botaoAumentarFonte = document.getElementById("botao-aumentar-fonte");
  const paragrafoTexto = document.getElementById("texto-edicao-leitor");
  let tamanhoFonteAtual = 18;

  if (botaoAumentarFonte) {
    botaoAumentarFonte.addEventListener("click", function () {
      if (tamanhoFonteAtual < 24) {
        tamanhoFonteAtual += 2;
      } else {
        tamanhoFonteAtual = 16;
      }
      paragrafoTexto.style.fontSize = tamanhoFonteAtual + "px";
    });
  }
}

function inicializarPaginaNewsletter() {
  const formularioNewsletter = document.getElementById("form-cadastro-newsletter");
  const listaAssinantesSalvos = document.getElementById("lista-assinantes-localstorage");
  const botaoLimparStorage = document.getElementById("botao-limpar-assinantes");

  if (!formularioNewsletter) {
    return;
  }

  function atualizarListaNaTela() {
    const dadosGuardados = localStorage.getItem("assinantesBancaAtemporal");
    const listaAssinantes = dadosGuardados ? JSON.parse(dadosGuardados) : [];

    if (listaAssinantes.length === 0) {
      listaAssinantesSalvos.innerHTML = `<li class="list-group-item text-muted">Nenhum leitor cadastrado no navegador ainda.</li>`;
      return;
    }

    let itensHtml = "";
    for (let i = 0; i < listaAssinantes.length; i++) {
      itensHtml += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>${listaAssinantes[i].nome}</strong> (${listaAssinantes[i].email})</span>
          <span class="badge bg-dark">${listaAssinantes[i].interesse}</span>
        </li>
      `;
    }
    listaAssinantesSalvos.innerHTML = itensHtml;
  }

  atualizarListaNaTela();

  formularioNewsletter.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nomeDigitado = document.getElementById("input-nome-newsletter").value.trim();
    const emailDigitado = document.getElementById("input-email-newsletter").value.trim();
    const interesseEscolhido = document.getElementById("select-interesse-newsletter").value;

    const dadosGuardados = localStorage.getItem("assinantesBancaAtemporal");
    const listaAssinantes = dadosGuardados ? JSON.parse(dadosGuardados) : [];

    listaAssinantes.push({
      nome: nomeDigitado,
      email: emailDigitado,
      interesse: interesseEscolhido
    });

    localStorage.setItem("assinantesBancaAtemporal", JSON.stringify(listaAssinantes));
    formularioNewsletter.reset();
    atualizarListaNaTela();
  });

  if (botaoLimparStorage) {
    botaoLimparStorage.addEventListener("click", function () {
      localStorage.removeItem("assinantesBancaAtemporal");
      atualizarListaNaTela();
    });
  }
}

function inicializarPaginaContato() {
  const formularioContato = document.getElementById("form-contato-banca");
  const caixaAlertaFeedback = document.getElementById("alerta-envio-contato");

  if (!formularioContato) {
    return;
  }

  formularioContato.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nomeRemetente = document.getElementById("campo-nome-contato").value.trim();

    caixaAlertaFeedback.classList.remove("d-none");
    caixaAlertaFeedback.textContent = `Obrigado, ${nomeRemetente}! Sua mensagem foi validada e registrada com sucesso.`;
    formularioContato.reset();
  });
}

function inicializarPaginaSobrePura() {
  const botaoCuriosidade = document.getElementById("botao-curiosidade-pura");
  const caixaCuriosidade = document.getElementById("texto-curiosidade-pura");

  if (!botaoCuriosidade || !caixaCuriosidade) {
    return;
  }

  const curiosidades = [
    "A revista MAD nº 14 de 1954 popularizou a paródia visual na capa com a Mona Lisa.",
    "Nos anos 1980, revistas musicais como a Smash Hits funcionavam como a principal fonte de letras e pôsteres para jovens.",
    "Preservar revistas impressas permite estudar a evolução da tipografia, fotografia e cultura de cada década."
  ];
  let indiceCuriosidade = 0;

  botaoCuriosidade.addEventListener("click", function () {
    caixaCuriosidade.textContent = curiosidades[indiceCuriosidade];
    indiceCuriosidade = (indiceCuriosidade + 1) % curiosidades.length;
  });
}
