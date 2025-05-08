const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketSetup = require('./sockets/socket');
const rateLimiter = require('./config/rateLimiter');
const logger = require('./config/logger');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user/user.routes');
const adminRoutes = require('./routes/admin/admin.routes');
const swaggerUi = require("swagger-ui-express");
const { userSpecs, adminSpecs,  } = require("./config/swagger");

require('dotenv').config();
connectDB();

app.use(express.json());
app.use(rateLimiter);

// // Routes



app.use('/api/user', userRoutes);
// app.use("/api/docs/user", swaggerUi.serve, swaggerUi.setup(userSpecs));

app.use('/api/admin', adminRoutes);
// app.use("/api/docs/admin", swaggerUi.serve, swaggerUi.setup(adminSpecs));



const userSwaggerRouter = express.Router();
userSwaggerRouter.use('/', swaggerUi.serve);
userSwaggerRouter.get('/', (req, res) => {
  return swaggerUi.setup(userSpecs)(req, res);
});
app.use('/api/docs/user', userSwaggerRouter);

const adminSwaggerRouter = express.Router();
adminSwaggerRouter.use('/', swaggerUi.serve);
adminSwaggerRouter.get('/', (req, res) => {
  return swaggerUi.setup(adminSpecs)(req, res);
});
app.use('/api/docs/admin', adminSwaggerRouter);

// // Swagger
// require('./config/swagger')(app);

// WebSocket
socketSetup(server);

module.exports = server;
