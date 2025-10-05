require('dotenv').config();
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

server.listen(PORT, HOST, () => {
    console.log(`JSON Server is running on ${HOST}:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`API endpoints available at:`);
    console.log(`  GET    http://${HOST}:${PORT}/trades`);
    console.log(`  POST   http://${HOST}:${PORT}/trades`);
    console.log(`  PUT    http://${HOST}:${PORT}/trades/:id`);
    console.log(`  DELETE http://${HOST}:${PORT}/trades/:id`);
});
