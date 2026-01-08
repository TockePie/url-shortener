<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# URL Shortener

## Description

The simple app to create short URLs

## Project setup

```bash
$ npm install
```

Polute `.env.local` file:

```env
PORT=4000

# DB_URL="postgres://<username>:<password>@localhost:5432/postgres"
DB_URL=

# WEBSITE_URL="https://example.com"
WEBSITE_URL=

CACHE_TTL=300000
BCRYPT_HASH_ROUNDS=10
JWT_SECRET=
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Swagger (OpenAPI)

[Link](https://shu-gamma.vercel.app/swagger#/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
