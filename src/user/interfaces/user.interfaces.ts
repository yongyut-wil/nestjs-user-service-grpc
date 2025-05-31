export interface GetUserByIdRequest {
  id: number;
}

// Interfaces for gRPC (Proto-aligned)
export interface ProtoHair {
  color: string;
  type: string;
}

export interface ProtoCoordinates {
  lat: number;
  lng: number;
}

export interface ProtoAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: ProtoCoordinates;
  country: string;
}

export interface ProtoBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface ProtoCompany {
  department: string;
  name: string;
  title: string;
  address: ProtoAddress; // Assuming company address also uses ProtoAddress structure for gRPC
}

export interface ProtoCrypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface ProtoUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password?: string; // Password is optional in gRPC response
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: ProtoHair;
  ip: string;
  address: ProtoAddress;
  macAddress: string;
  university: string;
  bank: ProtoBank;
  company: ProtoCompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: ProtoCrypto;
  role: string;
}

export interface GetUsersResponse {
  users: ProtoUser[];
  total: number;
  skip: number;
  limit: number;
}

// Interfaces for data from external API (dummyjson.com)
// These are based on user.service.ts and memory
export interface Hair {
  color: string;
  type: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address; // External API's company address structure
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string; // Password is required from external API
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
}

export interface RootObject {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
