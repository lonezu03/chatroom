const express =require('express')
const app=express()

const fs = require('fs');
const path = require('path');

const http=require('http')
const server =http.createServer(app)
const {
    Server
} =require('socket.io')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const io=new Server (server)
const cors = require('cors');
app.use(cors()); // Sử dụng cors middleware
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
    //res.sendFile(__dirname+'/style.css');
})
function saveFile(fileData) {
    const fileBuffer = Buffer.from(fileData.data);
    const filePath = path.join(__dirname, 'uploads', fileData.name);
  
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log('File saved:', fileData.name);
      }
    });
  }
io.on('connection',(socket)=>{
    console.log('user connected' )
    socket.on('on-chat',data=>{
    io.emit('user-chat',data)
    })
      socket.on('file-upload', (fileData) => {
        saveFile(fileData);
        // Gửi lại file cho tất cả các client khác
        socket.broadcast.emit('file-available', fileData.name);
      });
})

server.listen(3000,()=>{
    console.log('listening on port 3000')
})