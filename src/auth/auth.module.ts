import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    //necesitamos el config tambien aqui porque necesitamos leer las variables de entorno .env
    ConfigModule.forRoot(),
    //para añadir mongo en nestjs
    //npm i @nestjs/mongoose mongoose
    //y luego añadimos el esquema que habiamos creado (user.entity.ts)
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    //El modulo para añadir la secret key de JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ]
})
export class AuthModule {}
