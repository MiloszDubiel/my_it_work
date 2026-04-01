
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mockowanie bazy danych
jest.unstable_mockModule('../src/config/db.js', () => ({
  connection: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

// Dynamiczne importy
const { app } = await import('../server.js');
const { connection } = await import('../src/config/db.js');
const request = (await import('supertest')).default;

describe('Testy Metod API (GET, POST, PUT, DELETE)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /* --- TESTY METODY GET --- */
  describe('GET Endpoints', () => {
    it('GET /api/job-offerts - powinien pobrać listę ofert', async () => {
      connection.query.mockResolvedValueOnce([[{ id: 1, title: 'Testowa Oferta' }]]);
      
      const res = await request(app).get('/api/job-offerts');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Testowa Oferta');
    });

    it('GET /admin/scrape-date - powinien zablokować dostęp bez tokena (Security Check)', async () => {
      const res = await request(app).get('/admin/scrape-date');
      expect(res.statusCode).toBe(401); // Middleware authenticateToken rzuca 403 przy braku tokena w tym projekcie
    });
  });

  /* --- TESTY METODY POST --- */
  describe('POST Endpoints', () => {
    it('POST /api/job-offerts/filltred - powinien filtrować oferty', async () => {
      // getFillteredOfferts jest wywoływane wewnątrz, musimy upewnić się że connection.query zadziała
      connection.query.mockResolvedValueOnce([[{ id: 1, title: 'Filtered Job' }]]);

      const res = await request(app)
        .post('/api/job-offerts/filltred')
        .send({ state: { search: 'Filtered' } });

      expect(res.statusCode).toBe(200);
      expect(res.body[0].title).toBe('Filtered Job');
    });
  });

  /* --- TESTY METODY PUT --- */
  describe('PUT Endpoints', () => {
    it('PUT /admin/users/:id - powinien zablokować edycję bez uprawnień admina', async () => {
      const res = await request(app)
        .put('/admin/users/1')
        .send({ name: 'Nowe Imię', email: 'test@o2.pl', is_active: 1 });

      expect(res.statusCode).toBe(401);
    });
  });

  /* --- TESTY METODY DELETE --- */
  describe('DELETE Endpoints', () => {
    it('DELETE /api/job-offerts/favorites/:user_id/:offer_id - powinien zablokować usuwanie bez tokena', async () => {
      const res = await request(app).delete('/api/job-offerts/favorites/1/10');
      expect(res.statusCode).toBe(401);
    });
  });

});
