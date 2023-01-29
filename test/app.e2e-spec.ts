import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

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
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAccessToken', 'access_token');
            });
        })
    });

    describe('User', () => {
        describe('Get me', () => {
            it('should get exception if no Bearer token', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .expectStatus(401)
            })

            it('should get exception if incorrect Bearer token', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer itryhackyou'
                    })
                    .expectStatus(401)
            })

            it('should get current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(200)
            })
        })

        describe('Edit user', () => {
            it('should get current user', () => {

                const dto: EditUserDto = {
                    email: 'test2@gmail.com',
                    firstName: 'Chris',
                    lastName: 'Test',
                }

                return pactum
                    .spec()
                    .patch('/users/edit')
                    .withBody(dto)
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(200)
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.lastName)
                    .expectBodyContains(dto.email)
            })
        })
    });

    describe('Bookmarks', () => {
        describe('Get empty bookmarks', () => {
            it('User without bookmarks gets empty list', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(200)
                    .expectBody([])
            })
        })

        describe('Create bookmark', () => {
            const dto: CreateBookmarkDto = {
                title: 'First link',
                link: 'https://some-url.com',
                description: 'This is my first bookmark ever. Cool!'
            }

            it('Create bookmark', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('bookmarkId', 'id')
            })
        })

        describe('Get bookmarks', () => {
            it('Get bookmarks created', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(1)
            })
        })

        describe('Get bookmark by Id', () => {
            it('Get a bookmark', () => {
                return pactum
                    .spec()
                    .get('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(200)
            })
        })

        describe('Edit bookmark', () => {
            const dto: EditBookmarkDto = {
                title: 'Edited link',
                link: 'https://some-ursssl.com',
                description: 'I edited this desc'
            }

            it('Edit a bookmark', () => {
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .withBody(dto)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description)
                    .expectStatus(200)
            })
        })

        describe('Delete bookmark', () => {

            it('Delete a bookmark', () => {
                return pactum
                    .spec()
                    .delete('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        // Use the variable from the store by using $s{varName} inside a regular string
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(204)
            })
        })
    });

})
