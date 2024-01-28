const { UserEntity, getDBConnection } = require("../../database/db_connection");
const authService = require('../auth/authService');

class userService {
    static async signUp(user_mail, user_password) {
        try {
            const connection = await getDBConnection();
            // Kullanıcı tablosunu alıyoruz
            const userRepository = connection.getRepository(UserEntity);
            // Parolayı hashler
            const hashedPassword = authService.hashPassword(user_password);
            // Yeni bir kullanıcı nesnesi oluşturuyoruz
            const newUser = userRepository.create({
                user_mail,
                user_password: hashedPassword,
                user_created_at: new Date(),
                user_updated_at: new Date(),
            });

            // Yeni kullanıcıyı veritabanına kaydediyoruz
            const savedUser = await userRepository.save(newUser);

            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    static async login(user_mail, user_password) {
        try {
            const connection = await getDBConnection();
            // Kullanıcı tablosunu alıyoruz
            const userRepository = connection.getRepository(UserEntity);
            // Parolayı hashler
            const hashedPassword = authService.hashPassword(user_password);
            // Veritabanından kullanıcıyı arıyoruz
            const user = await userRepository.findOne({ where: { user_mail, user_password: hashedPassword } });
            // Kullanıcı bulunamazsa hata döndürüyoruz
            if (!user) {   // undefined, false, null
                return { error: 'Invalid email or password' } // 401
            }
            // Kullanıcı doğrulandı, JWT oluşturuyoruz
            const token = authService.generateJWT(user); // Kullanıcı bilgisiyle JWT oluşturuyoruz
            // Oluşturulan JWT token'ı ve kullanıcı bilgilerini döndürüyoruz
            return { token, message: 'Login successful', user }; // 200
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

module.exports = userService;