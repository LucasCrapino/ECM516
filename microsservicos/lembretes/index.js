const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json()); // Middleware para converter o body em JSON


const PORT = 4000;

/*
    API: coleção de endpoints

    um endpoint é caracterizado por
    um metodo do protocolo htto,
    um padrao de acesso
    uma funcionalidade
*/
   
/*
{
    1: {
        id: 1,
        texto: 'Fazer café'
    },
    2: {
        id: 2,
        texto: 'Fazer almoço'
    }
}
*/

const baseLembretes = {
    1: {
        id: 1,
        texto: 'Fazer café'
    },
    2: {
        id: 2,
        texto: 'Fazer almoço'
    },
    3: {
        id: 3,
        texto: 'Fazer jantar'
    },
    4: {
        id: 4,
        texto: 'Fazer sobremesa'
    },
    5: {
        id: 5,
        texto: 'Ir à feira'
    }
}

let id = 6;

// GET /lembretes () => {}
// localhost:4000/lembretes
app.get('/lembretes', (req, res) => {
    res.json(baseLembretes);
});

// POST /lembretes () => {}
// localhost:4000/lembretes
app.post('/lembretes', (req, res) => {
    /*
        1- Pegar o texto que veio da requisição
        2 - Construir um objeto com id e texto
        3 - Cadastrar o objeto na base, no formato visto acima
        4 - Incrementar o id para o próximo lembrete
        5 - Retornar o objeto que foi cadastrado
    */

    const { texto } = req.body; // Pega o texto do body da requisição
    
    // nome igual pode omitir o valor
    const lembrete = { id, texto }; // Cria o objeto com id e texto
    
    baseLembretes[id] = lembrete; // Cadastra o objeto na base

    id++; // Incrementa o id para o próximo lembrete

    axios.post('http://localhost:10000/eventos', {
        tipo: 'LembreteCriado',
        dados: lembrete
    })
    .then((resAxios) => {
        console.log('Evento emitido com sucesso'); // Resposta do barramento
    })
    .catch((error) => {
        console.log(`Erro ao enviar evento para o barramento: ${error.message}`);
    })
    .finally(() => {
        res.status(201).json(lembrete); // Retorna o objeto que foi cadastrado
    })

});

app.get('/lembretes/:id', (req, res) => {
    const { id } = req.params; // Pega o id do lembrete que foi passado na URL

    const lembrete = baseLembretes[id]; // Busca o lembrete na base

    if (!lembrete) { // Se não encontrar o lembrete
        return res.status(404).json({ mensagem: 'Lembrete não encontrado' }); // Retorna 404
    }

    res.status(200).json(lembrete); // Retorna o lembrete encontrado
})

// POST /eventos
app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.end()
})

app.listen(PORT, () => {
    console.log(`\x1b[36mLembretes: Servidor rodando na porta ${PORT}\x1b[0m`);
});