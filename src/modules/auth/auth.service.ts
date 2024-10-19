import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto) {
    //Logic register user
    createUserDto;
  }

  async login(loginDto: LoginDto) {
    //Logic login user
    loginDto;
  }
}
