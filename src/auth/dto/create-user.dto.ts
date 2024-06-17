import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    //instalamos las librerias npm i class-validator class-transformer
    // sirven para parsear la info que llega del body
    //tambien hay q incluir un codigo en el main.ts, ve alli

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}
