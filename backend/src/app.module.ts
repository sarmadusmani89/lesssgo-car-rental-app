import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { User } from './user/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Uses your DATABASE_URL directly
      entities: [User],
      synchronize: true, // set to false in production
    }),
    UsersModule,
  ],
})
export class AppModule {}
