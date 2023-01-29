import { AuthGuard } from "@nestjs/passport";

// Custom Guard just to prevent writing AuthGuard('jwt') everytime
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}