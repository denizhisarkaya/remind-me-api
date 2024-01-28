// Express, TypeORM ve body-parser modüllerini projeye dahil ediyoruz.
const typeorm = require("typeorm")
const { EntitySchema, createConnection } = require("typeorm");

// Oluşturulan bağlantıyı saklamak için bir değişken tanımlıyoruz
let connection;
// User Entity
// TypeORM'un EntitySchema sınıfını kullanarak UserEntity adında bir veritabanı şeması oluşturuyoruz.
const UserEntity = new EntitySchema({
    name: "User",  // Şema adı
    tableName: "users",  // Veritabanındaki tablo adı
    columns: {
        user_id: {
            primary: true,
            type: "integer",
            generated: true,
        },
        user_mail: {
            unique: true,
            type: "text",
        },
        user_password: {
            type: "text",
        },
        user_created_at: {
            type: "timestamp",  // TIMESTAMP
        },
        user_updated_at: {
            type: "timestamp",
        },
    },
});

// Plan Entity
// TypeORM'un EntitySchema sınıfını kullanarak PlanEntity adında bir veritabanı şeması oluşturuyoruz.
// Bu şema "plans" tablosunu temsil eder ve "users" tablosu ile many-to-one ilişkisi vardır.
const PlanEntity = new EntitySchema({
    name: "Plan",  // Şema adı
    tableName: "plans",   // Veritabanındaki tablo adı
    columns: {
        plan_id: {
            primary: true,
            type: "integer",
            generated: true,
        },
        user_id: {
            primary: true,
            type: "integer",

        },
        plan_text: {
            type: "text",
        },
        plan_date: {
            type: "timestamp",
        },
        plan_coords: {
            type: "geometry",
        },
        plan_send_mail: {
            type: "boolean",
        },
        plan_created_at: {
            type: "timestamp",
        },
        plan_updated_at: {
            type: "timestamp",
        },
    },
    relations: {  // İlişkiler
        users: {  // Kullanıcılar ile ilişki
            target: "User",  // Hedef: UserEntity
            type: "many-to-one",  // Çoktan bire ilişki
            joinTable: true,  // Tablo birleştirme
            cascade: true,  // İlişkili nesneleri kaskatlı silme/güncelleme
        },
    },
});

// Veritabanı bağlantısı için TypeORM'un createConnection fonksiyonunu kullanıyoruz.
async function createDbConnection() {
    connection = await typeorm.createConnection({
        type: "postgres",  // Veritabanı tipi: PostgreSQL
        host: "localhost",  // Veritabanı sunucusu
        port: 5432,  // Veritabanı portu
        username: "postgres",  // Veritabanı kullanıcı adı
        password: "12345",  // Veritabanı şifresi
        database: "RemindMeDb",  // Veritabanı adı
        synchronize: true,  // Entity'lerdeki değişikliklerin veritabanına otomatik yansıtılması
        logging: true,  // SQL sorgularının konsola loglanması
        entities: [UserEntity, PlanEntity],  // Kullanılacak entity'lerin listesi
    });

    console.log("Database connection successful");
    return connection;
}

async function getDBConnection(){
    return connection;
}

module.exports = { UserEntity, PlanEntity, createDbConnection, getDBConnection };