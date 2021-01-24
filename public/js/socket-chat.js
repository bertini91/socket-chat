var socket = io();

var params = new URLSearchParams(window.location.search); //asignamos los parametros

if (!params.has("nombre") || !params.has("sala")) {
  //consultamos si viene un parametro como nombre
  window.location = "index.html"; //direccionamos al index.hjtml
  throw new Error("El nombre y la sala son necesarios ");
}

var usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");
  socket.emit("entrarChat", usuario, function (resp) {
    console.log("Usuarios conectados ", resp);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
/* socket.emit(
  "crearMensaje",
  {
    usuario: "Fernando",
    mensaje: "Hola Mundo",
  },
  function (resp) {
    console.log("respuesta server: ", resp);
  }
); */

// Escuchar información
socket.on("crearMensaje", function (mensaje) {
  console.log("Servidor:", mensaje);
});

//Escuchar cambios de usuario. Cuando un usuario entra o sale del chat
socket.on("listaPersona", function (persona) {
  console.log(persona);
});

//MEnsajes privados
socket.on("mensajePrivado", function (mensaje) {
  console.log("Mensaje Privado: ", mensaje);
});
