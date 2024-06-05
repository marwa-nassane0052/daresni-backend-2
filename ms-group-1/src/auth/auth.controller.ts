import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor (private readonly authservice:AuthService){}

    
}
