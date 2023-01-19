import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    // Dependency injection
    constructor(private authService: AuthService) {
    }

    // POST auth/signup
    @Post('signup')
    signup() {
        // Returned datatype is auto converted
        return this.authService.signup();
    }

    // POST auth/signin
    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}
