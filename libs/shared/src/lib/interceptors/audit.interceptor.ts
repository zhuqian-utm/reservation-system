import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    let req: any;

    // Handle GraphQL vs REST
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      req = gqlContext.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const { method, url, ip } = req;
    const user = req.user?.userId || 'anonymous';
    const operation = req.body?.operationName || url; // For GraphQL clarity

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `[AUDIT] ${method || 'GQL'} ${operation} - User: ${user} - IP: ${ip} - Duration: ${duration}ms`,
        );
      }),
    );
  }
}
