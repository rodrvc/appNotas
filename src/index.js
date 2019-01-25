const express = require('express');
const path = require('path'); 
const exphbs = require('express-handlebars');
const methodOverRide = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const Event = require('events');
const passport = require('passport');
//inicilizaciones
const app = express(); 
require('./database');
require('./config/passport');

//setting

app.set('port', process.env.PORT ||3000);
app.set('views' ,path.join(__dirname, 'views')); 

app.engine('.hbs' , exphbs({// se configura el sistema de vistas
    defaultLayout: 'main',
    layoutsDir : path.join(app.get('views'), 'layouts'),
    partialsDir :path.join(app.get('views') , 'partials'), 
    extname: '.hbs',     
})); 

app.set('view engine' , 'hbs'); //se define el engine de vistas utilizado *(lineas anteriores)


//Middlewares

app.use(express.urlencoded({extended: false}));
app.use(methodOverRide('_method'));
app.use(session({
    secret: 'mysecretApp',
    resave: true, 
    saveUninitialized : true 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables      
app.use((req, res , next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


//Routers
app.use(require('./router/index'));
app.use(require('./router/users'));
app.use(require('./router/notes'));
app.use(require('./router/pruebas'));



//Static Files

app.use(express.static(path.join(__dirname, 'public'))); // define los archivos estaticos en la carpeta public

//Server Listening
app.listen(app.get('port'),()=>{
    console.log('puerto inicializado', app.get('port'));
});



///PRUEBA CON EVENTOS 


