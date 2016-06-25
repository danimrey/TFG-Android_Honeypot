var express = require("express"), 
 	path = require('path'), 
  favicon = require('express-favicon'),
  app = express(),
  bodyParser  = require("body-parser"),
  methodOverride = require("method-override"),
  Datastore = require('nedb');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

//Usar vistas ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Para poder usar CSS y JS de la plantilla
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

var router = express.Router();


app.get('/', function(req, res) {
	//Carga la BD cada vez que se llama a '/'
	//Si se pone fuera de este método no carga los logs nuevos
	var db = new Datastore({
  		filename: '../../BaseDatos/logs.db', // provide a path to the database file 
  		autoload: true, // automatically load the database
  		timestampData: true // automatically add and manage the fields createdAt and updatedAt
	});
	//Recupera todos los logs por orden de modificación
  	db.find({}).sort({
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
  	  //Carga página y pasa obj 
      res.render('elements.ejs', {obj: obj});
  	});
});

app.get('/telnet', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación
    db.find({Servicio: 'Telnet'}).sort({
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
      //Carga página y pasa obj 
      res.render('telnet.ejs', {obj: obj});
    });
});

app.get('/ftp', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación
    db.find({Servicio: 'FTP'}).sort({
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
      //Carga página y pasa obj 
      res.render('ftp.ejs', {obj: obj});
    });
});

app.get('/http', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación
    db.find({Servicio: 'HTTP'}).sort({
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
      //Carga página y pasa obj 
      res.render('http.ejs', {obj: obj});
    });
});

app.get('/expulsados', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación
    db.find({Comando: 'Expulsado'}).sort({
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
      //Carga página y pasa obj 
      res.render('expulsados.ejs', {obj: obj});
    });
});

app.get('/uploads', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/files-http-all.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación
    db.find({Servicio: 'HTTP uploads'}).sort({
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
      //Carga página y pasa obj 
      res.render('http-uploads.ejs', {obj: obj});
    });
});

app.get('/buscar', function(req, res) {
  //Carga la BD cada vez que se llama a '/'
  //Si se pone fuera de este método no carga los logs nuevos
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });
  //Recupera todos los logs por orden de modificación

    db.find({}).sort({
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
      //Hacer un una funcion que implemente este algoritmo
      //Busca IP de atancantes diferentes.
      var ip_atacantes = [];
      var control = false;
      for(t in logs){
        if(ip_atacantes.length == 0){
          ip_atacantes.push(logs[t].AtacanteIP)
        }else{
          control = false;
          for(j in ip_atacantes){
            if(ip_atacantes[j]==logs[t].AtacanteIP){
              control = true;
            }
          }
          if(control==false){
              ip_atacantes.push(logs[t].AtacanteIP)
            }
        }
      }
      //Busca comandos
      var comandos = [];
      var control2 = false;
      for(t in logs){
        if(comandos.length == 0){
          comandos.push(logs[t].Comando)
        }else{
          control2 = false;
          for(j in comandos){
            if(comandos[j]==logs[t].Comando){
              //Ya esta dentro
              control2 = true;
            }
          }
          if(control2==false){
              comandos.push(logs[t].Comando)
            }
        }
      }

      //Busca Fecha
      var fechas = [];
      var control3 = false;
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(fechas.length == 0){
          fechas.push(formatted)
        }else{
          control3 = false;
          for(j in fechas){
            if(fechas[j]==formatted){
              //Ya esta dentro
              control3 = true;
            }
          }
          if(control3==false){
              fechas.push(formatted)
            }
        }
      }

      console.log(ip_atacantes);
      //Carga página y pasa obj 
      res.render('buscar.ejs', {obj: obj, ip_atacantes: ip_atacantes, comandos: comandos, fechas: fechas});
    });
});

app.post('/buscar-form', function(req, res) {
  console.log("FORM");
  console.log(req.body.servicio);
  console.log(req.body.atacante);
  console.log(req.body.fecha);
  console.log(req.body.comandos);
  console.log(req.body.comando);

  var servicio = req.body.servicio;
  var ip_atacante = req.body.atacante;
  var fecha = req.body.fecha;
  var comandos = req.body.comandos;
  var comando = req.body.comando;

  //Buscar en db
  var db = new Datastore({
      filename: '../../BaseDatos/logs.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });

  var db_http_files_all = new Datastore({
      filename: '../../BaseDatos/files-http-all.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
  });

  //Busqueda por tipo de servicio
  //Busqueda por comando telnet escrito
   if(servicio == 'HTTP uploads' && ip_atacante=='default' && fecha == 'default'){
    console.log("UPPPP");
    db_http_files_all.find({})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  else if(servicio == 'HTTP uploads' && fecha!='default' && ip_atacante=='default'){
    console.log("UPPPP");
    db_http_files_all.find({})
    .exec(function(err, logs) {
      if (err) res.send(err);
       var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  else if(servicio == 'HTTP uploads' && ip_atacante!='default' && fecha == 'default'){
    console.log("UPPPP IPPP");
    db_http_files_all.find({
      AtacanteIP: ip_atacante
    })
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  else if(servicio == 'HTTP uploads' && ip_atacante!='default' && fecha != 'default'){
    console.log("UPPPP IPPP");
    db_http_files_all.find({
      AtacanteIP: ip_atacante
    })
    .exec(function(err, logs) {
      if (err) res.send(err);
      var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  else if(servicio != 'default' && ip_atacante=='default' && comandos=='default'&& comando=='' && fecha=='default' ){
    console.log("DEFAULT");
    db.find({Servicio: servicio})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  //Busqueda por servicio, ip atacante y comando
  else if(servicio != 'default' && ip_atacante!='default' && comandos!='default'&& comando==''&& fecha=='default'){
    db.find({Servicio: servicio, AtacanteIP: ip_atacante, Comando: comandos})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  //Busqueda por servicio e ip atacante
  else if(servicio != 'default' && ip_atacante!='default' && comandos =='default'&& comando==''&& fecha=='default'){
    db.find({Servicio: servicio, AtacanteIP: ip_atacante})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  //Busqueda por ip atacante
  else if(servicio == 'default' && ip_atacante!='default' && comandos =='default'&& comando==''&& fecha=='default'){
    db.find({AtacanteIP: ip_atacante})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  //Busqueda por comando telnet
  else if(servicio == 'Telnet' && comando !='' && ip_atacante=='default'&& fecha=='default' && comandos=='default'){
    db.find({Servicio: 'Telnet', Comando: comando})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  //Busqueda por comando telnet escrito
  else if(servicio == 'Telnet' && comandos !='default' && ip_atacante=='default'&& fecha=='default'){
    db.find({Servicio: 'Telnet', Comando: comandos})
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
      res.render('buscar_resultados.ejs', {obj_res: obj_res});
    //Carga página y pasa obj
    });
  }
  //Busqueda por fecha
  else if(fecha!='default' && servicio=='default' && ip_atacante=='default' && comandos=='default' && comando==''){
    //Busca fechas
    db.find({})
    .exec(function(err, logs) {
      if (err) res.send(err);
      //Busca por fecha formato D/M/A
      //La hora no se tiene en cuenta 
      var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  //Busqueda por fecha y servicio
  else if(servicio!='default' && fecha!='default'){
    //Busca fechas
    db.find({Servicio: servicio})
    .exec(function(err, logs) {
      if (err) res.send(err);
      //Busca por fecha formato D/M/A
      //La hora no se tiene en cuenta 
      var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  //Busqueda por servicio, ip atacante y fecha
  else if(servicio!='default' && ip_atacante !='default' && fecha!='default'){
    //Busca fechas
    db.find({Servicio: servicio, AtacanteIP:ip_atacante })
    .exec(function(err, logs) {
      if (err) res.send(err);
      //Busca por fecha formato D/M/A
      //La hora no se tiene en cuenta 
      var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  //ip atacante y fecha
  else if(ip_atacante !='default' && fecha!='default'){
    //Busca fechas
    db.find({AtacanteIP:ip_atacante })
    .exec(function(err, logs) {
      if (err) res.send(err);
      //Busca por fecha formato D/M/A
      //La hora no se tiene en cuenta 
      var logs_fecha = []
      for(t in logs){
        var d = logs[t].createdAt;
        var formatted = d.getDate()+ "/" +(d.getMonth() + 1) + "/" + d.getFullYear();
        if(formatted == fecha){
          logs_fecha.push(logs[t]);
        }
      }
      var obj_res = { 
        logs: logs_fecha,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  //ip atacante y fecha
  else if(servicio =='default' && ip_atacante =='default' && fecha=='default' && comandos =='Expulsado'){
    //Busca fechas
    console.log('Expulsado');

    db.find({Comando: 'Expulsado' })
    .exec(function(err, logs) {
      if (err) res.send(err);
      var obj_res = { 
        logs: logs,
        helpers: {
          formatCreatedAt: function() {
            return this.createdAt.toLocaleDateString();
          }
        }
      };
      console.log(obj_res.logs);
    //Carga página y pasa obj
    res.render('buscar_resultados.ejs', {obj_res: obj_res});
    });
  }
  else{  
    res.render('buscar_resultados.ejs', {texto: "Parámetros insuficientes. Seleccione más parametros para completar la búsqueda."});
}

});

app.use(router);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
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
app.listen(9008, '127.0.0.1');  
console.log("Servidor de control en http://127.0.0.1:9008");