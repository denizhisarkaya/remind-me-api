const express = require('express');
const typeorm = require("typeorm")
const bodyParser = require('body-parser');
// const { EntitySchema } = require("typeorm");
const { UserEntity, PlanEntity } = require('./db_connection');

// Express uygulamasını oluşturuyoruz.
const app = express();
const server_port = 8000;

// JSON verilerini parse etmek için body-parser'ı kullanıyoruz.
app.use(bodyParser.json());

// Server'ı belirtilen portta dinlemeye başlıyoruz.
app.listen(server_port, () => {
    console.log(`Server ${server_port} portunda çalışıyor`);
});


// Veritabanı bağlantısı için TypeORM'un createConnection fonksiyonunu kullanıyoruz.
typeorm.createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345",
    database: "RemindMeDb",
    synchronize: true,  // Bu özellik, şemalardaki değişiklikleri otomatik olarak veritabanına yansıtır.
    entities: [UserEntity, PlanEntity],  // TypeORM'a kullanılacak Entity (veritabanı şemaları) sınıflarını bildiriyoruz.
}).then(async connection => {
    console.log("Database connection successful");
}).catch(error => {
    console.log("Error: ", error);
});


// Temel bir "Hello World" endpoint'i
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// POST isteğine cevap veren bir endpoint
app.post('/', (req, res) => {
    console.log(req.body); // Gelen JSON verisini log'a yazdırıyoruz.
    res.send(req.body); // Gelen JSON verisini geri gönderiyoruz.
});