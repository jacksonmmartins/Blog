const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema ({
    tiulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    consteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()

    }
})

mongoose.model('postagens', Postagem)