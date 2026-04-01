# My IT Work - Platforma Rekrutacyjna IT

**My IT Work** to nowoczesna platforma rekrutacyjna dedykowana branży IT, zaprojektowana w celu ułatwienia kontaktu między kandydatami a pracodawcami. System oferuje zaawansowane funkcje czatu w czasie rzeczywistym, zarządzanie ofertami pracy oraz automatyczne zbieranie danych o ofertach (scraping).

##  Kluczowe Funkcjonalności

-   **System Ofert Pracy**: Przeglądanie, filtrowanie i aplikowanie na wybrane stanowiska.
-   **Czat w Czasie Rzeczywistym**: Bezpośrednia komunikacja między kandydatem a pracodawcą (Socket.io).
-   **Panel Administratora i Pracodawcy**: Zarządzanie ofertami, aplikacjami oraz statystykami.
-   **Web Scraping**: Automatyczne pobieranie ofert pracy z zewnętrznych serwisów (Puppeteer).
-   **Statystyki i Analiza**: Interaktywne wykresy i wizualizacja danych rynku pracy.
-   **Uwierzytelnianie i Bezpieczeństwo**: System logowania oparty na JWT (JSON Web Tokens).

##  Zastosowane Technologie

### Frontend
-   **React 19**
-   **Redux Toolkit** (zarządzanie stanem)
-   **React Router** (nawigacja)
-   **Bootstrap & React-Bootstrap** (stylizacja i UI)
-   **Socket.io-client** (komunikacja w czasie rzeczywistym)
-   **Recharts** (wizualizacja danych)
-   **Axios** (zapytania API)

### Backend
-   **Node.js & Express**
-   **MySQL** (baza danych)
-   **Socket.io** (websockety)
-   **Puppeteer & Cheerio** (scraping i automatyzacja)
-   **JSON Web Tokens (JWT)** (autoryzacja)
-   **Multer** (obsługa przesyłania plików)

### Inne
-   **Docker & Docker Compose** (konteneryzacja)
-   **Playwright** (testy E2E)
-   **Jest & Supertest** (testy jednostkowe i integracyjne)

##  Uruchomienie Projektu

Projekt jest w pełni skonteneryzowany, co ułatwia jego lokalne uruchomienie.

### Wymagania
-   Docker
-   Docker Compose

### Kroki
1.  Sklonuj repozytorium:
    ```bash
    git clone [url-repozytorium]
    ```
2.  Zbuduj i uruchom kontenery:
    ```bash
    docker-compose up --build
    ```
3.  Aplikacja będzie dostępna pod adresem:
    -   Frontend: `http://localhost:3000`
    -   Backend API: `http://localhost:5000`
    -   Baza danych MySQL: `localhost:3307`

##  Rozwój
Projekt jest stale rozwijany o nowe funkcje, takie jak zaawansowane dopasowywanie kandydatów (AI) oraz rozbudowany moduł raportowania.
