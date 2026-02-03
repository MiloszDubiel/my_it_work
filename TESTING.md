# Instrukcja Obsługi Testów

Projekt zawiera kompleksowy zestaw testów obejmujący backend, frontend oraz testy E2E (End-to-End).

## 1. Testy Backend (API, Baza Danych, Bezpieczeństwo)

Testy te weryfikują działanie API, uwierzytelnianie, zabezpieczenia ról oraz logikę biznesową. Wykorzystują biblioteki `jest` i `supertest`.

### Jak uruchomić?
1. Otwórz terminal w folderze `backend`:
   ```bash
   cd backend
   ```
2. Uruchom testy:
   ```bash
   npm test
   ```

### Co jest testowane?
- **Uwierzytelnianie (`auth.test.js`)**: Logowanie, Rejestracja, obsługa błędów.
- **Bezpieczeństwo (`security.test.js`)**: Ochrona endpointów przed nieautoryzowanym dostępem (rolami).

---

## 2. Testy Frontend (Komponenty React)

Testy jednostkowe weryfikujące renderowanie komponentów i interakcje użytkownika. Wykorzystują `React Testing Library`.

### Jak uruchomić?
1. Otwórz terminal w folderze `frontend`:
   ```bash
   cd frontend
   ```
2. Uruchom testy:
   ```bash
   npm test
   ```
   *(Domyślnie uruchamia się w trybie interaktywnym. Aby uruchomić raz, użyj: `npm test -- --watchAll=false`)*

### Co jest testowane?
- **Komponent Login (`LoginPage.test.js`)**: Poprawność formularza, walidacja pól, wysyłanie danych.

---

## 3. Testy E2E i Kompatybilności (Playwright)

Testy "End-to-End" symulują zachowanie prawdziwego użytkownika w przeglądarce. Sprawdzają działanie całej aplikacji (Frontend + Backend + Baza Danych). Testy są uruchamiane na 3 silnikach przeglądarek: **Chromium (Chrome/Edge)**, **Firefox** i **WebKit (Safari)**, co zapewnia weryfikację kompatybilności.

### Wymagania wstępne
- Backend i Frontend muszą być uruchomione (np. na portach 5000 i 3000).
- Przy pierwszym uruchomieniu zainstaluj przeglądarki poleceniem (w głównym folderze):
  ```bash
  npx playwright install
  ```

### Jak uruchomić?
1. Otwórz terminal w **głównym folderze projektu** (`my_it_work`).
2. Uruchom testy (w tle):
   ```bash
   npx playwright test
   ```
3. Aby zobaczyć interfejs graficzny:
   ```bash
   npx playwright test --ui
   ```
4. Aby wyświetlić raport HTML po testach:
   ```bash
   npx playwright show-report
   ```

### Co jest testowane?
- **Scenariusze Pełne (`auth.spec.js`)**: Wejście na stronę, proces logowania, nawigacja.

---

## Struktura Plików Testowych

- `backend/tests/` - Testy API i jednostkowe backendu.
- `frontend/src/Components/**/__tests__/` lub `*.test.js` - Testy komponentów.
- `e2e/` - Testy E2E (Playwright).
- `playwright.config.js` - Konfiguracja Playwright.
