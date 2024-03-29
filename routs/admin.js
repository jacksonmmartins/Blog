const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')

router.get('/home', eAdmin, (req,res)=>{
    res.render("admin/home")
})

router.get('/post', eAdmin,(req,res)=>{
    res.send('Página de posts')
})

router.get('/categorias', eAdmin, (req,res) =>{
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias',{categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao listar as categorias')
        res.redirect('/home')
    })
   
})

router.get('/categorias/add', eAdmin, (req,res)=>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', eAdmin, (req,res)=>{
    var erros = []
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:'nome inválido'})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
            erros.push({texto: 'Slug inválido'})
        }
        if(req.body.nome.length <2){
            erros.push({texto: 'nome da categoria é muito pequeno'})
        }
        if(erros.length > 0){
            res.render('admin/addcategorias', {erros: erros})
        } else{

            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
            new Categoria(novaCategoria).save().then(()=>{
                req.flash('success_msg','Categoria salva com sucesso!')
                res.redirect('/admin/categorias');
            }).catch((err)=>{
                req.flash('error_msg','Houve um erro ao salva a categoria, tente novamente!')
                res.redirect('/admin')
            });
        }
})

router.get('/categorias/edit/:id', eAdmin, (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
    res.render('admin/editcategorias', {categoria:categoria})
    }).catch((err)=>{
    req.flash('error_msg','Esta categoria não existe')
    res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', eAdmin, (req,res)=>{
        Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        Categoria.nome = req.body.nome
        Categoria.slug = req.body.slug

        Categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!')
            req.redirect('/admin/categorias')
        }).catch((err) =>{
            req.flash('error_msg','Houve um erro interno ao salvar a edição da categoria')
            res.redirect('admin/categorias')
        })

        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
        })
})

router.post('/categorias/deletar', eAdmin, (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', eAdmin, (req,res) => {
    Postagem.find().lean().populate('categoria').sort({date:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens: postagens})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })
    
})

router.get('/postagens/add', eAdmin, (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem', {categorias: categorias}) 
    }).catch((err)=> {
        req.flash('error_msg', 'Houve um erro ao carregar o formulaŕio')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin, (req,res)=>{
    var erros = []
    if(req.body.categoria == '0'){
        erros.push({texto: 'Categoria inválida, registre um acategoria'})
    }
    if(erros.length > 0){
        res.render('admin/addpostagem',{erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao salvar a postagem')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', eAdmin, (req,res)=>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editpostagem',{categorias: categorias,postagem: postagem})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao carregar ao listar as categorias')
            req.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulário de edição')
        req.redirect('/admin/postagens')
    })
})

// atualização da rota
router.post('/postagem/edit', eAdmin, (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg','Erro ao salvar edição postagem')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao salvar a edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/deletar', eAdmin, (req,res)=>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao deletar a categoria')
        res.redirect('/admin/postagens')
    })
})

module.exports = router