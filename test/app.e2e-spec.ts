import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

// This is e2e and only makes sure things work. integration testing is checking actual data and functions etc. Like unit tests.
describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                // Only use elements which are specified. No extra variables.
                whitelist: true
            })
        );

        await app.init();
        await app.listen(3336);

        // use dependency injection to get a service
        prisma = app.get(PrismaService);

        // Clean the DB
        await prisma.cleanDb();

        pactum.request.setBaseUrl('http://localhost:3336');
    });

    afterAll(() => {
        app.close();
    })

    describe('Auth', () => {
        // Given: User email and password
        const dto: AuthDto = {
            email: 'test@test.com',
            password: 'test',
        }

        describe('Signup', () => {
            it('should throw exception if email empty', () => {
                // Use .inspect() appended like a console log to see what was returned.
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ email: dto.email })
                    .expectStatus(400)
            });

            it('should throw exception if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ password: dto.password })
                    .expectStatus(400)
            });

            it('should throw exception if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({})
                    .expectStatus(400)
            });

            it('should signup', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(dto)
                    .expectStatus(201)
            });
        })

        describe('Signin', () => {
            it('should throw exception if email empty', () => {
                // Use .inspect() appended like a console log to see what was returned.
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ email: dto.email })
                    .expectStatus(400)
            });

            it('should throw exception if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ password: dto.password })
                    .expectStatus(400)
            });

            it('should throw exception if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({})
                    .expectStatus(400)
            });

            it('should signin', () => {
                // Use .inspect() appended like a console log to see what was returned.
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
            });
        })
    });

    describe('User', () => {
        describe('Get me', () => { })
        describe('Edit user', () => { })
    });

    describe('Bookmarks', () => {
        describe('Create bookmark', () => { })
        describe('Get bookmarks', () => { })
        describe('Get bookmark by Id', () => { })
        describe('Edit bookmark', () => { })
        describe('Delete bookmark', () => { })
    });

})
