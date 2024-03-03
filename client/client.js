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


const client = new todoService('localhost:50051',grpc.credentials.createInsecure());

client.listTodos({},(err,todos)=>{
    if(err){
        console.log(err);
    }else{
        console.log(todos);
        let newTodo = {id : 3, title : '3rd todo', content : '3rd todo'};
        client.createTodo(newTodo, (err,todo)=>{
            if(!err){
                console.log('new Todo created successfully');
                client.listTodos({},(err,todos)=>{
                    console.log(todos);
                })
            }else{
                console.log(err);
            }
        });
    }
});