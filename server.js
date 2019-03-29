const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const serveIndex = require('serve-index');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const tour = require('./routes/api/tournament');
const app = express();


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db,{useNewUrlParser: true })  
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/tour',tour);
app.use('/files', serveIndex('public/', { icons: true }));
app.use('/files', express.static('public/'));

const port = process.env.PORT || 5000;

// Server static assets if in production
// This has to be under the app.use so that the /api routes are first and then the static route is second
// otherwise the static route will intercept the /api request and not send back the data.
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server running on port ${port}`));
