const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())
// API: uma coleção de endpoints
// um endpoint é caracterizado por
// um método do protocolo http
// um padrão de acesso
// uma funcionalidade

/* 
{
    1: {
        id: 1,
        texto: 'fazer café'
    },
    2: {
        id: 2,
        texto: 'ir à feira'
    }
}
*/
const baseLembretes = {}
let id = 1
// GET /lembretes () => {}
//localhost:4000/lembretes
app.get('/lembretes', (req, res) => {
    res.json(baseLembretes)
})

//localhost:4000/lembretes
//POST /lembretes () => {}
app.post('/lembretes', (req,res) => {
    //1. pegar o texto que veio da requisição
    //2. construir um objeto com id e texto
    //3. cadastrar o objeto na base, no formato visto ali em cima
    //4. incrementar o id para a próxima vez
    //5. devolver o objeto recém criado
    // const texto = req.body.texto
    const { texto } = req.body
    const lembrete = {id, texto}
    baseLembretes[id] = lembrete
    id++
    axios.post('http://localhost:10000/eventos', {
        tipo: 'LembreteCriado',
        dados: lembrete
    })
    .then(() => {
        console.log('Evento emitido com sucesso')
    })
    .catch((e)=> {
        console.log(e)
    })
    .finally(() => {
        res.status(201).json(lembrete)
    })
    
})

//POST /eventos
app.post('/eventos', (req,res) => {
    console.log(req.body)
    res.end()
})

const port = 4000
app.listen(port, () => {
    console.log(`Lembretes. Porta ${port}.`)
    })
