/**
 * Role-Based Access Control (RBAC) constants.
 * Used by Nest.js Guards to protect Employee-only routes.
 */
export enum UserRole {
  GUEST = 'GUEST',
  EMPLOYEE = 'EMPLOYEE',
}

/**
 * The core User entity.
 * This represents the document structure stored in Couchbase.
 */
export interface IUser {
  /** Unique identifier (UUID or Couchbase Document Key) */
  id: string;

  /** Unique username, typically the email address for guests */
  username: string;

  /** * Salted and hashed password. 
   * Requirement: Security & Clean Architecture (Never store plain text) 
   */
  passwordHash: string;

  /** Determines if the user sees the Guest portal or Employee dashboard */
  role: UserRole;

  /** Full name for display on the reservation list */
  fullName: string;

  /** Contact details required for the business logic */
  contactInfo: {
    phone: string;
    email: string;
  };

  /** Internal identification (Optional, only for Staff) */
  employeeId?: string;

  /** Audit timestamps for "Logging properly" requirement */
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

/**
 * Data Transfer Object (DTO) for the Auth response.
 * This defines what is sent back to the React/Solidjs frontend.
 */
export interface AuthResponse {
  accessToken: string;
  user: Omit<IUser, 'passwordHash'>;
}
