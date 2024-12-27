const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { secret } = require('./config');
const { restoreUser } = require('./auth');
const cors = require('cors');
const routes = require('./routes');
const { environment } = require('./config');
const isProduction = environment === 'production';
const csurf = require('csurf');


const app = express();

// Middleware for logging, JSON parsing, cookies, etc.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secret));
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware setup
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'XSRF-TOKEN', 'Authorization', 'Cookie'],
  credentials: true
}));

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

// Session setup with Sequelize store
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret,
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// Sync session store
store.sync();
app.use(restoreUser);

// Use API routes
app.use(routes);

// Catch 404 errors
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  console.log(err);

  res.status(err.status || 500);

  // Send JSON response with error details in development
  if (req.app.get('env') === 'development') {
    return res.json({
      message: err.message,
      error: err
    });
  }

  // Send generic message for production
  return res.json({ message: 'Something went wrong!' });
});

module.exports = app;
