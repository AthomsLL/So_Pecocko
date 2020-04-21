const multer = require('multer');
const uniqid = require('uniqid');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, uniqid() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');

