# NestJS gRPC User Service

This project is a User Service built with NestJS and gRPC. It fetches user data from the external API `https://dummyjson.com/users` and exposes it through gRPC endpoints.

## Prerequisites

*   Node.js (v16 or later recommended)
*   Yarn (or npm)

## Installation

1.  Clone the repository (if applicable) or ensure you are in the project directory `user-service-grpc`.
2.  Install dependencies:
    ```bash
    yarn install
    # or
    # npm install
    ```

## Running the Application

To start the gRPC microservice:

```bash
yarn build
yarn start:prod
# or for development (uses ts-node, might be slower to reflect .proto changes on first run without build)
# yarn start:dev
```
The service will run on `0.0.0.0:50051` by default. You should see a console log: `User gRPC microservice is running on port 50051`.

**Note:** It's recommended to run `yarn build` (or `npm run build`) first, especially after changes to `.proto` files or `nest-cli.json`, to ensure assets are correctly copied to the `dist` folder before running with `start:prod` or `start:dev`.

## Project Structure

*   `proto/user.proto`: Defines the gRPC service and message types.
*   `src/main.ts`: Entry point, configures and starts the gRPC microservice.
*   `src/user.module.ts`: The main module for user-related features.
*   `src/user/controllers/user.controller.ts`: Implements gRPC methods defined in `user.proto`.
*   `src/user/services/user.service.ts`: Fetches data from `https://dummyjson.com/users`.
*   `nest-cli.json`: Configuration for NestJS CLI, including asset management for `.proto` files.

## gRPC Service Definition

The gRPC service is defined in `proto/user.proto`.

**Service:** `UserService`
**Package:** `user`

**RPC Methods:**

1.  **`GetUsers(GetUsersRequest) returns (GetUsersResponse)`**
    *   Fetches a list of all users.
    *   `GetUsersRequest`: Currently empty.
    *   `GetUsersResponse`: Contains `users` (list of `User`), `total`, `skip`, `limit`.

2.  **`GetUserById(GetUserByIdRequest) returns (User)`**
    *   Fetches a single user by their ID.
    *   `GetUserByIdRequest`: Contains `id` (int32).
    *   `User`: The user object.

## Calling the gRPC Service

You can use any gRPC client to interact with this service. Here's an example using `grpcurl`.

**Prerequisites for `grpcurl`:**
*   Install `grpcurl`: [grpcurl Installation Guide](https://github.com/fullstorydev/grpcurl#installation)

**1. List Services (after starting the server):**
```bash
grpcurl -plaintext localhost:50051 list
```
Expected output:
```
grpc.reflection.v1alpha.ServerReflection
user.UserService
```
*(Note: `grpc.reflection.v1alpha.ServerReflection` might not be enabled by default in NestJS gRPC. If it's not listed, you can still call methods directly if you know the service and method names.)*

**2. Describe Service:**
```bash
grpcurl -import-path ./proto -proto user.proto -plaintext localhost:50051 describe user.UserService
```

**3. Call `GetUsers`:**
```bash
grpcurl -import-path ./proto -proto user.proto -plaintext -d '{}' localhost:50051 user.UserService.GetUsers
```

**4. Call `GetUserById`:**
Replace `1` with the desired user ID.
```bash
grpcurl -import-path ./proto -proto user.proto -plaintext -d '{"id": 1}' localhost:50051 user.UserService.GetUserById
```

### Example Node.js gRPC Client

You can also create a client in Node.js. First, ensure you have `@grpc/grpc-js` and `@grpc/proto-loader` in your client project.

**`client.js` (Example - place in the root of `user-service-grpc` or adjust `PROTO_PATH`):**
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Path to the .proto file, relative to where client.js is run
const PROTO_PATH = path.join(__dirname, 'proto/user.proto'); 

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const user_proto = grpc.loadPackageDefinition(packageDefinition).user;

function main() {
  const client = new user_proto.UserService('localhost:50051', grpc.credentials.createInsecure());

  // GetUsers example
  client.GetUsers({}, (err, response) => {
    if (err) {
      console.error('Error getting users:', err);
      return;
    }
    console.log('Users (first 2):', JSON.stringify(response.users.slice(0, 2), null, 2)); 
    console.log('Total users:', response.total);
  });

  // GetUserById example
  const userId = 1;
  client.GetUserById({ id: userId }, (err, user) => {
    if (err) {
      console.error(`Error getting user ${userId}:`, err);
      return;
    }
    console.log(`User ${userId}:`, JSON.stringify(user, null, 2));
  });
}

main();
```
Save this as `client.js` in the root of the `user-service-grpc` project. Run it with `node client.js` (after starting the server).
