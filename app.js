// configurações do express
// carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
//pegando rotas adimin
const admin = require('./routs/admin');
//trabalhando com diretórios
const path = require('path');
//const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');
//express session
const session = require('express-session')
const flash = require('connect-flash')
//model de postagm
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
// configurações
    // session midleware
        app.use(session({
            secret:'cursodenode',
            resave:true,
            saveUninitialized: true
        }))
        app.use(flash())
        //midleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        })
    //body parser
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    //handlebars
    const hbs = handlebars.create({
        defaultLayout: "main"
    })
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    //mongoose
    mongoose.connect("mongodb+srv://app_test:clarice21@Cluster0.184n6.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("DB connected")
    }).catch(()=>{
        console.log("DB connection failed")
    })

//rotas
    app.get('/', (req,res)=>{
        Postagem.find().populate('categoria').sort({data:'desc'}).lean().then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404')
        })
    })
    app.get('/404',(req,res)=>{
        res.send('Erro 404!')
    })

    app.get("/postagens/:slug", (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('admin/index', {postagem: postagem})
            } else{
                req.flash('error_msg','Esta postagem não existe')
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash('error_msg','Houve um problema interno')
            req.redirect('/')
        })
    })
    app.use('/admin', admin)
//public referencia dos arquivos estáticos, caminho absoluto
    app.use(express.static(path.join(__dirname,'public')))
    app.use((req,res,next)=>{
        next()
    })

//outros
const port = 3000;
app.listen(port, ()=> {
    console.log(`A aplicação está rodando no endereço http://localhost:${port}`);
})