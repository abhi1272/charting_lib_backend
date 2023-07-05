const app = require('express')()
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', // allow requests from any domain
  }
})

app.get('/', (req,res) => {
  res.send('hello charting app!')
})

const clients = new Set();

const generateTradingData = async () => {
      return {
        time: Date.now(),
        close: Math.random() * 1 + 1,
        high: Math.random() * 1.2,
        low: Math.random() * 5,
        open: Math.random() * 1.3 + 0.5,
        volume: Math.random() * 0.8 + 10,
        conversionType: "force_direct",
        conversionSymbol: "noData",
      };  
}

// Broadcast tracking data to all connected clients
const broadcastTrackingData = async (socket, roomName) => {
    const trackingData = await generateTradingData(socket);
    console.log('in broadcast');
    const message = JSON.stringify(trackingData);
    socket.broadcast.emit('m', { data: message });
};

io.on('connection', (socket) => {
  console.log(`User connected to  ${socket.id}`)
  clients.add(socket);

  setInterval(async () => {
    await broadcastTrackingData(socket)
  }, 3000)

  socket.on('disconnect', () => {
      clients.delete(socket);
  });

})

server.listen(8000, () => {
  console.log('server is running')
})

