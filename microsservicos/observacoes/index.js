const axios = require("axios");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json()); // Middleware para converter o body em JSON

const PORT = 5000;

/*
{
    1: [
        {
            id: 1001,
            idLembrete: 1,
            texto: 'Sem açúcar'	
        },
        {
            id: 1002,
            idLembrete: 1,
            texto: 'Com leite'	
        }    
    ]
    2: [
        {
            id: 2001,
            idLembrete: 2,
            texto: 'Comida vegana'	
        },
        {
            id: 2002,
            idLembrete: 2,
            texto: 'Comida japonesa'	
        }    
    ]
}
*/

const baseObservaçoes = {
    1: [
        {
            id: "8207e6b8-2344-4198-89fa-cffbf1f33797",
            texto: "Com leite",
            idLembrete: "1",
        },
        {
            id: "ca44763b-71b9-475f-a98a-639d18e8ef16",
            texto: "Sem açúcar",
            idLembrete: "1",
        },
    ],
};

const funcoes = {
    ObservacaoClassificada: async (observacao) => {
        const observacoes = baseObservaçoes[observacao.idLembrete]
        const obsParaAtualizar = observacoes.find(obs => obs.id === observacao.id)
        obsParaAtualizar.status = observacao.status
        await axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoAtualizada",
            dados: observacao,
        });
        res.status(201).json(observacoes);
    }
}

// GET /lembretes/id/observacoes
app.get("/lembretes/:idLembrete/observacoes", (req, res) => {
    const { idLembrete } = req.params;
    const observacoes = baseObservaçoes[idLembrete] || [];
    res.json(observacoes);
});

// POST /lembretes/id/observacoes
app.post("/lembretes/:idLembrete/observacoes", async (req, res) => {
    const idObservacao = uuidv4(); // Gera um novo ID único
    const { idLembrete } = req.params;
    const { texto } = req.body;
    const observacao = { 
        id: idObservacao, 
        texto, idLembrete, 
        status: "aguardando" 
    };

    const observacoes = baseObservaçoes[idLembrete] || [];
    observacoes.push(observacao);
    baseObservaçoes[idLembrete] = observacoes; // Atualiza a lista de observações para o lembrete

    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: observacao
    })

    res.status(201).json(observacoes);
});

app.post("/eventos", async (req, res) => {
    try {
        const evento = req.body;
        console.log(evento);
        await funcoes[evento.tipo](evento.dados);
    } 
    catch (e){
        console.error(`Erro ao processar o evento: ${e}`);
    }
    finally {
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`\x1b[36mObservações: Servidor rodando na porta ${PORT}\x1b[0m`);
});