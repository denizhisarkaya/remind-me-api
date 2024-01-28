const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//const { UserEntity, connection } = require('../../database/db_connection.js');
const userService = require("../../services/user/userService.js");

// Temel bir "Hello World" endpoint'i
router.get('/user', (req, res) => {
    res.send('User Page!');
});



// Yeni bir kullanıcı oluşturmak için POST isteğini işleyen rota
router.post('/user/signup', async (req, res) => {
    try {
        // İstek gövdesinden kullanıcı verilerini alıyoruz
        const { user_mail, user_password } = req.body;
        const savedUser = await userService.signUp(user_mail, user_password);
        res.status(201).json(savedUser);
    } catch (error) {
        // Veritabanı hatası kontrol ediliyor
        if (error.code == 23505) {
            res.status(409).send('Kullanıcı Adı Şifre Hatası');
        } else {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Kullanıcı girişi için POST isteğini işleyen rota
router.post('/user/login', async (req, res) => {
    try {
        // İstek gövdesinden kullanıcı verilerini alıyoruz
        const { user_mail, user_password } = req.body;
        const userResponse = await userService.login(user_mail, user_password);
        
        // Kullanıcı bulunamazsa hata döndürüyoruz
        if (userResponse.error) {   // undefined, false, null
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;