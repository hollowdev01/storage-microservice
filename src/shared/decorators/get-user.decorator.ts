import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export const GetUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    //Simulated user auth
    request.user = {
      id: randomUUID(),
      username: 'mock-user',
    };

    return request.user;
  },
);
