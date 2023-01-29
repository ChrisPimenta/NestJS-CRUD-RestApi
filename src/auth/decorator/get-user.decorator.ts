import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (propName: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();

        // To be able to select only a single param from the user object
        if (propName) {
            return request.user[propName];
        }

        return request.user;
    },
);