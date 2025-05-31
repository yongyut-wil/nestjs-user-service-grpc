import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import {
  GetUserByIdRequest,
  ProtoUser,
  GetUsersResponse,
  User,
  RootObject,
  Address as ApiAddress,
  Bank as ApiBank,
  Company as ApiCompany,
  Coordinates as ApiCoordinates,
  Crypto as ApiCrypto,
  Hair as ApiHair,
  ProtoAddress,
  ProtoBank,
  ProtoCompany,
  ProtoCoordinates,
  ProtoCrypto,
  ProtoHair
} from '../interfaces/user.interfaces';

// Helper function to map API Address to ProtoAddress
function mapApiAddressToProtoAddress(apiAddress: ApiAddress): ProtoAddress {
  if (!apiAddress) return undefined;
  return {
    ...apiAddress,
    coordinates: apiAddress.coordinates as ProtoCoordinates, // Assuming direct compatibility for coordinates
  };
}

// Helper function to map API Company to ProtoCompany
function mapApiCompanyToProtoCompany(apiCompany: ApiCompany): ProtoCompany {
  if (!apiCompany) return undefined;
  return {
    ...apiCompany,
    address: mapApiAddressToProtoAddress(apiCompany.address),
  };
}

// Helper function to map API User to ProtoUser
function mapUserToProtoUser(user: User): ProtoUser {
  if (!user) return undefined;
  // Explicitly map fields, excluding password for gRPC response by default
  // The ProtoUser interface makes password optional, aligning with this.
  const { password, ...restOfUser } = user;
  return {
    ...restOfUser,
    // Ensure nested structures are also mapped if their types differ
    // For simplicity, direct assignment is used where types are compatible (e.g. Hair, Bank, Crypto)
    // but for Address and Company, we use mappers if their internal structure for Proto differs.
    hair: user.hair as ProtoHair, // Assuming ApiHair and ProtoHair are compatible
    address: mapApiAddressToProtoAddress(user.address),
    bank: user.bank as ProtoBank, // Assuming ApiBank and ProtoBank are compatible
    company: mapApiCompanyToProtoCompany(user.company),
    crypto: user.crypto as ProtoCrypto, // Assuming ApiCrypto and ProtoCrypto are compatible
  };
}

@Controller() // No path needed for gRPC controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUsers')
  async getUsers(/*request: any*/): Promise<GetUsersResponse> { // GetUsersRequest is empty
    const rootObject: RootObject = await this.userService.findAll();
    return {
      users: rootObject.users.map(mapUserToProtoUser),
      total: rootObject.total,
      skip: rootObject.skip,
      limit: rootObject.limit,
    };
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(request: GetUserByIdRequest): Promise<ProtoUser> {
    const user: User = await this.userService.findOneById(request.id);
    return mapUserToProtoUser(user);
  }
}

