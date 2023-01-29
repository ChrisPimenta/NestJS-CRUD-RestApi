import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {

    // Protect this route with the jwt strategy if you do not receive the Bearer token.
    @UseGuards(JwtGuard)
    // GET /users/me
    @Get('me')
    // Can use req object from express js by using ' @Req() req: Request ' as a param. But not advised because Nest has built in functionality
    getMe(@Req() req: Request) {
        return req.user;
    }
}
