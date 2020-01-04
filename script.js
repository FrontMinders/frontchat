const name = prompt("Ingresa tu nombre:")

const socket = io('http://localhost:3000')
const messageForm = document.getElementById("send-container")
const messageContainer = document.getElementById("message-container")
const messageInput = document.getElementById("message-input")
const photo = document.getElementById("photo")
const arrow = document.getElementById("arrow")
const sendButton = document.getElementById("send-button")

const audio = document.getElementById("audio")

var messageElementType
var passed
var counter = 1

arrow.addEventListener('click', () => {
    return location.reload()
})

console.log("---------------------")
console.log("---Coded by NathanO--")
console.log("---------------------")
console.warn("Prohibida la reproducción parcial o total de éste producto")

if(name == null || name == undefined || name == ""){
    passed = false
    error()
} else {
    passed = true
}

function error(){
    alert("Error: El nombre debe de contener caracteres.")
    arrow.style.display = "block"
    sendButton.innerText = "Error"
    sendButton.addEventListener('click', function(){
        alert("Necesitas ingresar tu nombre")
    })
    return passed = false
}

if(passed == true){
    sendButton.innerText = `Enviar como ${name}`
    appendMessageM(`Te has unido como: ${name}`)
    socket.emit('new-user', name)
}

if(passed == true){
    socket.on('users', userst => {
        const messageElement = document.createElement('div')
        if(userst >= 3){
            messageElement.innerText = `Hay otros ${userst - 1} usuarios conectados`
        } else if(userst == 2){
            messageElement.innerText = `Hay otro usuario conectado`
        } else if(userst == 1){
            messageElement.innerText = `No hay ningún otro usuario conectado`
        }
        messageElement.style.background = "rgb(61, 197, 197)"
        messageElement.style.color = "white"
        messageContainer.append(messageElement)
    })
}

//it receives chat message from server and "data" is the hello world
socket.on('chat-message', data => {
    appendMessageO(`${data.name}: ${data.message}`)
    photo.style.display = "block"
    setTimeout(function(){
        photo.style.display = "none"
    }, 3000)
    audio.play()
    //restart the note if necessary
    audio.currentTime = 0
})

socket.on('user-connected', name => {
    appendMessageM(`${name} se ha unido`)
})


socket.on('user-disconnected', name => {
    appendMessageM(`${name} se ha ido`)
})

if(passed == true){
    messageForm.addEventListener('keypress', () => {
        socket.emit('typing', name)
        const message = messageInput.value
        if(message.length < 1){
            socket.emit('stopped-typing', name)
        }
    })
}

socket.on('has-stopped', stname => {
    const typingId = document.getElementById("typeid");
    document.getElementById("message-container").removeChild(typingId);
    counter = 1
})

if(passed == true){
    socket.on('typing', username => {
        if(counter == 1){
            messageElementType = document.createElement('div')
            messageElementType.innerText = `${username} está escribiendo...`
            messageElementType.style.background = "rgb(78, 170, 170)"
            messageElementType.style.color = "white"
            messageElementType.setAttribute('id', 'typeid');
            messageContainer.append(messageElementType)
        }
        counter = 2
        socket.on('chat-message', data => {
            const typingId = document.getElementById("typeid");
            document.getElementById("message-container").removeChild(typingId);
            counter = 1
        })
    })
} else {
    console.log("Error: No ingresó nombre de usuario")
}

if(passed == true){
    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        //it sends the signal send chat message and sends const message
        //as the parameter
        if(message.length < 1){
            return alert("¡Tu mensaje debe contener texto!")
        } else if(message.length > 630){
            return alert("Tu mensaje no puede tener más de 630 caracteres. Actualmente tienes "+message.length+" caracteres.")
        }
        appendMessageA(`Tú: ${message}`)
        photo.style.display = "block"
        socket.emit('send-chat-message', message)
        messageInput.value = ""
        setTimeout(function(){
            photo.style.display = "none"
        }, 4000)
    })
}

// messageForm.addEventListener('keypress', () => {
//     socket.emit('typing', name)
// })

// socket.on('typing', datos => {
//     appendMessage(`${name} is typing...`)
// })

function appendMessageA(message){
    const messageElement = document.createElement('div')
    messageElement.style.background = "rgb(38, 95, 117)"
    messageElement.innerText = message
    messageElement.style.color = "white"
    messageContainer.append(messageElement)
}

function appendMessageO(message){
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.style.background = "rgb(21, 149, 172)"
    messageContainer.append(messageElement)
}

function appendMessageM(message){
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.style.background = "rgb(152, 207, 207)"
    messageElement.style.color = "white"
    messageContainer.append(messageElement)
}