import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // The ConfigModule is used to manage configuration options in your application. By setting it as global, the configuration options (e.g., environment variables) are accessible across your entire application.
    // Loads environment variables from a .env file.
    // Setting isGlobal: true makes the config available globally (no need to re-import in other modules).
    ConfigModule.forRoot({ isGlobal: true }),

    // The MongooseModule integrates the Mongoose ODM (Object Document Mapper) with your NestJS application, allowing you to interact with a MongoDB database.
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'cvoptimizer' }),

    // The ServeStaticModule is used to serve static files (e.g., HTML, CSS, JavaScript files) from the specified rootPath. 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'build'),
    }),

    // RoleModule,
    // RightsModule,
    // GroupModule,
    // ProgramModule,
    // UserModule,
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
