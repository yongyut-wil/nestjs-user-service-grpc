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
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5); // Set a 5-second deadline

  console.log('Attempting to call GetUsers...');
  client.GetUsers({}, { deadline }, (err, response) => {
    if (err) {
      console.error('Error getting users:', err.message);
      // Check for specific connection errors
      if (err.code === grpc.status.UNAVAILABLE) {
        console.error('Service unavailable. Is the server running at localhost:50051?');
      }
      return;
    }
    console.log('GetUsers Response Received:');
    console.log('Users (first 2):', JSON.stringify(response.users.slice(0, 2), null, 2)); 
    console.log('Total users:', response.total);
  });

  const userId = 1;
  console.log(`\nAttempting to call GetUserById for ID: ${userId}...`);
  client.GetUserById({ id: userId }, { deadline }, (err, user) => {
    if (err) {
      console.error(`Error getting user ${userId}:`, err.message);
      if (err.code === grpc.status.UNAVAILABLE) {
        console.error('Service unavailable. Is the server running at localhost:50051?');
      }
      return;
    }
    console.log(`GetUserById Response for ID ${userId}:`);
    console.log(`User ${userId}:`, JSON.stringify(user, null, 2));
  });
}

main();
