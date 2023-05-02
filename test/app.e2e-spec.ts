import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { RegisterDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanAll();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Register KO', () => {
      const payload: RegisterDto = {
        email: 'john@doe.com',
        password: '123456',
        username: 'John Doe',
      };
      it('should throw if email empty', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withJson({
            password: payload.password,
            username: payload.username,
          })
          .expectStatus(400)
          .expectJson({
            statusCode: 400,
            message: ['email should not be empty', 'email must be an email'],
            error: 'Bad Request',
          })
          .toss();
      });
      it('should throw if password empty', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withJson({
            email: payload.email,
            username: payload.username,
          })
          .expectStatus(400)
          .expectJson({
            statusCode: 400,
            message: [
              'password should not be empty',
              'password must be a string',
            ],
            error: 'Bad Request',
          })
          .toss();
      });
      it("shouldn't throw if username empty", async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withJson({
            email: payload.email,
            password: payload.password,
          })
          .expectStatus(201)
          .toss();
      });
    });
    describe('Register OK', () => {
      const payload: RegisterDto = {
        email: 'john1@doe.com',
        password: '123456',
        username: 'John1 Doe',
      };
      it('should work', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withJson(payload)
          .expectStatus(201)
          .toss();
      });
      it('should throw if email already exists', async () => {
        await pactum
          .spec()
          .post('/auth/register')
          .withJson(payload)
          .expectStatus(403)
          .expectJson({
            statusCode: 403,
            message: 'Email already exists',
            error: 'Forbidden',
          })
          .toss();
      });
    });
  });
});
