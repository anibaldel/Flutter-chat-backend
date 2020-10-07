const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controller/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // verificar Auntentificacion
    if (!valido) {return client.disconnect();}

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala particular
    // sala global, client.id, das4d6sd456d
    client.join(uid);

    // Escuchar de cliente el mensaje personal
    client.on('mensaje-personal', async (payload)=> {

        console.log(payload);

        // await grabarMensaje( payload );

        io.to(payload.para).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
