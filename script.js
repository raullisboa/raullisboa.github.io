// Função para mostrar a notificação
function mostrarNotificacao(tipo, horas, minutos){
  const titulo = `Hora do ${tipo}!`;
  const opcoes = {
    body: `São ${horas}:${minutos}. Não se esqueça do ${tipo}!`
  };
  new Notification(titulo, opcoes);

}
// Função para verificar o horário
function verificarHorario(){
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();

  // Verifica horário para chamar a notificação
  if (horas === 8 && minutos === 54){
    mostrarNotificacao("Café", horas, minutos);
  } else if (horas === 11 && minutos === 29){
    mostrarNotificacao("Almoço", horas, minutos);
  }
}
//////////////////////////////////////////////////////////////
// Função para verificar o horário
function verificarHorario2(){
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();

  // Verifica horário para chamar a notificação
  if (horas === 8 && minutos === 55){
    mostrarNotificacao("Café", horas, minutos);
  } else if (horas === 11 && minutos === 30){
    mostrarNotificacao("Almoço", horas, minutos);
  }
}
//////////////////////////////////////////////////////////////


// Verifica o horário de tempo em tempo (60000 milissegundos = 1 minuto)
setInterval(verificarHorario2, 30000);

function adicionarLembrete(){
  let inputLembrete = document.getElementById("inputLembrete").value.trim();

  // Se o valor do input estiver vazio, exibe um alerta e sai da função
  if (!inputLembrete) {
    alert('Insira um lembrete');
    return;
  }

  let criarLi = document.createElement("li")
  criarLi.innerHTML = `${inputLembrete} <img onclick="deletarLembrete(this)" src="./x.png" width="15px" height="15px">`
  document.getElementById("listaDeLembretes").appendChild(criarLi)
  document.getElementById("inputLembrete").value = ""

  // Armazenar no localStorage
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas.push({lembrete: inputLembrete});
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
// Carregar do localStorage
function carregarLembretes(){
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  tarefas.forEach(function(tarefa) {
    let criarLi = document.createElement("li");
    criarLi.innerHTML = `${tarefa.lembrete} <img onclick="deletarLembrete(this)" src="./x.png" width="15px" height="15px">`;
    document.getElementById("listaDeLembretes").appendChild(criarLi);
  });
}

window.onload = function(){
  carregarLembretes();
}

// Função para deletar Lembretes
function deletarLembrete(li) {
  li.parentElement.remove();

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  let lembreteTexto = li.parentElement.textContent.trim();

  tarefas = tarefas.filter(tarefa => tarefa.lembrete !== lembreteTexto);

  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função para adicionar um item ao pressionar a tecla Enter
function adicionarComEnter(event) {
  if (event.key === "Enter") {
    adicionarLembrete();
  }
}
// Monitorar clique do botão para adicionar a tarefa
const adicionarTarefa = document.querySelector('.buttonAddTask')
adicionarTarefa.addEventListener('click', () => {
  adicionarLembrete()
})
