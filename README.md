# NestJS Test - Innovorder
Note: this project was a test for a job offer (Software engineer Intern), where I was hired.  
Having never done NestJS or TypeScript before this, I decided to leave it on my profile.  
If you're someone who "stumbles" across this repo in the future because you're doing the same test for the same company, good luck!
## Introduction
The goal of this project was to create a NestJS API to retreive barcodes informations via the OpenFoodFacts API, using authenticated routes.

**As a reminder, the project was to have the following features:**
- Allow the registration of an user via login/password
- Authentification of an user via login/password
- On an authenticated route, allow the search of a product on the OpenFoodFact API.

**Bonus Points :**
- User Update
- Caching System for API Calls
- Dockerisation
- Kubernetes Manifest
---
I was able to do mandatory features and some bonuses including:
- User Update
- Get current user info
- Caching System via `@nestjs/cache-manager` and we can force to not use cache with `?force=true` query param
- Delete the authenticated user (and invalidate JWT Token)
- Dockerisation with Docker Compose

## Stack used
The choice of databases and the structure of the route were up to us.
- I used the conventionnal NestJS structures
- JWT (Json Web Token) for authentification
- `@nestjs/axios` for HTTP requests
- Simple Bcrypt for hashing passwords
- For the database, PostgreSQL with Prisma ORM
- And some End-To-End Tests

With this project i was able to discord new technologies and learn about TypeScript, NestJS, Prisma in one day. I used to use ExpressJS or Fastify in my projects but NestJS (which uses Express under the hood) seems to be better structured and optimized for large projects.

## How to use this API ?

### Prerequisites
Each request to the API must be authenticated with a JWT Token (except for `/auth/register` and `auth/login` routes). Token must be in the `Authorization` header with the `Bearer` prefix.

### Routes
#### `POST /auth/register` : Register a new user.
Body:
- `email`: User email
- `password`: User password
- `username?`: User username (optional)

Returns: a JWT Token or an `403` if fields are incorrect.
```json
{
    "token": "JWT Token"
}
```
---
#### `POST /auth/login` : Login an user.
Body:
- `email`: User email
- `password`: User password

Returns: a JWT Token or `403` if Invalid Credentials
```json
{
    "token": "JWT Token"
}
```
---
#### `GET /auth/me` : Get current user info.
Note: This route is authenticated.

Returns: the current user info or `403` if Invalid Credentials
```json
{
    "id": uuid,
    "email": email,
    "username": username,
    "createdAt": date,
    "updatedAt": date
}
```
---
#### `PATCH /auth/me` : Update current user info.
Note: This route is authenticated.

Body:
- `email?`: New user email (optional)
- `password?`: New user password (optionnal)
- `username?`: New user username (optional)

Returns: the updated user info or `403` if Invalid Body
```json
{
    "id": uuid,
    "email": email,
    "username": username,
    "createdAt": date,
    "updatedAt": date
}
```
---
#### `DELETE /auth/me` : Delete current user.
Note: This route is authenticated.

Returns: `204` if success or `403` if Invalid Credentials

---
#### `GET /food/:barcode` : Get product info from OpenFoodFacts API.
Note: This route is authenticated. This returns an `_cached` optionnal field if the product is returned from cache.

Query Param: `force: boolean` if you want to force the API to not use cached informations.

Returns: a JSON body with product info or `403` if Invalid Credentials
```json
{
    ...product_info,
    "_cached": boolean
}
```

## How to run this project ?
### With Docker
You can run this project with Docker and Docker Compose. Docker Compose will do everything for you.  
You just need to run `docker-compose up` and the project will be available on `localhost:3000`.
