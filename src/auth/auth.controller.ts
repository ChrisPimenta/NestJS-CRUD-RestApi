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
        return 'I am signed up'
    }

    // POST auth/signin
    @Post('signin')
    signin() {
        return 'I am signed in'
    }
}
