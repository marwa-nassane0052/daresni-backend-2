import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EurekaModule } from 'nestjs-eureka';
import { SessionModule } from './session/session.module';
import { DocumentModule } from './document/document.module';
@Module({
  imports: [GroupModule,
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    
    SessionModule,
    
    DocumentModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
/**
EurekaModule.forRoot({
      eureka:{
        host: 'localhost',
        port: 8888,
        registryFetchInterval: 10000,
        maxRetries: 3,
      },
      service:{
        name:"ms-group",
        port:3000
      }
    }), 

 */