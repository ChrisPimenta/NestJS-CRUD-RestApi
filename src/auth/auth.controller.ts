import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    // Dependency injection
    constructor(private authService: AuthService) {
    }

    // POST auth/signup
    @Post('signup')
    // Comes from express
    signup(@Body() dto: AuthDto) {
        console.log({
            dto
        })
        // Returned datatype is auto converted
        return this.authService.signup(dto);
    }

    // POST auth/signin
    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}
