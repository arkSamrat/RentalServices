
const multer=require('multer');
const path=require('path');
const crypto=require('crypto');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, 'E:/newProject/public/images/Rooms')
  },
  filename: function (req, file, cb) {
      crypto.randomBytes(12,(err,name)=>{
          const fn=name.toString('hex')+path.extname(file.originalname);
          cb(null,fn);
      });
        }
});
const uploadRooms = multer({ storage: storage });

module.exports=uploadRooms;