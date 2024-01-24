const express = require('express');
const cors = require('cors');
const typeorm = require("typeorm");
const bodyParser = require('body-parser');
const { getRepository, getManager } = require("typeorm");

const { UserEntity, createDbConnection } = require('./db_connection.js');

// Express uygulamasını oluşturuyoruz.
const app = express();

// Tüm rotalarda CORS'ü etkinleştir
app.use(cors());

const server_port = 8000;

// CSP başlığını ayarlayın
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' http://localhost:8000");
    next();
});

// JSON verilerini parse etmek için body-parser'ı kullanıyoruz.
app.use(bodyParser.json());

// Oluşturulan bağlantı
let connection;



// Server'ı belirtilen portta dinlemeye başlıyoruz.
// app.listen(server_port, () => {
//     console.log(`Server ${server_port} portunda çalışıyor`);
// });

app.listen(server_port, async () => {
    try {
        if (connection) {
            await connection.close();
        }

        // Bağlantıyı oluştur
        connection = await createDbConnection();
        // Bağlantıyı "default" adıyla kaydet
        connectionManager.add("default", connection);
        
        console.log(`Server ${server_port} portunda çalışıyor`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
});



// Temel bir "Hello World" endpoint'i
app.get('/', (req, res) => {
    res.send('Hello World!');
});



// Route to handle POST request for creating a new user
app.post('/users', async (req, res) => {
    try {
        
        const connectionManager = getManager().connectionManager;
        const userRepository = connection.getRepository(UserEntity);

        // Extract user data from the request body
        const { user_mail, user_password } = req.body;

        // Create a new user entity
        const newUser = userRepository.create({
            user_mail,
            user_password,
            user_created_at: new Date(),
            user_updated_at: new Date(),
        });

        // Save the new user to the database
        const savedUser = await userRepository.save(newUser);

        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});
