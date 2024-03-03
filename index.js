var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var PROTO_PATH = __dirname + '/todo.proto';
var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase : true,
    longs : String,
    enums : String,
    defaults : true,
    oneofs : true
});
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todoService = protoDescriptor.TodoService;
const Routeserver = new grpc.Server();

var Todos = [
    {
        id: 1,
        title: 'Todo 1',
        content : 'Todo 1',
    },
    {
        id: 2,
        title: 'Todo 2',
        content : 'Todo 2',
    }
];
Routeserver.addService(todoService.service,{
    listTodos : (call,callback) => {
        callback(null,Todos);
    },
    createTodo : (call,callback) => {
        let incomingRequest = call.request;
        Todos.push(incomingRequest);
        callback(null,incomingRequest);
    },
    getTodo : (call,callback) => {
        let id = call.request.id;
        let todo = Todos.find(todo => todo.id === id);
        callback(null,todo);
    }
});

Routeserver.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server is running');
    //Routeserver.start();
  });