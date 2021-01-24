const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios.js");
const crearMensaje = require("../utils/utilidades.js");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  console.log("Usuario conectado");

  client.on("entrarChat", (data, callback) => {
    console.log(data);

    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

    client.join(data.sala); //conectamos el usuario a la SALA

    usuarios.agregarPersona(client.id, data.nombre, data.sala); //puse esto y dejo de tirarme error que callback no era una funcion
    /* console.log(personas); */ //difundimos a los usuarios. Le agregamos el to para que sea solo a los usuarios de la misma sala
    client.broadcast
      .to(data.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));

      client.broadcast
      .to(data.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${data.nombre} se unió`)
      ); 
    /* console.log(callback()) */
    callback(usuarios.getPersonasPorSala(data.sala));
  });

  client.on("crearMensaje", (data, callback) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
    
    

    callback(mensaje);
  });

  client.on("disconnect", () => {
    //Vamos a borrar la persona, asi al actualizar la pag, no me genera un nuevo elemento igual del usuario
    let personaBorrada = usuarios.borrarPersona(client.id);
    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${personaBorrada.nombre} acaba de salir`)
      );
    client.broadcast
      .to(personaBorrada.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
  });

  //Mensajes Privados
  client.on("mensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id);
    client.broadcast.to(data.para).emit(
      //El to sera para direccionar a un usuario especifico
      "mensajePrivado",
      crearMensaje(persona.nombre, data.mensaje)
    );
  });
});
