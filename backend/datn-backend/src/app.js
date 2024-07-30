import * as dotenv from 'dotenv';
import { errHandler, notFound } from './middlewares/errhandle.js';
import Coins from './models/coin.js';
import PassportRoutes from './routes/passport.routes.js';
import { Server as SocketIo } from 'socket.io';
import User from './models/user.model.js';
import compression from 'compression';
import { connectDb } from './configs/index.js';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport.middlewares.js';
import path from 'path';
import rootRoutes from './routes/index.js';
import session from 'express-session';
import socket from './configs/socket.js';
import Orders from './models/order.model.js';
import Users from './models/user.model.js';
import fs from 'fs';
// import Order from './models/order.model.js';
import mongoose from 'mongoose';

//lấy  jwt

dotenv.config();

/* config */

//Setup dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//file name html
//

const app = express();

app.get('/', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');

  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
    try {
      const decoded = jwt.verify(refreshTokenCookie, process.env.SECRET_REFRESH);
    } catch (err) {
      console.error('Invalid token:', err.message);
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token: ' + refreshTokenCookie);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token not found');
  }
});

app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  })
);
// app.use(helmet());
// app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  (async () => {
    const user = await User.findById(id).populate([
      { path: 'address', select: '-__v -_id -userId' },
    ]);
    return done(null, user);
  })();
});

/* OAuth2 */
passport.use(passportMiddleware.GoogleAuth);

/* routes */
app.use('/api', rootRoutes);
app.use('/auth', PassportRoutes);
//
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/voucher.html');
});

app.get('/api/new_voucher', async (req, res) => {
  const { coin, name } = req.query;
  const check = await Coins.findOne({ name });
  if (check) return res.json({ msg: 'Mã đã tồn tại' });
  else {
    await Coins({
      name: name,
      money: coin,
    }).save();
  }
});
app.get('/api/find_voucher', async (req, res) => {
  const { name } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    return res.json({ msg: `số dư: ${check.money}` });
  }
});
app.get('/api/edit_voucher', async (req, res) => {
  const { name, coin } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    const lt = check.money * 1 + coin * 1;
    await Coins.updateOne({ _id: check._id }, { $set: { money: lt } });
    return res.json({ msg: `Update thành công số dư: ${lt}` });
  }
});
app.get('/api/cancelOrder/', async (req, res) => {
  const { phoneCheck } = req.query;

  const data = await Orders.find({ status: 'canceled' });
  var newJson = {};
  for (const value of data) {
    var phone = value.inforOrderShipping.phone;
    if (newJson[phone] == undefined) {
      newJson = { ...newJson, ...{ [phone]: { count: 1 } } };
      if (value.user != undefined && value.user)
        newJson[phone] = { ...newJson[phone], ...{ user: value.user } };
    } else {
      newJson[phone].count = newJson[phone].count + 1;
      if (newJson[phone].user != undefined && newJson[phone].count > 5) {
        const update = await Users.updateOne(
          { _id: newJson[phone].user },
          { $set: { status: 'inactive' } }
        );
      }
    }
  }
  if (phoneCheck) {
    const chc = 5;
    if (newJson[phoneCheck].count <= chc) {
      return res.json({ phoneCheck, count: newJson[phoneCheck], status: true });
    } else return res.json({ status: false, msg: 'sdt khong hop le', count: newJson[phoneCheck] });
  } else res.json(newJson);
});
const { Schema } = mongoose;
// Định nghĩa schema cho các collection
const conversationSchema = new Schema({
  type: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message2', messageSchema);
app.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({}).populate('members');
    const newData = [];
    for (const result of conversations) {
      const nextResult = await User.find({ _id: { $in: result.members } });
        for (const item of nextResult) {
          if(item.role == "customer"){
            const dataNewChat = await Message.findOne({conversationId : result._id , senderId :item._id }).sort({ createdAt: -1 })
            const lengthChat = await Message.find({conversationId : result._id , senderId :item._id })
            newData.push({
              account: item.account,
              _id: item._id,
              username: item.username,
              avatar: item.avatar,
              messagePreview : dataNewChat?.content,
              length : lengthChat?.length,
              conversationId : result._id
            });
          }
        }
    }
    return res.json(newData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});
app.get('/conversations-details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const messages = await Message.find({ conversationId: id }).populate('senderId receiverId');
    console.log(messages,'messages')
    return res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/messages-cra', async (req, res) => {
  try {
    console.log(req.body);
    const { senderId, receiverId, content, image } = req.body;
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({ type: 'public', members: [senderId, receiverId] });
    }
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      image,
    });
    return res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/get-user-chat-message', async (req, res) => {
  try {
    const { senderId} = req.query;
    const conversation = await Conversation.findOne({
      members: { $all: [senderId] },
    });
    if (!conversation) {
      return res.status(200).json({ message: 'no message' });
    } else {
      return res.status(200).json(conversation);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/join-room/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supporterId } = req.body;
    let conversation = await Conversation.findById(id);
    console.log(conversation, 'conversation');
    if (!conversation) {
      return res.status(404).json({ message: 'not found', status: false });
    }
    const checkExits = conversation.members.includes(supporterId);

    if (!checkExits) {
      conversation.members.push(supporterId);
      await conversation.save();
      return res.status(200).json({ message: 'updates', status: true });
    } else {
      return res.status(200).json({ message: 'exits', status: true });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get('/finish-supporter/:id', async (req, res) => {
  try {
      const {id} = req.params
      const data = await Conversation.findByIdAndDelete(id)
      return res.status(200).json({
        status : "removed"
      })
  } catch (error) {
    return  res.status(500).json({ message: error.message });
  }
})

app.use(notFound);
app.use(errHandler);

/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;

//Chat
let server;

// if (process.env.NODE_ENV === 'production') {
// Sử dụng HTTPS trong production
// const options = {
// key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
// cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// };
// server = https.createServer(options, app);
// } else {
// Sử dụng HTTP trong development
server = http.createServer(app);
// }
// const server = http.createServer(app);
const io = new SocketIo(server);
server.listen(port, async () => {
  try {
    socket(io);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
