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
const { default: mongoose } = require('mongoose');
//const mongoose = require('mongoose');

// configurações
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
        res.send('Está é a rota principal')
    })
    app.use('/admin', admin)
//public referencia dos arquivos estáticos, caminho absoluto
    app.use(express.static(path.join(__dirname,'public')))

//outros
const port = 3000;
app.listen(port, ()=> {
    console.log(`A aplicação está rodando no endereço http://localhost:${port}`);
})