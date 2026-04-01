import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mockowanie axios
jest.mock('axios');
const mockedAxios = axios;

// Mockowanie nawigacji
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Komponent LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderuje formularz logowania poprawnie', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pole hasło/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zaloguj/i })).toBeInTheDocument();
  });

  it('obsługuje wprowadzanie danych', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Pole hasło/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('wysyła żądanie logowania przy poprawnych danych', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: { id: 1, email: 'test@example.com' },
        info: 'Zalogowano',
      },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Pole hasło/i), { target: { value: 'password123' } });
    
    // Kliknij przycisk Zaloguj
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Sprawdź czy nawigacja nastąpiła (z opóźnieniem w komponencie jest setTimeout, więc mockujemy timery lub czekamy)
    // W teście jednostkowym lepiej sprawdzić czy wyświetlił się komunikat sukcesu
    expect(await screen.findByText('Zalogowano')).toBeInTheDocument();
  });

  it('wyświetla błąd przy nieudanym logowaniu', async () => {
  mockedAxios.post.mockRejectedValueOnce({
    response: { data: { error: 'Niepoprawne dane' } },
  });

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/E-mail/i), {
    target: { value: 'test@example.com' },
  });

  fireEvent.change(
    screen.getByLabelText(/Pole hasło/i),
    { target: { value: 'wrong' } }
  );

  fireEvent.click(screen.getByRole('button', { name: /Zaloguj/i }));

  await waitFor(() => {
    expect(screen.getByText('Niepoprawne dane')).toBeInTheDocument();
  });
});
});
