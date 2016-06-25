/*
 * SERVICIO TELNET EMULADO
 * mediante socket TCP
 * Se parte del ejemplo:
 * http://www.davidmclifton.com/2011/07/22/simple-telnet-server-in-node-js/
 */
//Modulos necesarios
var net = require('net');
var fs = require('fs');
var colors = require('colors');
//Sockets activos
var sockets = [];
/*
 * VARIABLES DE CONTROL
 */
//Controla es estado de la sesión
var estado = 0;
//Numero de archivos creados en la sesión
var nTouchs = 0;
//Número maximo de archivos creados permitidos
var umbralNTouch = 2;
//Rutas de los archivos creados
var ficherosTouch = [];
//Numero de carpetas creadas en la sesión
var nMkdir = 0;
//Rutas de las carpetas creadas
var carpetasMkdir = [];
/*
 * Los usuarios acceden a un lugar aislado de memoria: carpeta emulatedStorage.
 * Se puede navegar por esta carpeta pero no se puede salir de ella por motivos de seguridad. 
 */
var pathAbsoluto = "./emulatedStorage/";
var pathRelativo = "./emulatedStorage/";
var profundidadPath = 2;
//Control explusados. Guarda la IP de los clientes expuldados
var expulsados = [];

/*
 * BASE DE DATOS
 */
 var Datastore = require('nedb');
 var db = new Datastore({
  filename: '../../BaseDatos/logs.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

function saveLogtoDB(remoteIP, remotePort, serverIP, serverPort, cleanData){
  var log = {
    Servicio: "Telnet",
    AtacanteIP: remoteIP,
    AtacantePuerto: remotePort,
    ServerIP: serverIP,
    ServerPuerto: serverPort,
    Comando: cleanData
    };
  // Save this goal to the database.
  db.insert(log, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
};

  var expulsadosDB = new Datastore({
  filename: '../../BaseDatos/exulsados.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

function saveLogtoDBExplusado(remoteIP, remotePort, serverIP, serverPort){
  var log = {
    Servicio: "Telnet",
    AtacanteIP: remoteIP,
    AtacantePuerto: remotePort,
    ServerIP: serverIP,
    ServerPuerto: serverPort,
    Comando: "Explusado"
    };
  // Save this goal to the database.
  expulsadosDB.insert(log, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
};

/*
 * Limpia comandos que envía el cliente. Quita return, salto de linea, etc.
 */
function cleanInput(data) {
  console.log(data.toString().replace(/(\r\n|\n|\r)/gm,""));
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

/*
 * Escribe en el fichero de logs
 */
function writeLog(data){
  fs.appendFileSync("../../BaseDatos/TXT/telnet.txt", data +"\n");
}
/*
 * MEDIDAS DE SEGURIDAD
 * Evita la creación de un numero elevado de archivos por parte de un usuario. El sistema donde se instala el honeypot
 * tiene espacio limitado y la creacion de un gran numero de archivos puede afectar a su correcto funcionamiento.
 *
 * Se expulsa al usuario que escriba mas de 100 archivos (umbralNTouch=100) y se borran los archivos creados para liberar memoria.
 */
function expulsar(socket){
  var remoteIP = socket.address().address;
  var remotePort = socket.address().port;
  var serverIP = server.address().address;
  var serverPort = server.address().port;
  var time = new Date().toISOString();
  //Guada un log indicando la expulsion
  writeLog("telnet "+time+" "+remoteIP+":"+remotePort+" "+serverIP+" Expulsado");
  //BD Log
  saveLogtoDB(remoteIP, remotePort, serverIP, serverPort, "Expulsado");
  //Añade la IP del cliente a la lista de expulsados
  expulsados.push(remoteIP);
  //Crea un log en el fichero de expulsados
  //fs.appendFileSync(".../../BaseDatos/TXT/expulsados.txt", "telnet "+time+" "+remoteIP+":"+remotePort+" "+serverIP+" Usuario expulsado" +"\n");
  //DB Log
  saveLogtoDBExplusado(remoteIP, remotePort, serverIP, serverPort);
  //Elimina los archivos creados por el usuario expulsado
  //Rutas se encuantran en el array de control ficherosTouch
  if(ficherosTouch.length!=0){
    for (var i=0; i<ficherosTouch.length; i++) {
      fs.unlinkSync(ficherosTouch[i]);
    }
  }
  //Elimina carpetas creadas por el usuario.
  //Borra de forma recursiva, por lo que si intenta borrar una carpeta que contiene a otra que aun no
  // ha sido borrada da error porque intentará borrarla más adelante.
  //Habria que ordenar el array carpetasMkdir de major a menor profundidad
  if(carpetasMkdir.length!=0){
    for (var i=carpetasMkdir.length; i<0; i--) {
      //http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
      //
      if( fs.existsSync(carpetasMkdir[i]) ) {
        fs.readdirSync(carpetasMkdir[i]).forEach(function(file,index){
          var curPath = carpetasMkdir[i] + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(carpetasMkdir[i]);
      } 
    }
  }
  //Cierra el socket
  var exp = "Usuario con IP: "+remoteIP+" ha sido expulsado";
  console.log(exp.red);
  socket.end('Goodbye!\n');
}
 
/*
 * Método que se ejecuta cuando se reciben datos del socket.
 * Simula un servidor Telnet que toma el control de una máquina Linux (Android)
 * Los comandos bash disponibles serán emulados y tienen un comportamiento definido. Simulan comandos reales de Linux.
 * Se implementa un número limitado de comandos.
 */
function receiveData(socket, data) {
  var cleanData = cleanInput(data);
  var path = "/emulatedStorage";
  console.log("nTouchs: "+nTouchs);
  
  //Estado inicial
  if(estado == 0){
    switch(cleanData){
      //Cierra la sesión
      case "close":
        socket.end('Goodbye!\n');
        break;
      case "login":
        estado = 1;
        socket.write("Nombre de usuario: ");
        break;
      case "help":
      case "?":
        socket.write("Help\n close  -Cerrar sesión\n ?      -Ayuda\n login  -inicia sesión\n");
        break;
      default:
        /*console.log("Socket length: "+sockets.length);
        for(var i = 0; i<sockets.length; i++) {
          if (sockets[i] == socket) {
            sockets[i].write(data);
          }
        }*/
        socket.write("Acción no permitida\n".red);
        break;
    }
  }
  //Login usuario
  else if(estado == 1){
    if(cleanData!=""){
      estado = 2;
      socket.write("Contraseña: ");
    }else{
      socket.write("\nNombre de usuario no válido\n".red);
      socket.write("Nombre de usuario: ");
    }
   
  }
  //Login contraseña
  else if(estado == 2){
    if(cleanData!=""){
      estado = 3;
      socket.write("Sesión iniciada correctamente\n".green);
      socket.write("> ");
    }else{
      socket.write("Contraseña incorrecta\n".red);
      socket.write("Contraseña: ");
    }
  }
  //Logeado
  else{
    //Simulación de algunos comandos de unix
    var comando = cleanData;
    var opcion = "";
    var numeroOpciones = cleanData.split(" ").length;
    console.log(numeroOpciones);

    //Detecta comandos con opciones
    if(numeroOpciones > 1){
      var comandos = cleanData.split(" ");
      //Comando inicial
      comando = comandos[0];
      //Opción 1 del comando
      opcion1 = comandos[1];
      console.log("opcion 1: "+opcion1);
      console.log("Comando inicial: "+comando);
    }
    //Toma como base el comando
    switch(comando){
      /*
       * Cierra la sesión
       */
      case "logout":
        estado = 0;
        socket.write("Sesión cerrada correctamente\n".green);
        break;
      /*
       * Simula comando 'touch' de Linux
       * Permite crear ficheros vacios. 
       * Cuenta con medidas de seguridad que proteguen al sistema de ataques. Sólo permite la creación de un número finito
       * de ficheros, exolusando al usuario si los supera y borrando los ficheros creados.
       */
      case "touch":
        console.log(ficherosTouch);
        //Crea un fichero
        if(numeroOpciones>1 && nTouchs<umbralNTouch){
          fs.writeFile(pathRelativo+opcion1, "", function(err) {
            if(err) {
              return console.log(err);
            }
            //Añade la ruta del ficheor creado a un array de control
            ficherosTouch.push(pathRelativo+opcion1);
            nTouchs++;
          console.log("The file was saved!");
           });
          console.log(ficherosTouch);
          socket.write("> ");
        }else if(nTouchs>=umbralNTouch){
          //Expulsa al cliente si supera el numero permitido de archivos creados
          expulsar(socket);
        }else{
          socket.write("Introduce el nombre del fichero que quiere crear\n");
          socket.write("> ");
        }
        break;
      /*
       * Simula comando 'mkdir' de Linux
       * Crea un carpeta. Siempre dentro de emulatedStorage
       */
      case "mkdir":
        if (numeroOpciones==2 && nMkdir<=umbralNTouch && !fs.existsSync(pathRelativo+opcion1)) {
          fs.mkdirSync(pathRelativo+opcion1);
          nMkdir++;
          carpetasMkdir.push(pathRelativo+opcion1);
          console.log(carpetasMkdir);
          socket.write("> ");
        }else if(nMkdir>umbralNTouch){
          //Expulsa al cliente si supera el numero permitido de carpetas creadas
          expulsar(socket);
        }else{
          if(fs.existsSync(pathRelativo+opcion1)){
            socket.write("Ya existe carpeta con ese nombre\n");
          }else{
            socket.write("Introduce el nombre de la carpeta que quiere crear\n");
          }
          socket.write("> ");
        }
        break;
      /*
       * Simula comando 'ls' de Linux
       * Lista ficheros de la carpeta emulada
       */
      case "ls":
        //Lee directorio
        fs.readdir(pathRelativo, function(err, items) {
          console.log(items);
          if(items.length!=0){
            for (var i=0; i<items.length; i++) {
              console.log(items[i]);
              //Carpetas de color azul
              if(fs.lstatSync(pathRelativo+items[i]).isDirectory()){
                var a = items[i]+"   ";
                socket.write(a.blue);
              }else{
                socket.write(items[i]+"   ");
              }
            }
          }else{
            socket.write("Directorio vacío");
          }
          socket.write("\n> ");
        });
        break;
      /*
       * Simula comando 'cat' de Linux
       * Lee el archivo selecionado y imprime su contenido.
       */
      case "cat":
        if (numeroOpciones==2) {
          //Comprueba que el archivo que quiere leer existe
          if (fs.existsSync(pathRelativo+opcion1)) {
            //Lee el archivo
            fs.readFile(pathRelativo+opcion1, 'utf8', function (err,data) {
              if (err) {
                return console.log(err);
              }
              socket.write(data+"\n");
              socket.write("> ");
              console.log(data);
            });
          }else{
            socket.write("No existe el archivo "+opcion1+"\n");
          }
        }else{
          socket.write("Falta un parámetro: introduce el nombre del archivo que quiere leer\n");
        }
        socket.write("> ");
        break;
      /*
       * Simula comando 'cd' de Linux
       * Manejo simple de carpetas
       */
      case "cd":
        if(numeroOpciones==1){
          socket.write("Falta un parámetro\n");
        }else{
          if (opcion1=="..") {
            //No se permite salir de emulatedStorage
            if (pathRelativo==pathAbsoluto) {
              socket.write("No tiene permiso para acceder al directorio\n");
            }else{
              //Vuelve al directorio anterior
              profundidadPath--;
              var control = pathRelativo.split('/', pathRelativo.length);
              pathRelativo = "";
              for(var i=0; i<profundidadPath;i++){
                pathRelativo += control[i]+"/"
              }
              console.log(pathRelativo);
            }
          }else{
            //Comprueba que la carpeta a la que quiere moverse existe
            if(fs.existsSync(pathRelativo+opcion1+"/")){
              pathRelativo = pathRelativo+opcion1+"/";
              profundidadPath++;
              console.log(pathRelativo);
            }else{
              socket.write("No existe directorio "+opcion1+"\n");
            }
          }
        }
        socket.write("> ");
        break;
      /*
       * Simula comando 'echo' de Linux
       * hace eco en pantalla
       */
      case "echo":
        var echo = cleanData.split('echo');
        var echo2 ="";
        for (var i=1; i<echo.length;i++) {
          echo2 += echo[i] + " ";
        };
        socket.write(echo2+"\n");
        socket.write("> ");
        break;
      /*
       * Simula comando 'clear' de Linux
       * borra la pantalla
       */
      case "clear":
        var lines = process.stdout.getWindowSize()[1];
        for(var i = 0; i < lines; i++) {
           socket.write('\r\n');
           socket.write("> ");
        }
        break;
      /*
       * Simula comando 'pwd' de Linux
       * Devuelve la localización (ruta) de usuario dentro del sistema de archivos
       */
      case "pwd":
        socket.write(pathRelativo+"\n");
        socket.write("> ");
        break;
      /*
       * Ayuda
       * Muestra los comandos disponibles
       */
      case "help":
      case "?":
        socket.write("Help\n"); 
        socket.write("logout  -Cerrar sesión\n");
        socket.write("ls      -muestra el contenido de un directorio\n");
        socket.write("pwd     -Carpeta actual\n");
        socket.write("touch   -Crea un fichero\n");
        socket.write("mkdir   -Crea una carpeta\n");
        socket.write("cd      -Muevete a una carpeta\n");
        socket.write("cat     -muestra el contenido de un fichero\n");
        socket.write("echo    -hace eco en pantalla\n");
        socket.write("clear   -borra la pantalla\n");
        socket.write("?       -Ayuda\n");
        socket.write("> ");
        break;
      //No introduce comando
      case "":
        socket.write("> ");
        break;
      //Comando no implementado
      default:
        socket.write("-bash: "+comando+": command not found\n");
        socket.write("> ");
        break;
    }
  }
}
 
/*
 *  Método que se ejecuta cuando se cierra un socket.
 */
function closeSocket(socket) {
  var i = sockets.indexOf(socket);
  if (i != -1) {
    sockets.splice(i, 1);
  }
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
  var control = true;
  //Comprueba si el usuario esta en la lista de expuldados
  for(var i in expulsados){
    if(expulsados[i]==socket.address().address){
      control = false;
    }
  }
  //Si esta en la lista se expulsa al usuario
  if(!control){
    socket.end('Acceso denegado!\n');
  }
  //Si no esta en la lista permite interactuar con el servidor
  else{
    sockets.push(socket);
    socket.write('Conectado a un servidor Telnet\n');
    socket.write("> ");
    //Variables para el Log
    var remoteIP = socket.address().address;
    var remotePort = socket.address().port;
    var serverIP = server.address().address;
    var serverPort = server.address().port;
    var time = new Date().toISOString();
    
    console.log("New user connected: "+remoteIP);
    //DB Log
    saveLogtoDB(remoteIP, remotePort, serverIP, serverPort, "Inicio de la conexión");
    
    socket.on('data', function(data) {
      var cleanData = cleanInput(data);
      //Base de datos
      saveLogtoDB(remoteIP, remotePort, serverIP, serverPort, cleanData);
      receiveData(socket, data);
    })
    socket.on('end', function() {
      //DB Log
      saveLogtoDB(remoteIP, remotePort, serverIP, serverPort, "Fin de la conexión");
      console.log("User session closed: "+remoteIP);
      closeSocket(socket);
    })
  }
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
console.log("Telnet server started")
// Escucha en el puerto 9000
server.listen(9000);