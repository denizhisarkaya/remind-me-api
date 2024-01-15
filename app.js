const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 8000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server ${port} portunda çalışıyor`);
});

// istekler

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});
