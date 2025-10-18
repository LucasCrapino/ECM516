const axios = require("axios")
const express = require("express")
const app = express()
app.use(express.json())
const PORT = 6000

const baseConsolidada = {}

const funcoes = {
    LembreteCriado: (lembrete) => {
        baseConsolidada[lembrete.id] = lembrete
    },
    ObservacaoCriada: (observacao) => {
        const observacoes = baseConsolidada[observacao.idLembrete]['observacoes'] || []
        observacoes.push(observacao)
        baseConsolidada[observacao.idLembrete]['observacoes'] = observacoes
    },
    // lidar com o evento ObservacaoAtualizada, ou seja, atualizar a observacao em questão na base consolidada
    ObservacaoAtualizada: (observacao) => {
       const observacoes = baseConsolidada[observacao.idLembrete]['observacoes'] || []
       const indice = observacoes.findIndex(o => o.id === observacao.id)
       observacoes[indice] = observacao
    }
}

app.get("/lembretes", (req, res) => {
    res.json(baseConsolidada)
})

app.post('/eventos', async (req, res) => {
    try{
        const evento = req.body
        console.log(evento)
        await funcoes[evento.tipo](evento.dados)
    }
    catch(e){
        console.error(`Erro ao processar o evento: ${e}`)
    }
    finally {
        res.end()
    }
})

app.listen(PORT, async () => {
    console.log(`\x1b[36mConsulta: Servidor rodando na porta ${PORT}\x1b[0m`)
    const { data } = await axios.get('http://localhost:10000/eventos')
    data.forEach(async (evento) => {
        try{
            await funcoes[evento.tipo](evento.dados) 
        }
        catch(e){}
    })
})