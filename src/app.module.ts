import { Module } from '@nestjs/common';
import { globalPipe } from './core/pipe/global.pipe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigFactory } from './common/config/typeorm.config';
import { PatientModule } from './module/patient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    PatientModule,
  ],
  providers: [globalPipe],
})
export class AppModule {}
