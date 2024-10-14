// Função para formatar valores
function formatarValor(valor) {
  return valor.toFixed(2).replace(".", ",");
}

// Adicionar valor nas listas e atualizar o resumo
function adicionarValor(elementId, inputId) {
  // Obter o valor do input e formatá-lo corretamente
  const inputValue = document
    .getElementById(inputId)
    .value.replace(".", "")
    .replace(",", ".");

  // Converte o valor em um número float
  const valorNumerico = parseFloat(inputValue);

  if (!isNaN(valorNumerico) && valorNumerico > 0) {
    const ul = document.getElementById(elementId);
    const li = document.createElement("li");

    // Cria o texto do item usando a função formatarValor
    li.textContent = formatarValor(valorNumerico);

    // Cria a imagem "X"
    const img = document.createElement("img");
    img.src = "x.png"; // Caminho para a imagem
    img.alt = "Remover";
    img.classList.add("remove-icon");

    // Adiciona evento de clique para remover o item
    img.onclick = function () {
      ul.removeChild(li);
      atualizarResumo(); // Atualiza o resumo após remover
    };

    // Adiciona a imagem ao item da lista
    li.appendChild(img);
    ul.appendChild(li);

    // Limpa o campo de entrada
    document.getElementById(inputId).value = "";

    // Atualizar o total no resumo
    atualizarResumo();
  } else {
    alert("Por favor, insira um valor válido.");
  }
}

function verificarEnter(event, listaId, inputId) {
  if (event.key === "Enter") {
    adicionarValor(listaId, inputId);
  }
}

// Atualiza os campos do resumo
function atualizarResumo() {
  // Captura os valores dos campos individuais
  const dinheiro =
    parseFloat(
      document
        .getElementById("dinheiro")
        .value.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const moedasC =
    parseFloat(
      document
        .getElementById("moedasC")
        .value.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const moedasB =
    parseFloat(
      document
        .getElementById("moedasB")
        .value.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const moedasPagar =
    parseFloat(
      document
        .getElementById("moedasPagar")
        .value.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const valorPago =
    parseFloat(
      document
        .getElementById("valorPago")
        .value.replace(".", "")
        .replace(",", ".")
    ) || 0;

  // Calcular total de cada lista (cartão, pix, vale, resgate)
  const totalCartao = calcularTotalDeLista("cartao");
  const totalVale = calcularTotalDeLista("vale");
  const totalPix = calcularTotalDeLista("pix");
  const totalResgate = calcularTotalDeLista("resgate");

  // Soma das moedas de cima e de baixo
  const totalMoedas = moedasC + moedasB;

  // Calcula o troco (valor pago - moedas a pagar)
  const troco = valorPago - moedasPagar;

  // Atualiza os valores no resumo
  document.getElementById("totalDinheiro").textContent =
    formatarValor(dinheiro);
  document.getElementById("totalMoedas").textContent =
    formatarValor(totalMoedas);
  document.getElementById("totalTroco").textContent = formatarValor(troco);
  document.getElementById("totalCartao").textContent =
    formatarValor(totalCartao);
  document.getElementById("totalVale").textContent = formatarValor(totalVale);
  document.getElementById("totalPix").textContent = formatarValor(totalPix);
  document.getElementById("totalResgate").textContent =
    formatarValor(totalResgate);

  // Atualiza o total geral (somatório de tudo)
  const totalGeral =
    dinheiro +
    totalMoedas +
    troco +
    totalCartao +
    totalVale +
    totalPix +
    totalResgate;
  document.getElementById("totalGeral").textContent = formatarValor(totalGeral);
}

// Função auxiliar para calcular total de uma lista
function calcularTotalDeLista(id) {
  const valores = document.querySelectorAll(`#${id} li`);
  let total = 0;
  valores.forEach((li) => {
    total += parseFloat(li.textContent.replace(".", "").replace(",", ".")) || 0; // Corrigido para considerar vírgula
  });
  return total;
}

// Função para salvar dados no localStorage
function salvarDados() {
  const nomeUsuario = document.getElementById("nomeUsuario").value;
  const dataSelecionada = document.getElementById("data").value;

  // Verifica se o nome do usuário está vazio
  if (!nomeUsuario) {
    alert("Por favor, insira seu nome.");
    return; // Interrompe a execução da função
  }

  if (dataSelecionada) {
    const dados = {
      nomeUsuario,
      dinheiro:
        parseFloat(
          document.getElementById("dinheiro").value.replace(",", ".")
        ) || "",
      moedasC:
        parseFloat(
          document.getElementById("moedasC").value.replace(",", ".")
        ) || "",
      moedasB:
        parseFloat(
          document.getElementById("moedasB").value.replace(",", ".")
        ) || "",
      moedasPagar:
        parseFloat(
          document.getElementById("moedasPagar").value.replace(",", ".")
        ) || "",
      valorPago:
        parseFloat(
          document.getElementById("valorPago").value.replace(",", ".")
        ) || "",
      cartao: Array.from(document.querySelectorAll("#cartao li")).map((li) =>
        parseFloat(li.textContent.replace(",", "."))
      ),
      pix: Array.from(document.querySelectorAll("#pix li")).map((li) =>
        parseFloat(li.textContent.replace(",", "."))
      ),
      vale: Array.from(document.querySelectorAll("#vale li")).map((li) =>
        parseFloat(li.textContent.replace(",", "."))
      ),
      resgate: Array.from(document.querySelectorAll("#resgate li")).map((li) =>
        parseFloat(li.textContent.replace(",", "."))
      ),
      suprimento:
        parseFloat(
          document.getElementById("suprimento").value.replace(",", ".")
        ) || "",
      obs: document.getElementById("obs").value,
    };

    localStorage.setItem(dataSelecionada, JSON.stringify(dados));
    alert("Dados salvos com sucesso!");
  } else {
    alert("Por favor, selecione uma data.");
  }
}

// Carregar dados do localStorage
function carregarDados() {
  const dataSelecionada = document.getElementById("data").value;

  if (dataSelecionada) {
    const dadosSalvos = JSON.parse(localStorage.getItem(dataSelecionada));

    if (dadosSalvos) {
      document.getElementById("nomeUsuario").value = dadosSalvos.nomeUsuario;

      // Converter os valores de volta para números antes de definir nos inputs
      document.getElementById("dinheiro").value = dadosSalvos.dinheiro
        .toString()
        .replace(".", ",");
      document.getElementById("moedasC").value = dadosSalvos.moedasC
        .toString()
        .replace(".", ",");
      document.getElementById("moedasB").value = dadosSalvos.moedasB
        .toString()
        .replace(".", ",");
      document.getElementById("moedasPagar").value = dadosSalvos.moedasPagar
        .toString()
        .replace(".", ",");
      document.getElementById("valorPago").value = dadosSalvos.valorPago
        .toString()
        .replace(".", ",");
      document.getElementById("suprimento").value = dadosSalvos.suprimento
        .toString()
        .replace(".", ",");
      document.getElementById("obs").value = dadosSalvos.obs.toString();

      // Limpar as listas antes de carregar novos dados
      ["cartao", "pix", "vale", "resgate"].forEach((id) => {
        const ul = document.getElementById(id);
        ul.innerHTML = "";

        dadosSalvos[id].forEach((valor) => {
          const li = document.createElement("li");
          li.textContent = formatarValor(valor);

          // Cria a imagem "X"
          const img = document.createElement("img");
          img.src = "x.png"; // Caminho para a imagem
          img.alt = "Remover";
          img.classList.add("remove-icon");

          // Adiciona evento de clique para remover o item
          img.onclick = function () {
            ul.removeChild(li);
            atualizarResumo(); // Atualiza o resumo após remover
          };

          // Adiciona a imagem ao item da lista
          li.appendChild(img);
          ul.appendChild(li);
        });
      });

      atualizarResumo(); // Atualizar o resumo com os dados carregados
    } else {
      // Desabilitar temporariamente o evento de mudança de data
      document
        .getElementById("data")
        .removeEventListener("change", carregarDados);

      // Limpa os campos se não houver dados
      document.getElementById("nomeUsuario").value = "";
      document.getElementById("dinheiro").value = "";
      document.getElementById("moedasC").value = "";
      document.getElementById("moedasB").value = "";
      document.getElementById("moedasPagar").value = "";
      document.getElementById("valorPago").value = "";
      document.getElementById("suprimento").value = "";
      document.getElementById("obs").value = "";

      // Limpar as listas
      ["cartao", "pix", "vale", "resgate"].forEach((id) => {
        const ul = document.getElementById(id);
        ul.innerHTML = "";
      });
      // Limpar o resumo
      document.getElementById("totalDinheiro").textContent = "00,00";
      document.getElementById("totalMoedas").textContent = "00,00";
      document.getElementById("totalTroco").textContent = "00,00";
      document.getElementById("totalCartao").textContent = "00,00";
      document.getElementById("totalVale").textContent = "00,00";
      document.getElementById("totalPix").textContent = "00,00";
      document.getElementById("totalResgate").textContent = "00,00";
      document.getElementById("totalGeral").textContent = "00,00";

      // Alerta sempre que não houver dados
      alert("Nenhum dado encontrado para esta data.");

      // Reativar o evento de mudança de data
      setTimeout(() => {
        document
          .getElementById("data")
          .addEventListener("change", carregarDados);
      }, 100);
    }
  } else {
    alert("Por favor, selecione uma data.");
  }
  carregarMoedasAnterior();
}

// Função para limpar os dados da tela e do localStorage para a data selecionada
function limparDados() {
  const dataSelecionada = document.getElementById("data").value;

  if (!dataSelecionada) {
    alert("Por favor, selecione uma data antes de limpar os dados.");
    return;
  }

  // Limpar os campos de entrada
  document.getElementById("nomeUsuario").value = "";
  document.getElementById("dinheiro").value = "";
  document.getElementById("moedasC").value = "";
  document.getElementById("moedasB").value = "";
  document.getElementById("moedasPagar").value = "";
  document.getElementById("valorPago").value = "";
  document.getElementById("suprimento").value = "";
  document.getElementById("obs").value = "";

  // Limpar as listas
  ["cartao", "pix", "vale", "resgate"].forEach((id) => {
    const ul = document.getElementById(id);
    ul.innerHTML = ""; // Limpa os itens da lista
  });

  // Limpar o resumo
  document.getElementById("totalDinheiro").textContent = "00,00";
  document.getElementById("totalMoedas").textContent = "00,00";
  document.getElementById("totalTroco").textContent = "00,00";
  document.getElementById("totalCartao").textContent = "00,00";
  document.getElementById("totalVale").textContent = "00,00";
  document.getElementById("totalPix").textContent = "00,00";
  document.getElementById("totalResgate").textContent = "00,00";
  document.getElementById("totalGeral").textContent = "00,00";

  // Remover os dados do localStorage para a data selecionada
  localStorage.removeItem(dataSelecionada);

  alert("Os dados relacionados à data selecionada foram limpos.");
}

// Adicione um evento ao botão de salvar
document.getElementById("salvarButton").addEventListener("click", salvarDados);

// Adicione um evento ao campo de data
document.getElementById("data").addEventListener("change", carregarDados);

function formatarNumeroInput(input) {
  let valor = input.value;

  // Remove tudo que não seja número
  valor = valor.replace(/[^\d]/g, "");

  // Adiciona a vírgula antes dos dois últimos dígitos
  if (valor.length > 2) {
    valor = valor.slice(0, -2) + "," + valor.slice(-2);
  }

  // Adiciona os pontos como separadores de milhar
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Atualiza o valor no input
  input.value = valor;
}

// Função para salvar dados em um arquivo CSV
function salvarDadosCSV() {
  const nomeUsuario = document.getElementById("nomeUsuario").value;
  const dataSelecionada = document.getElementById("data").value;

  // Captura os valores do resumo do suprimento e do campo obs
  const dinheiro =
    parseFloat(
      document
        .getElementById("totalDinheiro")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const moedas =
    parseFloat(
      document
        .getElementById("totalMoedas")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const troco =
    parseFloat(
      document
        .getElementById("totalTroco")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const cartao =
    parseFloat(
      document
        .getElementById("totalCartao")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const vale =
    parseFloat(
      document
        .getElementById("totalVale")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const pix =
    parseFloat(
      document
        .getElementById("totalPix")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const resgate =
    parseFloat(
      document
        .getElementById("totalResgate")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;
  const tSuprimento =
    parseFloat(document.getElementById("suprimento").value) || 0;

  // Substitui quebras de linha por espaço em branco
  const obs =
    (document.getElementById("obs").value || "").replace(/\n/g, " ") || "";

  const total =
    parseFloat(
      document
        .getElementById("totalGeral")
        .textContent.replace(".", "")
        .replace(",", ".")
    ) || 0;

  // Cria a string CSV
  const csvContent =
    `Nome;Data;Dinheiro;Moedas;Troco;Cartão;Vale;Pix;Resgate;Suprimento;Obs;Total\n` +
    `${nomeUsuario};${dataSelecionada};${formatarValor(
      dinheiro
    )};${formatarValor(moedas)};${formatarValor(troco)};` +
    `${formatarValor(cartao)};${formatarValor(vale)};${formatarValor(
      pix
    )};${formatarValor(resgate)};${formatarValor(
      tSuprimento
    )};${obs};${formatarValor(total)}`;

  // Cria um blob com o conteúdo CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Cria um link e clica nele para iniciar o download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${nomeUsuario}_${dataSelecionada}.csv`); // Nome do arquivo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Remove o link após o download
}

document.addEventListener("DOMContentLoaded", function () {
  const campoData = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  campoData.value = hoje;

  carregarDados(); // Isso já vai carregar os dados salvos para a data atual

  // Chama a função para carregar as moedas do dia anterior
  carregarMoedasAnterior();
});

function carregarMoedasAnterior() {
  const campoData = document.getElementById("data").value;
  const dataAtual = new Date(campoData);

  // Subtrai um dia para pegar o dia anterior
  const diaAnterior = new Date(dataAtual);
  diaAnterior.setDate(diaAnterior.getDate() - 1);

  // Converte a data anterior para o formato YYYY-MM-DD
  const diaAnteriorFormatado = diaAnterior.toISOString().split("T")[0];

  // Verifica se há dados para o dia anterior no localStorage
  const dadosAnteriores = JSON.parse(
    localStorage.getItem(diaAnteriorFormatado)
  );

  if (dadosAnteriores) {
    // Se existir dados, busca os valores de moedasC e moedasB
    const moedasC = parseFloat(dadosAnteriores.moedasC) || 0; // Converte para número, garantindo que não seja NaN
    const moedasB = parseFloat(dadosAnteriores.moedasB) || 0; // Converte para número, garantindo que não seja NaN

    // Calcula a soma
    const totalMoedas = moedasC + moedasB;

    // Atualiza o campo de "moedas a pagar"
    document.getElementById("moedasPagar").value = totalMoedas
      .toString()
      .replace(".", ",");
  } else {
    // Se não houver dados para o dia anterior, deixa o campo vazio ou com valor padrão
    document.getElementById("moedasPagar").value = "";
  }
  atualizarResumo();
}
