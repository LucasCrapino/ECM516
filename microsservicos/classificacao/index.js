const axios = require('axios');
const express = require('express');
const app = express();
const PORT = 7000;
app.use(express.json()); // Middleware para converter o body em JSON

const funcoes = {
    ObservacaoCriada: async (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? 'importante' : 'comum';
        await axios.post('http://localhost:10000/eventos', {
            tipo: 'ObservacaoClassificada',
            dados: observacao
        });
    }

    
}

app.post('/eventos', async (req, res) => {
    try{
        const evento = req.body;
        console.log(evento);
        await funcoes[evento.tipo](evento.dados);
    }
    catch (error) {
        console.error(`Erro ao processar o evento: ${error}`);
        res.status(500).send('Erro ao processar o evento');
        return;
    }
    finally{
        res.end();
    }
})

app.listen(PORT, () => {
    console.log(`\x1b[36mClassificação: Servidor rodando na porta ${PORT}\x1b[0m`);
});