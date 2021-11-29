const express = require('express');
const mongoose = require('mongoose');
const Sport = require('./models/Sport');
const Icon = require('./models/Icon');
const Exercise = require('./models/Exercise');
const User = require('./models/User');

// MongoDB connection
const mongoConnectionString = "mongodb+srv://dbUser:..."; // MongoDB connection string goes here
mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', _ => {
  console.log('Database connection established');
});
db.on('error', err => {
  console.error('connection error:', err)
});

// Middlewares
const app = express();
app.use(express.json());


////////////////
// GET REQUESTS
////////////////

// Get all sports from database
app.get('/sports', (req, res) => {
    const sports = Sport.find({});
    sports.exec((err, list) => {
      if (err) return handleError(err);
      res.end(JSON.stringify(list));
    });
});

// Get all icons from database
app.get('/icons', (req, res) => {
  const icons = Icon.find({});
  icons.exec((err, list) => {
    if (err) return handleError(err);
    res.end(JSON.stringify(list));
  });
});

// Get exercise from database
app.get('/exercise', (req, res) => {
  const uid = req.query.uid;
  Exercise.find({ 'userId': uid }, (err, exercises) => {
    if (err) return handleError(err);
    res.end(JSON.stringify(exercises));
  })
});

// Get user from database
app.get('/user', (req, res) => {
  const uid = req.query.uid;
  User.find({ 'uid': uid }, (err, user) => {
    if (err) return handleError(err);
    res.end(JSON.stringify(user));
  })
});

/////////////////
// POST REQUESTS
/////////////////

// Add new exercise to database
app.post('/exercise', (req, res) => {
  const exercise = new Exercise({
        userId: req.body.userId,
        sport: req.body.sport,
        icon: req.body.icon,
        durationH: req.body.durationH,
        durationMin: req.body.durationMin,
        distance: req.body.distance,
        date: req.body.date,
        imageUrl: req.body.imageUrl
    });
    exercise.save((error, document) => {
        if (error) console.error(error);
        console.log("Exercise saved to database!");
    });
    res.json({'success': 'true'});
});

// Add new sport to database
app.post('/sport', (req, res) => {
  const sport = new Sport({
    name: req.body.name
  });
  sport.save((error, document) => {
    if (error) console.error(error);
    console.log("New sport saved to database!");
  });
  res.json({'Added': sport.name});
});

// Add new icon to database
app.post('/icon', (req, res) => {
  const icon = new Icon({
    name: req.body.name
  });
  icon.save((error, document) => {
    if (error) console.error(error);
    console.log("New icon saved to database!");
  });
  res.json({'Added': icon.name});
});

// Add new user to database
app.post('/user', (req, res) => {
  const user = new User({
    uid: req.body.uid,
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    age: req.body.age,
    email: req.body.email
  });
  user.save((error, document) => {
    if (error) console.error(error);
    console.log("User added to database!");
  });
  res.json({'success': 'true'});
});

////////////////
// PUT REQUESTS
////////////////

// Update user data in database
app.put('/user', (req, res) => {
  User.find({ 'uid': req.body.uid }, (err, users) => {
    if (err) return handleError(err);
    const user = users[0];
    user.name = req.body.name;
    user.height = req.body.height;
    user.weight = req.body.weight;
    user.age = req.body.age;
    user.save((error, document) => {
      if (error) console.error(error);
      console.log("User data changed in database!");
    });
  })
  res.end();
});

// Update exercise data in database
app.put('/exercise', (req, res) => {
  Exercise.find({ '_id': req.body.id }, (err, exercise) => {
    if (err) return handleError(err);
    exercise[0].sport = req.body.sport;
    exercise[0].icon = req.body.icon;
    exercise[0].durationH = req.body.durationH;
    exercise[0].durationMin = req.body.durationMin;
    exercise[0].distance = req.body.distance;
    exercise[0].date = req.body.date;
    exercise[0].imageUrl = req.body.imageUrl;
    exercise[0].save((error, document) => {
      if (error) console.error(error);
      console.log("Exercise data changed in database!");
    });
  })
  res.end();
});


///////////////////
// DELETE REQUESTS
///////////////////

// Delete exercise from database
app.delete('/exercise', (req, res) => {
  Exercise.deleteOne({ _id: req.query.id }).then(() => {
    console.log("Exercise deleted");
  }).catch(error => {
    console.log(error);
  })
  res.end();
});


var port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));