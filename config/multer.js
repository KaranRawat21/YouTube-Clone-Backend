import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

//Allowed file types
const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm/;

//file filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedFileTypes.test(ext) && allowedFileTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only images and videos are allowed."), false);
  };
}


const upload = multer({
  storage,
  fileFilter,
});
export default upload;