const express=require ('express')
const path=require('path')
const exphbs=require('express-handlebars')
const flash=require('connect-flash')
const handlebars =  require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodOverride=require('method-override')
const session=require('express-session')
const passport=require('passport')




//inits
const app=express();
require('./database');
require('./config/passport')

///settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars)
    
}));
app.set('view engine','.hbs')




//midlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session())
app.use(flash());





//global vars
app.use((req,res,next)=>{
    res.locals.succes_msg=req.flash('succes_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    res.locals.user=req.user ||  null;
    next();
})



//routes

app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))




//statics

app.use(express.static(path.join(__dirname,'public')));



//conect server
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'))
});   