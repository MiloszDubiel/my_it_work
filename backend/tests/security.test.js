
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mockowanie bazy danych
jest.unstable_mockModule('../src/config/db.js', () => ({
  connection: {
    query: jest.fn(),
  },
}));

// Dynamiczne importy
const { app } = await import('../server.js');
const { connection } = await import('../src/config/db.js');
const request = (await import('supertest')).default;

describe('Testy Bezpieczeństwa (Security)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Ochrona Endpointów (JWT)', () => {
        it('powinien zablokować dostęp do chronionego zasobu bez tokena', async () => {
            // Przykładowy chroniony endpoint: /api/stats/salary-stats (wymaga roli admin)
            // lub prostszy: /api/employers/filltred (zależy od implementacji)
            
            // Sprawdźmy endpoint, który wymaga logowania
            const res = await request(app)
                .get('/api/stats/salary-stats'); // Zakładam, że istnieje

            expect(res.statusCode).toBeOneOf([401, 403]);
        });

        it('powinien zablokować dostęp z nieprawidłowym tokenem', async () => {
            const res = await request(app)
                .get('/api/stats/salary-stats')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.statusCode).toBe(403);
        });
    });
});

// Helper matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be in [${expected}]`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in [${expected}]`,
        pass: false,
      };
    }
  },
});
