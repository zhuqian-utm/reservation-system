import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../api-server/src/app/app.module';

describe('Reservation (e2e)', () => {
  let app: INestApplication;
  let employeeToken: string;
  let guestToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Helper to get tokens for different roles
    const getAuthToken = async (username: string) => {
      const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken }
        }
      `;
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: loginMutation,
          variables: { input: { username, password: 'password123' } },
        });
      return res.body.data.login.accessToken;
    };

    // 1. Setup tokens for different security scenarios
    employeeToken = await getAuthToken('test_employee');
    guestToken = await getAuthToken('test_guest');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GraphQL Operations', () => {
    it('should create reservation with valid data (GraphQL)', async () => {
      const testData = {
        guestId: 'guest_123',
        roomNumber: '101',
        arrivalTime: new Date().toISOString(),
      };

      const mutation = `
        mutation CreateReservation($input: CreateReservationInput!) {
          createReservation(input: $input) {
            id
            status
          }
        }
      `;

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          query: mutation,
          variables: { input: testData },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.createReservation).toBeDefined();
      expect(res.body.data.createReservation.status).toBe('PENDING');
    });
  });

  describe('Security & Protection', () => {
    it('should prevent N1QL/SQL injection attempts', async () => {
      // Malicious string targeting N1QL
      const maliciousInput =
        '"; DELETE FROM `bucket_reservations` WHERE "1"="1';

      const query = `
        query Browse($date: String!) {
          browseReservations(date: $date) { id }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          query,
          variables: { date: maliciousInput }, // Using variables is the real protection
        });

      expect(response.status).toBe(200);
      // Ensure no error occurred, but no data was returned for the garbage string
      if (response.body.data) {
        expect(Array.isArray(response.body.data.browseReservations)).toBe(true);
        expect(response.body.data.browseReservations.length).toBe(0);
      }
    });

    it('should return UNAUTHENTICATED for invalid JWT format', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer invalid-garbage-token')
        .send({
          query: '{ browseReservations(date: "2026-05-01") { id } }',
        });

      // NestJS GraphQL usually returns 200 with an errors array
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions?.code).toBe('UNAUTHENTICATED');
    });

    it('should return 403 Forbidden when a Guest tries to access Employee routes', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${guestToken}`) // Role: GUEST
        .send({
          query: '{ browseReservations(date: "2026-05-01") { id } }',
        });

      expect(response.body.errors).toBeDefined();
      // Verify RolesGuard logic
      expect(response.body.errors[0].message).toMatch(/Forbidden|forbidden/);
    });
  });
});
