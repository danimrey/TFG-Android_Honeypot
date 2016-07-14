var express = require("express"), 
 	path = require('path'),
  fs = require('fs'),
  multer  =   require('multer'),
  favicon = require('express-favicon'),
  ipfilter = require('express-ipfilter'),
  Ddos = require('ddos'),
  app = express(),
  bodyParser  = require("body-parser"),
  methodOverride = require("method-override"),
  Datastore = require('nedb');

//IP bloqueadas
var uploads_contador = 0;
var ips = [];
app.use(ipfilter(ips));
//Prevenir ataques DDoS
var ddos = new Ddos;
app.use(ddos.express)

//Subir archivos
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    //Cada usuario tiene su propia carpeta para subir ficheros
    var carpeta = './emulatedStorage/'+req.connection.remoteAddress;
    if(!fs.existsSync(carpeta)){
       fs.mkdirSync(carpeta);
    }
    callback(null, carpeta);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('archivo');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

//Usar vistas ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Para poder usar CSS y JS de la plantilla
app.use(express.static(__dirname + '/public'));
//app.use(favicon(__dirname + '/public/favicon.ico'));

var router = express.Router();

//BD general de logs (Telnet, FTP y HTTP)
var db = new Datastore({
    filename: '../../BaseDatos/logs.db', // provide a path to the database file 
    autoload: true, // automatically load the database
    timestampData: true // automatically add and manage the fields createdAt and updatedAt
});
//BD para achivos que suben los usuarios. 
var db_http_files = new Datastore({
    filename: '../../BaseDatos/files-http.db', // provide a path to the database file 
    autoload: true, // automatically load the database
    timestampData: true // automatically add and manage the fields createdAt and updatedAt
});
//BD que almacena todo lo que sben los usuarios aunque se borre
var db_http_files_all = new Datastore({
    filename: '../../BaseDatos/files-http-all.db', // provide a path to the database file 
    autoload: true, // automatically load the database
    timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

/*
 * Guardo Logs en la BD general
 */
function saveLogtoDB(req){
  console.log(req.connection.remoteAddress);
  console.log(req.connection.remotePort);
  console.log(req.connection.localAddress);
  console.log(req.connection.localPort);
  console.log(req.protocol + '://' + req.get('host'));
  console.log(req.originalUrl);

  var log = {
    Servicio: "HTTP",
    AtacanteIP: req.connection.remoteAddress,
    AtacantePuerto: req.connection.remotePort,
    ServerIP: req.connection.localAddress,
    ServerPuerto: req.connection.localPort,
    Comando: req.originalUrl
    };
  // Save this goal to the database.
  db.insert(log, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
};
/*
 * Guarda logs de arhivos subidos
 */
function saveFiletoDB(req){
    console.log(req.connection.remoteAddress);
    console.log(req.connection.remotePort);
    console.log(req.protocol + '://' + req.get('host'));
    console.log(req.originalUrl);
    console.log(req.file.originalname);
    console.log(req.file.mimetype);
    console.log(req.file.path);
    console.log(req.file.size);

    var log_file = {
      Servicio: "HTTP uploads",
      AtacanteIP: req.connection.remoteAddress,
      AtacantePuerto: req.connection.remotePort,
      ServerIP: req.connection.localAddress,
      ServerPuerto: req.connection.localPort,
      Comando: req.originalUrl,
      Archivo: req.file.originalname,
      Tipo: req.file.mimetype,
      Path: req.file.path,
      Size: req.file.size
    };
  // Save this goal to the database.
  db_http_files.insert(log_file, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
   db_http_files_all.insert(log_file, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
};

function saveLogtoDBExplusados(req){
  console.log(req.connection.remoteAddress);
  console.log(req.connection.remotePort);
  console.log(req.connection.localAddress);
  console.log(req.connection.localPort);
  console.log(req.protocol + '://' + req.get('host'));
  console.log(req.originalUrl);

  var log = {
    Servicio: "HTTP",
    AtacanteIP: req.connection.remoteAddress,
    AtacantePuerto: req.connection.remotePort,
    ServerIP: req.connection.localAddress,
    ServerPuerto: req.connection.localPort,
    Comando: "Expulsado"
    };
  // Save this goal to the database.
  db.insert(log, function(err, newLog) {
    if (err) console.log(err);
    console.log(newLog);
  });
};

app.get('/', function(req, res) {
  console.log(ddos);
  saveLogtoDB(req);
  res.render('index.ejs');
});

app.get('/llamadas', function(req, res) {
  saveLogtoDB(req);
  res.render('llamadas.ejs');
});

app.get('/sms', function(req, res) {
  saveLogtoDB(req);
  res.render('sms.ejs');
});

app.get('/contactos', function(req, res) {
  saveLogtoDB(req);
  res.render('contactos.ejs');
});

app.get('/galeria', function(req, res) {
  saveLogtoDB(req);
  res.render('galeria.ejs');
});

app.get('/aplicaciones', function(req, res) {
  saveLogtoDB(req);
  res.render('aplicaciones.ejs');
});

app.get('/archivos', function(req, res) {
  saveLogtoDB(req);

  var db_http_files_2 = new Datastore({
      filename: '../../BaseDatos/files-http.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Busca archivos subidos por el usuario
  db_http_files_2.find({}).sort({
      updatedAt: -1
    }).exec(function(err, logs) {
      if (err) res.send(err);
      var obj = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(logs);
  res.render('archivos.ejs', {logs: obj});
  });
});

app.post('/upload', function(req, res) {
   saveLogtoDB(req);
   uploads_contador++;
   if(uploads_contador >= 20){
    console.log("BANNED: "+ req.connection.remoteAddress);
    //Elimina el contenido de la carpeta de ususrio
    var path = 'emulatedStorage/'+ req.connection.remoteAddress;
      if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
          var curPath = path + "/" + file;
          console.log("PATH: "+curPath);
          db_http_files.remove({
               Path: curPath
             }, {}, function(err, file) {
               if (err) res.send(err);
          });
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            //Borra el archivo de la BD
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    //IP del usuario pasa a ser bloqueda
    ips.push(req.connection.remoteAddress);
    //Guarda al usurio en la base de datos de baneados
    saveLogtoDBExplusados(req);
   }else{
    upload(req,res,function(err) {
        if(err) {
            return console.log(err);
        }
        saveLogtoDB(req);
        saveFiletoDB(req);
        console.log("Archivo subido");
    });
   }
  res.redirect('/archivos');
});

app.get('/download/:id', function(req, res) {
  console.log(req.params.id);
  saveLogtoDB(req);

  var db_http_files_2 = new Datastore({
      filename: '../../BaseDatos/files-http.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });

  db_http_files_2.findOne({
    _id: req.params.id
  }, {}, function(err, file) {
    if (err) res.send(err);
    var archivo = file;
    console.log(archivo);
    res.download(archivo.Path);
  });
  //saveLogtoDB(req);
  //res.render('contactos.ejs');
});

app.get('/delete/:id/:nombre', function(req, res) {
  console.log(req.params.id);
  saveLogtoDB(req);

  var db_http_files_2 = new Datastore({
      filename: '../../BaseDatos/files-http.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Borra el archivo de la BD
  db_http_files_2.remove({
    _id: req.params.id
  }, {}, function(err, file) {
    if (err) res.send(err);
    //Borra el archivo en el disco
    console.log('./emulatedStorage/'+req.connection.remoteAddress+"/"+req.params.nombre);
    fs.unlink('./emulatedStorage/'+req.connection.remoteAddress+"/"+req.params.nombre);
  });
  //saveLogtoDB(req);
  //res.render('contactos.ejs');
  res.redirect('/archivos');
});

app.use(router);

app.use(function(req, res, next){
  saveLogtoDB(req);
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(8080);  
console.log("Servidor de control en localhost:8080");