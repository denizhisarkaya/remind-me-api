const express = require('express');
const cors = require('cors');
const typeorm = require("typeorm");
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
app.listen(server_port, async () => {
    try {
        if (connection) {
            await connection.close();
        }
        // Bağlantıyı oluştur
        connection = await createDbConnection();

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
        let userRepository = connection.getRepository(UserEntity);

        // Extract user data from the request body
        let { user_mail, user_password } = req.body;

        // Kullanıcı şifresini hashleme fonksiyonu
        function hashPassword(password) {
            const hash = crypto.createHash('sha1');
            hash.update(password);
            return hash.digest('hex');
        }

        // Parolayı hashle
        const hashedPassword = hashPassword(user_password);

        // Create a new user entity
        const newUser = userRepository.create({
            user_mail,
            user_password: hashedPassword,
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



// Route to handle POST request for user login
app.post('/login', async (req, res) => {
    try {
        // Extract user data from the request body
        let { user_mail, user_password } = req.body;

        // Kullanıcı şifresini hashleme fonksiyonu
        function hashPassword(password) {
            const hash = crypto.createHash('sha1');
            hash.update(password);
            return hash.digest('hex');
        }

        // Parolayı hashle
        const hashedPassword = hashPassword(user_password);

        let userRepository = connection.getRepository(UserEntity);
        // Veritabanından kullanıcıyı bul
        const user = await userRepository.findOne({where: { user_mail, user_password: hashedPassword }});

        // Kullanıcı yoksa hata döndür
        if (!user) { // undefined, false, null
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Kullanıcı varsa başarılı giriş döndür
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});


// async function authenticateUser(user_mail, user_password) {
//     try {
        
//         // Kullanıcıyı e-posta adresine göre sorgula
//         const query = 'SELECT user_mail FROM users;';
//         const result = await createDbConnection.query(query, [user_mail]);

//         if (result.rows.length === 0) {
//             return { success: false, message: 'Invalid email or password' };
//         }

//         const user = result.rows[0];

//         // Şifreyi karşılaştır
//         const passwordMatch = await bcrypt.compare(user_password, user.user_password);
//         if (!passwordMatch) {
//             return { success: false, message: 'Invalid email or password' };
//         }

//         // Kullanıcı doğrulandı
//         return { success: true, user_id: user.user_id };
//     } catch (error) {
//         console.error('Error authenticating user:', error);
//         return { success: false, message: 'An error occurred while authenticating user' };
//     } finally {
//         await client.end();
//     }
// }