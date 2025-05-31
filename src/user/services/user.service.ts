import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User, RootObject } from '../interfaces/user.interfaces';

@Injectable()
export class UserService {
  private readonly usersUrl = 'https://dummyjson.com/users';

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<RootObject> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<RootObject>(this.usersUrl)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Consider using NestJS built-in exception filters or custom ones
      throw error; 
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<User>(`${this.usersUrl}/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      // Consider using NestJS built-in exception filters or custom ones
      throw error; 
    }
  }
}

