require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')

const errorController = require('./controllers/error');
const User=require('./models/user');

const app = express();

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async(req, res, next) => {
  try{
    const user = await User.findById('669f7d872e711c87fcbbe1ba')
    req.user = user;
    next();
    } catch(err){
      console.log(err);
    }
    
});

app.use((req,res,next)=>{
  console.log(req.url)
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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