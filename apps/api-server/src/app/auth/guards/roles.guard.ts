import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@reservation-system/data-access';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the metadata (set by @Roles decorator)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are defined, the route is public
    }

    // 2. Switch context to GraphQL and get the user from the request
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    // 3. Check if the user's role matches one of the required roles
    return requiredRoles.some((role) => user?.role === role);
  }
}
