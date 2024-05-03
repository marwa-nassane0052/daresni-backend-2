import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { EurekaModule } from 'nestjs-eureka';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    EurekaModule.forRoot({
      eureka: {
        host: 'localhost',
        port: 8888,
        registryFetchInterval: 1000,
        servicePath: '/eureka/apps/',
        maxRetries: 3,
      },
      service: {
        name: 'auth-service',
        port: 3000,
      },
    }),
    
    AuthModule,
    UserModule,
    MongooseModule.forRoot("mongodb://localhost:27017/ms-auth"),
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
/*

 EurekaModule.forRoot({
      eureka: {
        host: 'localhost',
        port: 8888,
        registryFetchInterval: 1000,
        servicePath: '/eureka/apps/',
        maxRetries: 3,
      },
      service: {
        name: 'auth-service',
        port: 3000,
      },
    }),
MongooseModule.forRoot('mongodb://127.0.0.1/auth'),


*/