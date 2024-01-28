const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class authService {
    static hashPassword(password) {
        const hash = crypto.createHash('sha1');
        hash.update(password);
        return hash.digest('hex');
    }
    // JWT oluşturma işlemi
    static generateJWT(user) { // Kullanıcı bilgisiyle JWT oluşturan fonksiyon
        return jwt.sign({ id: user.user_id, username: user.user_mail }, 'your-secret-key', { expiresIn: '6h' }); // Kullanıcı bilgileriyle JWT oluşturuyoruz, expiresIn 6 saat
    }
}

module.exports = authService;