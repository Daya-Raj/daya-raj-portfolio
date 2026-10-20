# Portfolio Contact API (Spring Boot)

Standalone REST API for the portfolio's Contact page. It is independent of the frontend and is **not** hosted by Lovable — run or deploy it yourself.

Endpoints: `POST /api/contact`, `GET /api/health`. There are deliberately no endpoints to list or delete messages.

## 1. Prerequisites
- Java 21 (`java -version`)
- Maven 3.9+ — or use the included wrapper `./mvnw` (`mvnw.cmd` on Windows)
- MySQL 8

## 2. Create the database
```sql
CREATE DATABASE portfolio_contact CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio'@'%' IDENTIFIED BY 'change-me';
GRANT SELECT, INSERT, UPDATE ON portfolio_contact.* TO 'portfolio'@'%';
-- for local ddl-auto=update also: GRANT CREATE, ALTER, INDEX ON portfolio_contact.* TO 'portfolio'@'%';
```

## 3. Environment variables
Copy `.env.example` to `.env` and fill it in, then export it (`set -a; . ./.env; set +a`). Never commit `.env`.

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 8080) |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | MySQL connection |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | SMTP server |
| `MAIL_FROM` | Verified sender address (the `From`) |
| `OWNER_EMAIL` | Where notifications go |
| `ALLOWED_ORIGINS` | Comma-separated exact frontend origins (no `*`) |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS` | Per-IP submission limit |

## 4. SMTP
Example for Gmail: enable 2-Step Verification, create an App Password, then set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USERNAME`/`MAIL_FROM` = your Gmail address, `SMTP_PASSWORD` = the app password.

The visitor's address is only placed in `Reply-To`; the email is plain text, and CR/LF is stripped from header fields. If SMTP is not configured the message is still saved with `email_status = NOT_CONFIGURED` and the API says so; on delivery failure it is saved as `FAILED`.

## 5. Run locally
```bash
./mvnw spring-boot:run      # or: mvn spring-boot:run
./mvnw test                 # unit tests (email is mocked, no DB needed)
./mvnw package && java -jar target/portfolio-contact-1.0.0.jar
```
Note: the frontend dev server also uses port 8080 — run the API on another port locally, e.g. `PORT=8081`.

## 6. Try it
```bash
curl -i -X POST http://localhost:8081/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Example Visitor","email":"visitor@example.com","subject":"Project collaboration","message":"I would like to discuss a potential collaboration."}'
```
Responses: `201` `{success, message, referenceId, emailStatus}` · `400` with `errors` per field · `413` too large · `429` rate limited · `503` could not save (nothing stored).

## 7. Connect the frontend
Set `VITE_API_BASE_URL` (e.g. `http://localhost:8081`) in the frontend and POST JSON to `${VITE_API_BASE_URL}/api/contact`. Show loading, disable the button while sending, map `errors` to fields, clear the form only on `201`. Never put SMTP or DB values in `VITE_*` variables. The published Lovable site cannot reach `localhost`, so it needs the deployed API URL.

## 8. Deploy
- Any Java host (Render, Railway, Fly.io, a VPS). Set all variables as host secrets.
- Set `ALLOWED_ORIGINS=https://dayarajportfolio.lovable.app` (plus any custom domain).
- Set `JPA_DDL_AUTO=validate` and manage schema with Flyway/Liquibase migrations.
- The rate limit is in memory per instance; behind multiple instances use Redis or a gateway/WAF limit, and make sure the proxy forwards the real client IP (`server.forward-headers-strategy=framework`).
