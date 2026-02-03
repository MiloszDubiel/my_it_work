# Diagramy Projektowe

## Diagram ERD Bazy Danych

Diagram przedstawia strukturę bazy danych na podstawie pliku `init.sql`.

```mermaid
erDiagram
    users {
        int id PK
        varchar email
        varchar password
        enum role "admin, employer, candidate"
        int is_active
        varchar name
        varchar surname
        varchar phone_number
        text avatar
        timestamp created_at
    }

    companies {
        int id PK
        varchar companyName
        text description
        varchar nip
        int owner_id FK
        text img
        text technologies
        text locations
    }

    job_offers {
        int id PK
        int employer_id FK
        int company_id FK
        varchar title
        varchar companyName
        int is_active
        varchar salary
        text technologies
        text experience
        text locations
        enum source "user, justjoinit, nofluffjobs, bulldogjob"
    }

    job_details {
        int id PK
        int job_offer_id FK
        text description
        text requirements
        text benefits
        text responsibilities
        text active_to
    }

    job_applications {
        int id PK
        int user_id FK
        int offer_id FK
        varchar status "oczekuje, zaakceptowana, odrzucona"
        timestamp created_at
    }

    candidate_info {
        int id PK
        int user_id FK "Unique"
        text cv
        text references
        text skills
        text locations
        text edu
        text lang
        text working_mode
    }

    favorites {
        int id PK
        int user_id FK
        int offer_id FK
        timestamp created_at
    }

    conversations {
        int id PK
        int employer_id
        int candidate_id
        timestamp created_at
    }

    messages {
        int id PK
        int conversation_id FK
        int sender_id
        text content
        timestamp created_at
    }

    company_change_requests {
        int id PK
        int company_id FK
        int employer_id FK
        varchar new_company_name
        varchar new_nip
        enum status "pending, approved, rejected"
    }

    %% Relacje
    users ||--o{ companies : "Jeden użytkownik (employer) może mieć firmę"
    users ||--o{ job_offers : "Pracodawca tworzy oferty"
    companies ||--o{ job_offers : "Firma posiada oferty"
    
    users ||--o{ job_applications : "Kandydat składa aplikacje"
    job_offers ||--o{ job_applications : "Oferta ma aplikacje"
    
    job_offers ||--|| job_details : "1:1 Szczegóły oferty"
    
    users ||--|| candidate_info : "1:1 Profil kandydata"
    
    users ||--o{ favorites : "Użytkownik ma ulubione"
    job_offers ||--o{ favorites : "Oferta jest w ulubionych"
    
    conversations ||--o{ messages : "Konwersacja ma wiadomości"
    
    companies ||--o{ company_change_requests : "Firma ma wnioski o zmianę"
```

## Schemat Architektury Systemu

Poniższy diagram przedstawia architekturę całego rozwiązania, z podziałem na kontenery Docker, moduły wewnętrzne oraz dwukierunkową komunikację.

```mermaid
flowchart TB
    subgraph Host[Maszyna Hosta]
        direction TB
        
        subgraph Docker[Środowisko Docker]
            direction TB
            
            %% ---------- FRONTEND CONTAINER ----------
            subgraph FE_Container[Kontener: Frontend (React)]
                direction TB
                UI_Core[Frontend App]
                
                subgraph FE_Modules[Moduły Frontendowe]
                    FE_Auth[Moduł Autoryzacji\n(LoginPage, RegisterPage)]
                    FE_Jobs[Moduł Ofert Pracy\n(JobOffersPage, AddOffert)]
                    FE_Chat[Moduł Czatu\n(Chat Component)]
                    FE_Admin[Panel Administratora\n(AdminPanel)]
                    FE_Emp[Panel Pracodawcy\n(Employers)]
                end
                
                UI_Core --- FE_Auth
                UI_Core --- FE_Jobs
                UI_Core --- FE_Chat
                UI_Core --- FE_Admin
                UI_Core --- FE_Emp
            end

            %% ---------- BACKEND CONTAINER ----------
            subgraph BE_Container[Kontener: Backend (Node.js/Express)]
                direction TB
                API_Gateway[API Server\n(server.js)]
                
                subgraph BE_Modules[Moduły Backendowe]
                    BE_Auth[Kontroler Autoryzacji\n(authRoutes)]
                    BE_Jobs[Serwis Ofert\n(jobOffertsRoutes)]
                    BE_Chat[Obsługa Socket.IO\n(chatRoutes)]
                    BE_Admin[Logika Admina\n(adminRoutes)]
                    BE_Stats[Moduł Statystyk\n(statsRoutes)]
                end
                
                API_Gateway --- BE_Auth
                API_Gateway --- BE_Jobs
                API_Gateway --- BE_Chat
                API_Gateway --- BE_Admin
                API_Gateway --- BE_Stats
            end

            %% ---------- DATABASE CONTAINER ----------
            subgraph DB_Container[Kontener: Baza Danych (MySQL)]
                direction TB
                SQL_DB[(Baza Danych\nMySQL 8.0)]
            end
        end
    end

    %% ---------- EXTERNAL USER ----------
    User((Użytkownik\nPrzeglądarka WWW))

    %% ---------- CONNECTIONS (2-WAY) ----------
    
    %% User <-> Frontend
    User <==>|HTTP / Interakcja| FE_Container
    
    %% Frontend <-> Backend
    FE_Auth <==>|POST /auth/login\n<-- JSON (Token)| BE_Auth
    FE_Jobs <==>|GET/POST /api/job-offerts\n<-- JSON (Oferty)| BE_Jobs
    FE_Chat <==>|WebSocket (Eventy)\n<-- Nowe Wiadomości| BE_Chat
    FE_Admin <==>|API Admina\n<-- Dane Systemowe| BE_Admin
    
    %% Backend <-> Database
    BE_Auth <==>|SELECT/INSERT User\n<-- Wynik Zapytania| SQL_DB
    BE_Jobs <==>|SELECT/INSERT Offer\n<-- Wynik Zapytania| SQL_DB
    BE_Chat <==>|INSERT Message\n<-- ID Wiadomości| SQL_DB
    BE_Admin <==>|CRUD Operations\n<-- Data Rows| SQL_DB
    BE_Stats <==>|Agregacja Danych\n<-- Wyniki Liczbowe| SQL_DB

    %% Styling
    classDef container fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef module fill:#ffffff,stroke:#333,stroke-width:1px;
    classDef db fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    
    class FE_Container,BE_Container,DB_Container container;
    class FE_Auth,FE_Jobs,FE_Chat,FE_Admin,FE_Emp,BE_Auth,BE_Jobs,BE_Chat,BE_Admin,BE_Stats module;
    class SQL_DB db;
```

---

## Diagramy Aktywności

### 1. Uwierzytelnianie Użytkownika (Rejestracja i Logowanie)
```mermaid
flowchart TD
    start((Start)) --> action_choice{Logowanie czy Rejestracja?}
    
    %% Ścieżka Logowania
    action_choice -->|Logowanie| login_form[Wprowadź dane logowania]
    login_form --> validate_login{Pola wypełnione?}
    validate_login -->|Nie| show_login_err[Pokaż błąd] --> login_form
    validate_login -->|Tak| req_login[POST /auth/login]
    req_login --> check_user{Użytkownik istnieje?}
    check_user -->|Nie| login_fail[Błąd: Nie znaleziono użytkownika] --> login_form
    check_user -->|Tak| check_pass{Hasło poprawne?}
    check_pass -->|Nie| login_fail 
    check_pass -->|Tak| check_active{Konto aktywne?}
    check_active -->|Nie| account_inactive[Błąd: Konto zawieszone/nieaktywne] --> login_form
    check_active -->|Tak| gen_token[Generuj token JWT]
    gen_token --> access_granted[Logowanie pomyślne] --> end_login((Koniec))

    %% Ścieżka Rejestracji
    action_choice -->|Rejestracja| reg_form[Wypełnij formularz rejestracji]
    reg_form --> role_choice{Rola?}
    
    role_choice -->|Kandydat| reg_cand[Podaj dane kandydata]
    role_choice -->|Pracodawca| reg_emp[Podaj dane firmy (NIP, Nazwa)]
    
    reg_cand --> req_reg[POST /auth/registre]
    reg_emp --> req_reg
    
    req_reg --> check_dup{Email zajęty?}
    check_dup -->|Tak| show_reg_err[Błąd: Użytkownik istnieje] --> reg_form
    check_dup -->|Nie| create_user[Dodaj użytkownika do DB]
    
    create_user --> role_check_db{Rola?}
    role_check_db -->|Kandydat| set_active[Ustaw Active = 1] 
    role_check_db -->|Pracodawca| insert_company[Dodaj dane firmy] --> set_inactive[Ustaw Active = 0]
    
    set_active --> reg_success[Sukces: Zarejestrowano] --> end_reg((Koniec))
    set_inactive --> wait_admin[Sukces: Oczekiwanie na aktywację Administratora] --> end_reg
```

### 2. Cykl Życia Oferty Pracy i Aplikacji
```mermaid
flowchart TD
    start((Start)) --> role_check{Rola Użytkownika?}
    
    %% Pracodawca: Dodawanie Oferty
    role_check -->|Pracodawca| emp_action{Akcja?}
    emp_action -->|Dodaj Ofertę| fill_offer[Wypełnij szczegóły oferty & Wymagania]
    fill_offer --> post_offer[POST /api/job-offerts/add]
    post_offer --> save_offer[Transakcja DB: Oferta + Szczegóły]
    save_offer --> offer_live[Oferta Aktywna]
    
    %% Kandydat: Aplikowanie
    role_check -->|Kandydat| browse[Przeglądaj Oferty]
    browse --> filter[Filtruj po Technologii/Lokalizacji]
    filter --> select_offer[Otwórz Ofertę]
    select_offer --> apply_decide{Aplikować?}
    apply_decide -->|Nie| browse
    apply_decide -->|Tak| post_app[POST /api/job-offerts/applications]
    post_app --> app_saved[Aplikacja Zapisana]
    
    %% Pracodawca: Przegląd Aplikacji
    emp_action -->|Przeglądaj Aplikacje| get_apps[GET /api/employers/get-my-applications]
    get_apps --> list_apps[Lista Kandydatów]
    list_apps --> judge_app{Decyzja?}
    judge_app -->|Akceptuj| mark_accept[Aktualizuj Status: 'zaakceptowana']
    judge_app -->|Odrzuć| mark_reject[Aktualizuj Status: 'odrzucono']
    
    mark_accept --> notify_cand[Proces Zakończony]
    mark_reject --> notify_cand
```

### 3. Panel Administratora
```mermaid
flowchart TD
    start((Start)) --> admin_dash[Panel Administratora]
    admin_dash --> choice{Zarządzaj Sekcją}
    
    choice -->|Użytkownicy| list_users[Lista Użytkowników /admin/get-users]
    list_users --> user_action{Akcja}
    user_action -->|Aktywuj/Dezaktywuj| update_user[PUT /users/:id]
    user_action -->|Usuń| del_user[DELETE /delete-user]
    
    choice -->|Firmy| list_comps[Lista Firm]
    list_comps --> comp_reqs[Sprawdź wnioski o zmianę danych]
    comp_reqs --> req_decision{Zatwierdzić?}
    req_decision -->|Tak| update_comp[Aktualizuj dane firmy]
    req_decision -->|Nie| reject_req[Odrzuć wniosek]
    
    choice -->|Oferty| list_offers[Lista Ofert]
    list_offers --> del_offer[Usuń nieodpowiednią ofertę]
    
    choice -->|Scraper| run_scrap[Uruchom Scraper]
    run_scrap --> bg_job[Zadanie w tle (Backend)]
```

---

## Diagramy Sekwencji

### 1. Proces Aplikowania na Ofertę (Komunikacja Dwustronna)
```mermaid
sequenceDiagram
    actor Candidate as Kandydat
    participant Frontend
    participant API
    participant DB as Baza Danych

    Candidate->>Frontend: Kliknij "Aplikuj"
    Frontend->>API: POST /api/job-offerts/applications {user_id, offer_id}
    API->>API: Sprawdź Autoryzację (Token)
    API->>DB: INSERT INTO job_applications (user_id, offer_id, status='sent')
    DB-->>API: Potwierdzenie zapisu (Success)
    API-->>Frontend: 200 OK "Aplikacja dodana"
    
    note over Frontend: Aplikacja widoczna dla Pracodawcy
    
    actor Employer as Pracodawca
    Employer->>Frontend: Zobacz "Moje Aplikacje"
    Frontend->>API: POST /api/employers/get-my-applications
    API->>DB: JOIN job_applications, users...
    DB-->>API: Zwróć dane kandydatów
    API-->>Frontend: Prześlij listę JSON
    
    Employer->>Frontend: Kliknij "Zaakceptuj"
    Frontend->>API: POST /status-update {status: 'zaakceptowana'}
    API->>DB: UPDATE job_applications SET status = ...
    DB-->>API: Zwróć liczbę zmienionych wierszy
    API-->>Frontend: 200 OK (Status zmieniony)
```

### 2. Wniosek o Zmianę Danych Firmy
```mermaid
sequenceDiagram
    actor Employer as Pracodawca
    participant API
    participant DB as Baza Danych
    actor Admin as Administrator

    Employer->>API: POST /request-company-change
    API->>DB: Czy istnieje oczekujący wniosek?
    DB-->>API: Wynik (Tak/Nie)
    
    alt Istnieje oczekujący
        API-->>Employer: 400 "Czekaj na odpowiedź"
    else Brak oczekujących
        API->>DB: INSERT INTO company_change_requests
        DB-->>API: Potwierdzenie ID
        API-->>Employer: 200 "Wniosek wysłany"
    end
    
    Admin->>API: GET /admin/company-change-requests
    API->>DB: SELECT * FROM requests WHERE pending
    DB-->>API: Lista wniosków
    API-->>Admin: Wyświetl listę
    
    Admin->>API: POST /approve-company-change
    API->>DB: UPDATE companies SET ...
    DB-->>API: Potwierdzenie
    API->>DB: UPDATE requests SET status='approved'
    DB-->>API: Potwierdzenie
    API-->>Admin: Sukces
```

### 3. Edycja Profilu
```mermaid
sequenceDiagram
    actor User as Użytkownik
    participant Frontend
    participant API
    participant DB as Baza Danych

    User->>Frontend: Aktualizuj Profil
    Frontend->>API: POST /user/edit-profile (dane + plik)
    
    API->>API: Przetwarzanie pliku (Multer)
    API->>DB: UPDATE users SET ...
    DB-->>API: Status wykonania
    
    API->>DB: SELECT * FROM users WHERE id=?
    DB-->>API: Zwróć zaktualizowane dane
    API-->>Frontend: 200 OK {user: noweDane}
```

### 4. Czat w Czasie Rzeczywistym
```mermaid
sequenceDiagram
    actor UserA as Użytkownik A
    participant ClientA as Klient A
    participant SocketServer as Serwer Socket.IO
    participant DB as Baza Danych
    participant ClientB as Klient B
    actor UserB as Użytkownik B

    UserA->>ClientA: Łączy z czatem
    ClientA->>SocketServer: socket.join(roomId)
    SocketServer-->>ClientA: Potwierdzenie dołączenia

    UserA->>ClientA: Wysyła "Cześć"
    ClientA->>SocketServer: socket.emit('send_message')
    
    SocketServer->>DB: INSERT INTO messages
    DB-->>SocketServer: Potwierdzenie i ID
    
    par Rozgłaszanie (Broadcast)
        SocketServer->>ClientB: emit('receive_message')
        SocketServer->>ClientA: emit('receive_message')
    end
    
    ClientB-->>UserB: Wyświetl wiadomość
```
