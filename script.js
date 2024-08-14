const meuUUID = 'f508c90c-c9e3-4032-9150-4d9e8a414630'
const linkParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants/" + meuUUID
const linkMessages = "https://mock-api.driven.com.br/api/v6/uol/messages/" + meuUUID
const linkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + meuUUID

const boxContainer = document.querySelector('main')
const inputElement = document.querySelector('.input')
const menu = document.querySelector('.button-menu')
const hiddenMenu = document.querySelector('.hidden-menu')

let selectedParticipant = "Todos"
let messageType = "message"

let mensagem = []
let texto = []

let nickName = prompt('Qual é seu nome?')

function askName() 
{
  const teste = 
  {
    name: nickName
  }

  axios.post(linkParticipants, teste).then(() => {
    mostrarMensagens()
  }).catch((erro) => {
    console.error("Erro ao registrar o nome", erro);
    alert("Não foi possível entrar na sala. Tente novamente.")
  })
}

function mostrarMensagens() 
{
  const promessa = axios.get(linkMessages);
  promessa.then(recibiresposta).catch((erro) => {
    console.error("Erro ao carregar mensagens", erro)
  })
}

function recibiresposta(resposta) 
{
  boxContainer.innerHTML = ''
  mensagem = resposta.data

    for(let i = 0; i < mensagem.length; i++) {
        let tipoMensagem = mensagem[i].type
        let textoMensagem = mensagem[i].text
        let from = mensagem[i].from
        let to = mensagem[i].to
        let time = mensagem[i].time

        
        if (tipoMensagem === "status") 
        {
            boxContainer.innerHTML += `
                <div class="box-container status-box">
                    <p class="mensagem"><span class="time">(${time})</span> <strong>${from}</strong> ${textoMensagem}</p>
                </div>
            `
        } 
        
        else if (tipoMensagem === "message") 
        {
            boxContainer.innerHTML += `
                <div class="box-container public-box">
                    <p class="mensagem"><span class="time">(${time})</span> <strong>${from}</strong> para <strong>${to}</strong>: ${textoMensagem}</p>
                </div>
            `
        } 
        
        else if (tipoMensagem === "private_message") 
        {
            if (from === nickName || to === nickName) 
            {
                boxContainer.innerHTML += `
                    <div class="box-container private-box">
                        <p class="mensagem"><span class="time">(${time})</span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${textoMensagem}</p>
                    </div>
                `
            }
        }
    }
  
    boxContainer.lastElementChild.scrollIntoView()
}




function enviarMensagem() 
{
  let novaMsg = inputElement.value

  const teste = {
    from: nickName,
    to: selectedParticipant,
    text: novaMsg,
    type: messageType
  };

  const promessa = axios.post(linkMessages, teste)
  promessa.then(mensagemEnviada)
  promessa.catch(erroEnviarMensagem)

  inputElement.value = ''
}

function mostrarParticipantes()
{
  const promessa = axios.get(linkParticipants);
  promessa.then(exibirParticipantes).catch((erro) => {
    console.error("Erro ao carregar participantes", erro);
  });
}

function exibirParticipantes(resposta) 
{
  const participantsContainer = document.querySelector('.choose-contact')
  const participants = resposta.data

  participantsContainer.innerHTML = `
    <h2>Escolha um contato <br> para enviar mensagem:</h2>
  `
  participantsContainer.innerHTML += `
    <div class="contact" data-name="Todos" onclick="selecionarParticipante(this)">
      <ion-icon name="people-sharp"></ion-icon>
      <p>Todos</p>
      <img src="img/Vector.png" alt="">
    </div>
  `

  participants.forEach(participant => {
    participantsContainer.innerHTML += `
      <div class="contact" data-name="${participant.name}" onclick="selecionarParticipante(this)">
        <ion-icon name="people-sharp"></ion-icon>
        <p>${participant.name}</p>
        <img src="img/Vector.png" alt="">
      </div>
    `
  })
}

function selecionarVisibilidade(element) 
{

  document.querySelectorAll('.visibility').forEach(visibility => {
      visibility.classList.remove('selected')
  })

  element.classList.add('selected')

  messageType = element.getAttribute('data-type') === "reservado" ? "private_message" : "message"

  atualizarFraseDestinatario()
}


function selecionarParticipante(element) 
{
  document.querySelectorAll('.contact').forEach(contact => {
      contact.classList.remove('selected')
  })
  

  element.classList.add('selected')

  selectedParticipant = element.getAttribute('data-name')

  atualizarFraseDestinatario()
}

function atualizarFraseDestinatario() 
{
  const fraseElemento = document.querySelector('.selected-participant-info')
  const visibilidade = messageType === "private_message" ? "Reservadamente" : "Público"
  fraseElemento.textContent = `Enviando para ${selectedParticipant} (${visibilidade})`
}

function mensagemEnviada()
{
  mostrarMensagens()
}

function erroEnviarMensagem(erro) 
{
  console.error("Erro ao enviar mensagem", erro);
  alert("Não foi possível enviar a mensagem. Tente novamente.")
}

function usuarioOnline() 
{
  const teste = 
  {
    name: nickName
  }

  axios.post(linkStatus, teste)
}

setInterval(mostrarMensagens, 3000)
setInterval(usuarioOnline, 5000)

askName()

menu.addEventListener('click', () => {
  hiddenMenu.classList.add('active')
})

hiddenMenu.addEventListener('click', (event) => {
  if (event.target === hiddenMenu) {
    hiddenMenu.classList.remove('active');
  }
})

menu.addEventListener('click', () => {
  hiddenMenu.classList.add('active')
  mostrarParticipantes()
})

