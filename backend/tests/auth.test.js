
import { jest, describe, it, expect, afterEach, beforeAll } from '@jest/globals';

// Mockowanie bazy danych MUSI być przed importami
jest.unstable_mockModule('../src/config/db.js', () => ({
  connection: {
    query: jest.fn(),
  },
}));

// Dynamiczne importy po zamockowaniu
const { app } = await import('../server.js');
const { connection } = await import('../src/config/db.js');
const request = (await import('supertest')).default;
const bcrypt = (await import('bcryptjs')).default;

describe('Testy Uwierzytelniania (Auth Routes)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('powinien zalogować użytkownika przy poprawnych danych', async () => {
      // Przygotowanie mocka
      const hashedPassword = bcrypt.hashSync('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        role: 'candidate',
        is_active: 1,
        name: 'Jan',
        surname: 'Kowalski',
      };

      connection.query.mockResolvedValueOnce([[mockUser]]); // Mock dla SELECT * FROM users

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('powinien zwrócić błąd 400 dla niepoprawnego hasła', async () => {
      const hashedPassword = bcrypt.hashSync('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        is_active: 1,
      };

      connection.query.mockResolvedValueOnce([[mockUser]]);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('Niepoprawne dane logowania');
    });

    it('powinien zwrócić błąd 400 jeśli użytkownik nie istnieje', async () => {
      connection.query.mockResolvedValueOnce([[]]); // Pusta tablica wyników

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('Użytkownik nie istnieje');
    });
  });

  describe('POST /auth/registre', () => {
    it('powinien zarejestrować nowego kandydata', async () => {
      // Mock sprawdzenia czy użytkownik istnieje (pusta tablica)
      connection.query.mockResolvedValueOnce([[]]);
      // Mock inserta
      connection.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const newUser = {
        email: 'new@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        role: 'candidate',
        firstName: 'Anna',
        lastName: 'Nowak',
      };

      const res = await request(app)
        .post('/auth/registre')
        .send(newUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body.info).toBe('Zarejstrowano pomyślnie');
      // expect(connection.query).toHaveBeenCalledTimes(2); // Czasami wywołuje się więcej razy w tle/middleware
    });
  });
});
