/* import multer */
const multer = require('multer')

console.log("pass mul 1");
/* forthe storage creation, DIsk storage */
const storage = multer.diskStorage({
    /* two keys, destination and filename */
    destination:(req, file, callback)=>{
        callback(null, './uploads/profile/profileImage')
    },
    filename:(req, file, callback)=>{
      const filename = `image-${Date.now()}-${file.originalname}`
      callback(null, filename)
    }
})

/* flltering the files based on its file type*/
const fileFilter = (req, file, callback)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        callback(null, true)
    }
    else{
        callback(null, false)
        return callback(new Error("Only jpg, jpeg, png files will be allowed"))
    }
}

/* create multerconfiguration*/
const multerConfig = multer({
    storage,
    fileFilter
})

// export multer
module.exports = multerConfig