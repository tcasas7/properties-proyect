import { Module } from '@nestjs/common';
import { PropertiesController } from './controllers/properties.controller';
import { PropertiesService } from './services/properties.service';
import { PrismaService } from './prisma/prisma.service';
import { CalendarController } from './controllers/calendar.controller';
import { CalendarService } from './services/calendar.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { CloudinaryService } from './cloudinary/cloudinary,service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PropertiesController, CalendarController, AuthController],
  providers: [
    PropertiesService,
    CalendarService,
    PrismaService,
    AuthService,
    JwtStrategy,
    CloudinaryService
  ],
})
export class AppModule {}
