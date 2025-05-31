const express = require('express');
const app = express();
app.use(express.json());

app.get('/hey-docker', (req, res) => {
    res.json({ message: 'Hey Docker!' });
})

app.listen(5200, () => {
    console.log('Up and running inside docker');
});