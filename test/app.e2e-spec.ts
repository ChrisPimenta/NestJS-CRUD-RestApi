import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';


describe('App e2e', () => {
    let app: INestApplication;

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
    });

    afterAll(() => {
        app.close();
    })

    it.todo('should pass');
})
