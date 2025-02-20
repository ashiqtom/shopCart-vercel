require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const cors = require('cors'); 

const app = express();
app.use(cors())
app.use(bodyParser.json()); 

const User=require('./models/user');
app.use(async(req, res, next) => {
  try{
    const user = await User.findById('669f7d872e711c87fcbbe1ba')
    req.user = user;
    next();
    } catch(err){
      console.error(err);
      res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
    }    
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'index.html'));
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
app.use('/admin', adminRoutes);
app.use('/shop',shopRoutes);
app.use(errorController.get404);

(async () => {
  try {
    await mongoose.connect(process.env.URL);

    const user = await User.findOne();
    if (!user) {
      const newUser = new User({
        name: 'max',
        email: 'a@g.com',
        cart: {
          items: []
        }
      });
      await newUser.save();
    }

    app.listen(3000, () => {
      console.log(`Server is running on port: 3000`);
    });
  } catch (err) {
    console.error(err);
  }
})();