import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    //ConfigModule es para poder configurar las variables de entorno y leerlas
    // antes hay que ejecutar e instalar npm i @nestjs/config
    ConfigModule.forRoot(),
    //Modulo para usar mongo en toda la app
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    }),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
