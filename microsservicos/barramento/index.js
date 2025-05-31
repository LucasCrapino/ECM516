const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.json()); // Middleware para converter o body em JSON

const PORT = 10000

const eventos = []

app.post('/eventos', async (req, res) => {
    /*
        1 - Pegar o evento
        2 - Enviar o evento para os microsserviços de lembretes
        3 - Enviar o evento para os microsserviços de observações
        4 - Enviar o evento para os microsserviços de consulta
        4 - "Responder"
    */

    const evento = req.body;

    console.log(evento)

    eventos.push(evento)

    try {
        await axios.post('http://localhost:4000/eventos', evento)
    }
    catch (error) {
        console.log(`Erro ao enviar evento para o microsserviço de lembretes: ${error}`);
    }

    try {
        await axios.post('http://localhost:5000/eventos', evento)
    }
    catch (error) {
        console.log(`Erro ao enviar evento para o microsserviço de observações: ${error}`);
    }
    try {
        await axios.post('http://localhost:6000/eventos', evento)
    }
    catch (error) {
        console.log(`Erro ao enviar evento para o microsserviço de consulta: ${error}`);
    }
    try {
        await axios.post('http://localhost:7000/eventos', evento)
    }
    catch (error) {
        console.log(`Erro ao enviar evento para o microsserviço de classificação: ${error}`);
    }

    res.end()
})

app.get('/eventos', (req, res) => {
    res.json(eventos)
})

app.listen(PORT, async () => {
    console.log(`\x1b[36mBarramento de Eventos: Servidor rodando na porta ${PORT}\x1b[0m`);
});