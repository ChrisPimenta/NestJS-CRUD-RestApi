import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    // Dependency injection
    constructor(private authService: AuthService) {
    }

    // Automatically returns 201 for successful POST
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

    // We do not create a new resource so we return 200
    @HttpCode(HttpStatus.OK)
    // POST auth/signin
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
