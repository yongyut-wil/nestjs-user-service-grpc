import { Module } from '@nestjs/common';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';
import { HttpModule } from '@nestjs/axios'; // Uncomment if using @nestjs/axios

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    // If you installed and want to use @nestjs/axios HttpModule, import it here
    // HttpModule, // Example: if using HttpModule.register({ timeout: 5000, maxRedirects: 5 })
  ],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserService] // Uncomment if other modules need to inject UserService
})
export class UserModule {}
