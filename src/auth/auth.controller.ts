import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller({})
export class AuthController {
    // Dependency injection
    constructor(private authService: AuthService) {
    }
}
