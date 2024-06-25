var express = require('express');
var router = express.Router();
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const userModel=require('./users');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const { token } = require('morgan');
const upload=require('./multerConfig');
const roomData=require('./rmdata');
const rooms=require('./rooms');
const bupload=require('./bmulterConfig');
const buserModel=require('./bikes');
const pgroom=require('./pgRoom');
const pg=require("./pgroommulterConfig")
const cuserModel=require('./cars');
const cars=require('./cmulterconfig');
//const bikes = require('./bikes');





router.use(express.urlencoded({extended:true}));





router.use(cookieParser());

const upimg=express();

router.get('/', function(req, res, next) {
  res.render("landingPage");
  
});

router.get("/register",(req,res)=>{
  res.render('register');
});

router.post("/register", async (req, res) => {
  let { username, email, password, name, pincode } = req.body;
      if(username==="" || email==="" || password==="" || name==="" || pincode==="")
        {
          return res.send("Everything is required");
        }
  try {
    let swer = await userModel.findOne({ email });
    if (swer) {
      return res.status(500).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

   let user= await userModel.create({
      username,
      email,
      password: hash,
      name,
      pincode
    });

    let token = jwt.sign({email},"shubhamVedika");
    
    res.cookie("token", token).render("profile",{user});
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).send("Error registering user");
  }
});

router.get('/login',(req,res)=>{
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
      let { username , password } = req.body;
      
      let user = await userModel.findOne({ username });
      if (!user) {
            return res.status(500).render("register");
      }

      let result = await bcrypt.compare(password, user.password);
      if (!result) {
          return res.send("Invalid password");
      }
      let email=user.email;
      let token = jwt.sign({email},"shubhamVedika");
      res.cookie('token',token).render('profile',{user});
  } catch (error) {
      console.error("Error in login:", error);
      res.status(500).send("Internal Server Error");
  }
});



let isLoggedIn=async (req,res,next)=>{

  if(!req.cookies.token)
    {
      return res.render('login');
    }
      let decode=jwt.verify(req.cookies.token,"shubhamVedika")
  //console.log(decode.email);
  let user=await userModel.findOne({email:decode.email});
      
      if(user)
     {
      
    req.user=user;
    return next();
     }
  else{
    res.render("login");
  }
}

router.get('/profile',isLoggedIn,async(req,res)=>{
  let user=req.user;
  res.render('profile',{user});
});


router.get('/logout',(req,res)=>{
  
  res.clearCookie('token').render('login');
  
})


router.get('/homepage',isLoggedIn,(req,res)=>{
  res.render('homepage');
});

router.get('/rooms',isLoggedIn,(req,res)=>{
  res.render('rooms');
});


router.get('/addRoom',isLoggedIn,(req,res)=>{
  res.render('addRoom');
});



router.get('/updateProfile',(req,res)=>{
  res.render('updateProfile');
});


router.post('/upload', isLoggedIn,upload.single('image'),async function (req, res, next) {
      let file=req.file;
      if(!file)
        {
          return res.send("Nothing happened");
        }

       let user=await userModel.findOne({email:req.user.email});
       user.profilePic=req.file.filename;
       user.save();
       res.redirect('/profile');
 });

 router.post('/details', isLoggedIn, rooms.array('images', 12), async (req, res) => {
  try {
      let files = req.files; 
      //console.log(files);
      if (!files || files.length === 0) {
          return res.send("No files uploaded");
      }
      

      let copy = files.map(file => file.filename); 
      let { location, flat, nfp, rent,address,contact } = req.body; 
      let {name}=req.user;
      let newLocation=location.toLowerCase();
      let existingRoom = await roomData.findOne({location:newLocation});
      
      let roomdata = await roomData.create({
          location:newLocation,
          flat,
          nfp,
          rent,
          images:copy,
          address,
          name,
          contact
      });
      console.log(roomdata);
      res.render("homepage");
  } catch (error) {
      console.error("Error adding room:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.post('/room',async (req,res)=>{
  let {location}=req.body;
  let newLocation=location.toLowerCase();
  let userFind=await roomData.find({location:newLocation});
  
  res.render('rooms',{userFind});
});

router.post('/bike',async(req,res)=>{
  let {blocation}=req.body;
  let newLocation=blocation.toLowerCase();
  let bikes=await buserModel.find({blocation:newLocation});
  
  if(!bikes)
    {
      return res.send("no vehicle found on rent");
    }
    res.render('Rbikes',{bikes});
});

router.get('/addBikes',(req,res)=>{
  res.render('addBikes');
})

router.post('/bdetails',isLoggedIn,bupload.single('bimage'),(req,res)=>{
        let file=req.file;
        let {blocation,bbrand,brent,contact}=req.body;
        let {name}=req.user;
        if(!file)
          {
            return res.send('error');
          }
          console.log(file);
         let newLocation=blocation.toLowerCase();
         
          let buser=buserModel.create({
            blocation:newLocation,
            bbrand,
            brent,
            bimage:file.filename,
            name,
            contact
          });
          res.render('homepage');
})

router.post('/pgroom',isLoggedIn,pg.array('images',6),async (req,res)=>{
    let{location,room,nfp,rent,address,contact}=req.body;
    let {name}=req.user
    let newLocation=location.toLowerCase();
    let files=req.files;
    if(!files)
      {
        return res.send('No images');
      }
        if(!location)
        {
          return res.send("No Rooms");
        }
        let copy = files.map(file => file.filename); 
        let user=await pgroom.create({
          location:newLocation,
          room,
          nfp,
          rent,
          address,
          images:copy,
          name,
          contact
        })
        
   // console.log(user);
    res.render('landingPage');
});
router.get('/pgroom',(req,res)=>{
  res.render('pgRoomsadd');
});

router.post('/pgrooms',isLoggedIn,async (req,res)=>{
  let {plocation}=req.body;
  console.log(plocation);
  let newLocation=plocation.toLowerCase();
    let userss=await pgroom.find({plocation:newLocation});
    console.log(userss[0]);
    if(!userss[0])
      {
        return res.send("No rooms Avail");
      }
    res.render('pgRoomsshow',{userss});
})

router.post('/cdetails',isLoggedIn,cars.array('cimage',10),async (req,res)=>
{
    let {clocation,cbrand,crent,contact}=req.body;
    let newLocation=clocation.toLowerCase();
    let carsImage=req.files;
    let {name}=req.user;
    if(!carsImage)
      {
        return res.send('No cars Image');
      }
      
      try{
        let carsImg = carsImage.map(file => file.filename); 
        let carsDetails=await cuserModel.create(
          {
            clocation:newLocation,
            cbrand,
            crent,
            cimage:carsImg,
            name,
            contact
          }
        )
       await carsDetails.save();
       res.render('homepage')
      }
      catch(err)
      {
        return res.send("UnExpected Error");
      }
});

router.get('/cars',isLoggedIn,(req,res)=>
{
  
  //console.log(req.user.username);
  let {name,email}=req.user;
 // console.log(name);
    res.render('cars',{name,email});
});

router.post('/showCars',isLoggedIn,async (req,res)=>
{
  let {user}=req;
  try{
    let {clocation}=req.body;
    let newLocation=clocation.toLowerCase();
    if(!clocation)
      {
        return res.send("Unexpected error");
      }
      let carsfind=await cuserModel.find({clocation:newLocation});
      if(!carsfind[0])
        {
          return res.status(500).send("No Cars Found at this Location: Kahi aur DekLe bsdk");
        }
        res.render('showCars',{carsfind,user});
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).send("Nothing to Show");
  }
})


router.get('/show', isLoggedIn, async (req, res) => {
  try {
      let { name } = req.user;

      if (!name) {
          return res.send("No user with this name is Found");
      }

      let allUserRoom = await roomData.find({ name });
      let allUserPg = await pgroom.find({ name });
      let allUserBikes = await buserModel.find({ name });
      let allUserCars = await cuserModel.find({ name });

       if (allUserPg.length === 0 && allUserBikes.length === 0 && allUserCars.length === 0 && allUserRoom.length === 0) {
           return res.send("NO Data Found");
       }

      res.render('show.ejs', {
          allUserBikes,
          allUserCars,
          allUserPg,
          allUserRoom
      });
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});


router.post('/deleteBike/:id', isLoggedIn, async (req, res) => {
  try {
      await buserModel.findByIdAndDelete(req.params.id);
      res.redirect('/show');
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});

router.post('/deleteCar/:id', isLoggedIn, async (req, res) => {
  try {
      await cuserModel.findByIdAndDelete(req.params.id);
      res.redirect('/show');
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});

router.post('/deletePg/:id', isLoggedIn, async (req, res) => {
  try {
      await pgroom.findByIdAndDelete(req.params.id);
      res.redirect('/show');
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});

router.post('/deleteRoom/:id', isLoggedIn, async (req, res) => {
  try {
      await roomData.findByIdAndDelete(req.params.id);
      res.redirect('/show');
  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});



module.exports = router;



