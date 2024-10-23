// Função para formatar a data para o padrão brasileiro (DD/MM/AAAA)
function formatarDataBrasileira(dataISO) {
  const partesData = dataISO.split("-");
  if (partesData.length === 3) {
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
  }
  return dataISO;
}

// Função para transformar a data do formato brasileiro para o formato ISO (AAAA-MM-DD)
function formatarDataISO(dataBR) {
  const partesData = dataBR.split("/");
  if (partesData.length === 3) {
    return `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
  }
  return dataBR;
}

// Função para formatar valores monetários para o padrão brasileiro
function formatarValorParaBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Variáveis globais para armazenar os totais
let totalDinheiro = 0;
let totalMoedas = 0;
let totalTroco = 0;
let totalCartao = 0;
let totalVale = 0;
let totalPix = 0;
let totalResgate = 0;
let totalSuprimento = 0;
let totalGeral = 0;

// Função para ler arquivos CSV e ordenar os dados pela data (mais recente primeiro)
function lerArquivosCSV() {
  const fileInput = document.getElementById("fileInput");
  const files = fileInput.files;
  const tabelaCorpo = document
    .getElementById("tabelaResultados")
    .getElementsByTagName("tbody")[0];

  // Array para armazenar todas as linhas dos arquivos CSV
  let todasAsLinhas = [];

  // Resetar os totais antes de processar novos arquivos
  totalDinheiro = 0;
  totalMoedas = 0;
  totalTroco = 0;
  totalCartao = 0;
  totalVale = 0;
  totalPix = 0;
  totalResgate = 0;
  totalSuprimento = 0;
  totalGeral = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (event) {
      const conteudo = event.target.result;
      const linhas = conteudo.split("\n");

      for (let j = 1; j < linhas.length; j++) {
        const dados = linhas[j].split(";");
        if (dados.length === 12) {
          todasAsLinhas.push(dados);

          const dinheiroTotal = parseFloat(
            dados[2].replace(/\./g, "").replace(",", ".")
          );
          const moedasTotal = parseFloat(
            dados[3].replace(/\./g, "").replace(",", ".")
          );
          const trocoTotal = parseFloat(
            dados[4].replace(/\./g, "").replace(",", ".")
          );
          const cartaoTotal = parseFloat(
            dados[5].replace(/\./g, "").replace(",", ".")
          );
          const valeTotal = parseFloat(
            dados[6].replace(/\./g, "").replace(",", ".")
          );
          const pixTotal = parseFloat(
            dados[7].replace(/\./g, "").replace(",", ".")
          );
          const resgateTotal = parseFloat(
            dados[8].replace(/\./g, "").replace(",", ".")
          );
          const suprimentoTotal = parseFloat(
            dados[9].replace(/\./g, "").replace(",", ".")
          );
          const valorTotal = parseFloat(
            dados[11].replace(/\./g, "").replace(",", ".")
          );

          if (!isNaN(dinheiroTotal)) totalDinheiro += dinheiroTotal;
          if (!isNaN(moedasTotal)) totalMoedas += moedasTotal;
          if (!isNaN(trocoTotal)) totalTroco += trocoTotal;
          if (!isNaN(cartaoTotal)) totalCartao += cartaoTotal;
          if (!isNaN(valeTotal)) totalVale += valeTotal;
          if (!isNaN(pixTotal)) totalPix += pixTotal;
          if (!isNaN(resgateTotal)) totalResgate += resgateTotal;
          if (!isNaN(suprimentoTotal)) totalSuprimento += suprimentoTotal;
          if (!isNaN(valorTotal)) totalGeral += valorTotal;
        }
      }

      todasAsLinhas.sort((a, b) => {
        const dataA = new Date(formatarDataISO(a[1]));
        const dataB = new Date(formatarDataISO(b[1]));
        return dataB - dataA;
      });

      tabelaCorpo.innerHTML = "";

      // Adicionar as linhas ordenadas à tabela
      todasAsLinhas.forEach((dados) => {
        const novaLinha = tabelaCorpo.insertRow();

        for (let k = 0; k < dados.length; k++) {
          const novaCelula = novaLinha.insertCell();

          // Verificar se o campo atual é a data (índice 1) e aplicar formatação
          if (k === 1) {
            novaCelula.textContent = formatarDataBrasileira(dados[k]);
          } else if (k >= 2 && k <= 9) {
            // Índices dos campos de valores monetários
            const valorFormatado = formatarValorParaBRL(
              parseFloat(dados[k].replace(/\./g, "").replace(",", "."))
            );
            novaCelula.textContent = valorFormatado;
          } else if (k === 10) {
            // Campo de "Obs" (observações), tratar quebras de linha
            novaCelula.innerHTML = dados[k].replace(/\n/g, "<br>"); // Substituir \n por <br>
          } else {
            novaCelula.textContent = dados[k];
          }
        }
      });

      // Exibir os totais formatados após o processamento
      document.getElementById("totalDinheiro").textContent =
        formatarValorParaBRL(totalDinheiro);
      document.getElementById("totalMoedas").textContent =
        formatarValorParaBRL(totalMoedas);
      document.getElementById("totalTroco").textContent =
        formatarValorParaBRL(totalTroco);
      document.getElementById("totalCartao").textContent =
        formatarValorParaBRL(totalCartao);
      document.getElementById("totalVale").textContent =
        formatarValorParaBRL(totalVale);
      document.getElementById("totalPix").textContent =
        formatarValorParaBRL(totalPix);
      document.getElementById("totalResgate").textContent =
        formatarValorParaBRL(totalResgate);
      document.getElementById("totalSuprimento").textContent =
        formatarValorParaBRL(totalSuprimento);
      document.getElementById("totalGeral").textContent =
        formatarValorParaBRL(totalGeral);
    };

    reader.readAsText(file);
  }
}

// Adicionar evento ao campo de entrada de arquivos
document.getElementById("fileInput").addEventListener("change", lerArquivosCSV);
