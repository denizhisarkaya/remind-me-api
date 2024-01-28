const express = require('express');
const cors = require('cors');
//const typeorm = require("typeorm");

const { createDbConnection, getDBConnection } = require('./database/db_connection.js');
const userRouter = require("./routes/user/userRoutes.js");

// Express uygulamasını oluşturuyoruz.
const app = express();

// Tüm rotalarda CORS'ü etkinleştiriyoruz
app.use(cors());

const server_port = 8000;

// CSP başlığını ayarlıyoruz
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' http://localhost:8000");
    next();
});

app.use('/', userRouter);

// Server'ı belirtilen portta dinlemeye başlıyoruz.
app.listen(server_port, async () => {
    try {
        const connection = await getDBConnection();
        // Önceden mevcut bir bağlantı varsa kapatıyoruz
        if (connection) {
            await connection.close();
        }
        // Yeni bir veritabanı bağlantısı oluşturuyoruz
        await createDbConnection();

        console.log(`Server ${server_port} portunda çalışıyor`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
});








