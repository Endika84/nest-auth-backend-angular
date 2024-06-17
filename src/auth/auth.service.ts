import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login.response';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {

    // const newUser = new this.userModel(createUserDto);
    // return newUser.save();

    //antes de hacer lo de arriba y guardar el nuevo usuario hay que hacer unas cosas:
    // 1- Manejar las excepciones o errores
    try {
      // 2- Encriptar la contraseña
      // instalar npm i bcryptjs
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      
      // 3- Guardar el usuario db, pero mejor sin retornar la constraseña en la llamada
      //return await newUser.save();
      await newUser.save();
      const { password: parsePassword, ...user}= newUser.toJSON();

      return user;

      // 4- General el JWT ????


    } catch (error) {
      //console.log(error.code);
      if(error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exits!`);
      }
      throw new InternalServerErrorException('Algo ha fallado');
    }

  }

  async register(registerDto: RegisterDto): Promise<LoginResponse>{

    //podriamos enviar el create(registerDto) pero si tendrian valores distintos al createDTto se enviarian solo los valores necesarios
    const user = await this.create({email: registerDto.email, name: registerDto.name, password: registerDto.password});

    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse>{

    const {email, password} = loginDto;

    const user = await this.userModel.findOne({email: email});
    if(!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if(!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const {password: parsePassword, ...rest} = user.toJSON();


    return {
      user: rest,
      token: this.getJwtToken({id: user.id}),
    };

  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string): Promise<User>{
    const user= await this.userModel.findById(id);
    const {password, ...rest} = user.toJSON();

    return rest;
  }


  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
