const io = require('socket.io')(3000)
const users = {}

//when each user connects, the user is now 'socket'
io.on('connection', socket => {

    var userst = io.engine.clientsCount
    socket.emit('users', userst)

    //when it connects, it sends "chat-message" and the value hello world
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)   
    })

    //in script.js, when it sends a message the server
    //receives it as message parameter 
    socket.on('send-chat-message', message => {
        //sends the message to everyone EXCEPT the author
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    socket.on('typing', name => {
        socket.broadcast.emit('typing', name)
    })

    socket.on('stopped-typing', stoppedname => {
        socket.broadcast.emit('has-stopped', stoppedname)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

})

