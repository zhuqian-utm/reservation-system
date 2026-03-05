import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    // 1. Check if the context type is 'graphql'
    if (context.getType<string>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }

    // 2. If it's REST (HTTP), use the standard NestJS switch
    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
  }
}
