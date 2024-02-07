const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.engine('.handlebars', exphbs({ extname: '.handlebars' }));
app.set('view engine', '.handlebars');

app.use(express.static('public'));

let products = [];

// Rutas
app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

// Configurar WebSocket
io.on('connection', (socket) => {
    socket.emit('productos', products);

    socket.on('nuevoProducto', (productName) => {
        const newProduct = { id: products.length + 1, name: productName };
        products.push(newProduct);

        io.emit('productos', products);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
