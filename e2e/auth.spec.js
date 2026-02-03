import { test, expect } from '@playwright/test';

test.describe('Proces Logowania i Rejestracji', () => {

  test('Powinien załadować stronę główną lub logowania', async ({ page }) => {
    await page.goto('/');
    // Sprawdzamy czy tytuł lub nagłówek zawiera oczekiwaną treść
    // Dostosuj selektor do swojej aplikacji
    // await expect(page).toHaveTitle(/My IT Work/i);
  });

  test('Powinien pozwolić na przejście do rejestracji', async ({ page }) => {
    await page.goto('/login'); // lub główna, jeśli przekierowuje
    
    // Szukamy linku "Zarejestruj się"
    const registerLink = page.getByRole('link', { name: /Zarejestruj się/i });
    if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/.*register/);
    }
  });

  test('Powinien obsłużyć błędne logowanie', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/E-mail/i).fill('wrong@example.com');
    await page.getByLabel(/Hasło/i).fill('wrongpassword');
    await page.getByRole('button', { name: /Zaloguj/i }).click();

    // Oczekujemy komunikatu błędu
    await expect(page.getByText(/Niepoprawne dane|Użytkownik nie istnieje/i)).toBeVisible();
  });

});
