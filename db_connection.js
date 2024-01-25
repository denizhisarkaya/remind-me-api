// Express, TypeORM ve body-parser modüllerini projeye dahil ediyoruz.
const express = require('express');
const typeorm = require("typeorm")
const { EntitySchema, createConnection} = require("typeorm");




// User Entity
// TypeORM'un EntitySchema sınıfını kullanarak UserEntity adında bir veritabanı şeması oluşturuyoruz.
const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        user_id: {
            primary: true,
            type: "integer",
            generated: true,
        },
        user_mail: {
            unique:true,
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
// Bu şema "plans" tablosunu temsil eder ve "categories" tablosu ile many-to-many ilişkisi vardır.
const PlanEntity = new EntitySchema({
    name: "Plan",
    tableName: "plans",
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
    relations: {
        users: {
            target: "User",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
        },
    },
});


// Veritabanı bağlantısı için TypeORM'un createConnection fonksiyonunu kullanıyoruz.
async function createDbConnection() {
    const connection = await typeorm.createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "12345",
      database: "RemindMeDb",
      synchronize: true,
      logging: true,
      entities: [UserEntity, PlanEntity],
    });
  
    console.log("Database connection successful");
    return connection;
}


module.exports = { UserEntity, PlanEntity, createDbConnection };