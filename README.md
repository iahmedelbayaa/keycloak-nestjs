# NestJS + Keycloak Integration Guide

This project demonstrates how to assume Keycloak authentication in a NestJS application using `nest-keycloak-connect`.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js and NPM

## Step 1: Start Keycloak

We have provided a `docker-compose.yml` file to quickly start Keycloak.

```bash
docker-compose up -d
```

Access Keycloak at [http://localhost:8080](http://localhost:8080).
**Admin Credentials:**
- Username: `admin`
- Password: `admin`

## Step 2: Configure Keycloak

1.  **Login** to the Keycloak Admin Console.
2.  **Create a Realm**:
    - Hover over "Master" in the top-left corner and click **Create Realm**.
    - Name it `nestjs-realm`.
3.  **Create a Client**:
    - Go to **Clients** > **Create client**.
    - Client ID: `nestjs-app`.
    - Capability config: Ensure **Client authentication** is ON (this enables the secret) and **Authorization** is ON if you want fine-grained auth (optional for this demo).
    - Save.
4.  **Get Client Secret**:
    - Go to the **Credentials** tab of the `nestjs-app` client.
    - Copy the **Client secret**.
    - Open `.env` in this project and paste it into `KEYCLOAK_SECRET`.
5.  **Create a User**:
    - Go to **Users** > **Add user**.
    - Username: `user1`.
    - Click **Create**.
    - Go to the **Credentials** tab and set a password (e.g., `1234`). Disabling "Temporary" will avoid password reset on login.
6.  **Create a Role**:
    - Go to **Realm roles** > **Create role**.
    - Role Name: `admin`.
    - Save.
7.  **Assign Role to User** (Optional, to test admin route):
    - Go to **Users**, click on your user.
    - Go to **Role mapping** tab.
    - Click **Assign role** and select `admin`.

## Step 3: Run the NestJS App

```bash
npm install
npm run start:dev
```

## Step 4: Test Endpoints

The app has three endpoints in `src/app.controller.ts`:

1.  `GET /` (Public): Accessible by anyone.
2.  `GET /private` (Protected): Requires a valid JWT token.
3.  `GET /admin` (Role Protected): Requires a valid JWT token with `admin` realm role.

### How to test with Postman/Curl

1.  **Get a Token**:
    ```bash
    curl -X POST 'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/token' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'client_id=nestjs-app' \
    -d 'client_secret=YOUR_CLIENT_SECRET' \
    -d 'username=user1' \
    -d 'password=1234' \
    -d 'grant_type=password'
    ```
    Copy the `access_token` from the response.

2.  **Call Private Endpoint**:
    ```bash
    curl http://localhost:3000/private -H "Authorization: Bearer <ACCESS_TOKEN>"
    ```

## Project Structure

- **src/app.module.ts**: Configures `KeycloakConnectModule` and sets up global guards (`AuthGuard`, `ResourceGuard`, `RoleGuard`).
- **src/app.controller.ts**: Demonstrates `@Public()`, `@Roles()`, and default protected routes.
- **docker-compose.yml**: Keycloak setup.
- **.env**: Environment variables.
