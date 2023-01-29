import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
// automatically generates typescript typings from db schema model
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

// Protect this controller with the jwt strategy if you do not receive the Bearer token in Auth header then 401
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    // GET /users/me
    @Get('me')
    // Can use req object from express js by using ' @Req() req: Request ' as a param. But not advised because Nest has built in functionality
    getMe(@GetUser() user: User) {
        //     getMe(@GetUser('id') userId: number) {
        return user;
    }

    @Patch('edit')
    editUser(@GetUser('id') userId: number, @Body() editUserDto: EditUserDto) {
        return this.userService.editUser(userId, editUserDto);
    }
}
