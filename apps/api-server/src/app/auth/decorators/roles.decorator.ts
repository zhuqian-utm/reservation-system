import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@reservation-system/data-access';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);