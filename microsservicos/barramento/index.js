const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

app.post('/eventos', async (req,res) => {
    //1. pegar o evento

    //2. enviar o evento para o mss de lembretes

    //3. enviar o evento para o mss de observações

    //4. "responder"

    const evento = req.body
    try {
        await axios.post('http://localhost:4000/eventos', evento)    
    } catch (e) {
        console.log(e)
    }
    
    try {
        await axios.post('http://localhost:5000/eventos', evento)    
    } catch (e) {
        console.log(e)
    }
    res.end()
})

const port = 10000
app.listen(port, () => {
    console.log(`\x1b[35mBarramento. Porta ${port}.\x1b[0m`)
})