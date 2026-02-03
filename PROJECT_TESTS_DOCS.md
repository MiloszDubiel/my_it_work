# Dokumentacja Testów

Projekt posiada trójwarstwową strategię testowania zapewniającą jakość kodu, bezpieczeństwo oraz stabilność działania aplikacji. Poniżej znajduje się szczegółowy opis wdrożonych testów.

## 1. Testy Backendowe (API & Integracyjne)
**Lokalizacja:** `backend/tests/`
**Technologia:** `Jest`, `Supertest`

Testy backendowe weryfikują poprawność działania logiki biznesowej API oraz mechanizmów bezpieczeństwa. Zamiast łączyć się z prawdziwą bazą danych, wykorzystują one **mockowanie** (symulację) połączenia z bazą, co zapewnia szybkość i izolację testów.

### Zaimplementowane Scenariusze:
*   **Logowanie (`POST /auth/login`)**:
    *   Weryfikacja poprawnego logowania (zwrócenie tokena JWT).
    *   Obsługa błędu dla niepoprawnego hasła (400 Bad Request).
    *   Obsługa błędu dla nieistniejącego użytkownika.
*   **Rejestracja (`POST /auth/registre`)**:
    *   Poprawna rejestracja kandydata (utworzenie rekordu w bazie).
    *   Walidacja zgodności haseł (błąd 400 jeśli hasła są różne).
*   **Bezpieczeństwo (`security.test.js`)**:
    *   Weryfikacja ochrony endpointów (Middleware JWT).
    *   Blokowanie dostępu do chronionych zasobów bez tokena autoryzacyjnego.

## 2. Testy Frontendowe (Jednostkowe)
**Lokalizacja:** `frontend/src/Components/**`
**Technologia:** `Jest`, `React Testing Library`

Testy jednostkowe frontendu skupiają się na weryfikacji poszczególnych komponentów interfejsu użytkownika. Sprawdzają one, czy komponenty renderują się poprawnie i reagują na interakcje użytkownika.

### Zaimplementowane Scenariusze (`LoginPage.test.js`):
*   **Renderowanie**: Sprawdzenie czy pola "E-mail", "Hasło" oraz przycisk "Zaloguj" są widoczne na ekranie.
*   **Interakcja**: Symulacja wpisywania tekstu do pól formularza i weryfikacja zmiany stanu.
*   **Komunikacja z API**: Mockowanie biblioteki `axios` w celu symulacji odpowiedzi serwera:
    *   Weryfikacja wysłania poprawnych danych do endpointu `/auth/login`.
    *   Sprawdzenie reakcji interfejsu na sukces logowania.
    *   Sprawdzenie wyświetlania komunikatu błędu w przypadku odrzucenia logowania.

## 3. Testy E2E (End-to-End)
**Lokalizacja:** `e2e/`
**Technologia:** `Playwright`

Testy E2E (End-to-End) to najbardziej zaawansowany poziom testów, który uruchamia prawdziwą przeglądarkę i symuluje zachowanie rzeczywistego użytkownika przeklikującego się przez aplikację. Gwarantują one, że wszystkie elementy systemu (Frontend, Backend, Baza Danych) współpracują ze sobą poprawnie.

### Zaimplementowane Scenariusze (`auth.spec.js`):
*   **Nawigacja**: Wejście na stronę główną/logowania i weryfikacja załadowania treści.
*   **Ścieżka Rejestracji**: Kliknięcie w link "Zarejestruj się" i weryfikacja poprawnego przekierowania URL.
*   **Błędne Logowanie**: Próba zalogowania niepoprawnymi danymi w prawdziwej przeglądarce i oczekiwanie na pojawienie się wizualnego komunikatu błędu dla użytkownika.

### Kompatybilność Przeglądarkowa:
Testy E2E są skonfigurowane do automatycznego uruchamiania na silnikach trzech głównych przeglądarek, co zapewnia kompatybilność aplikacji:
1.  **Chromium** (Google Chrome, Microsoft Edge)
2.  **Firefox** (Mozilla Firefox)
3.  **WebKit** (Safari, Apple devices)
