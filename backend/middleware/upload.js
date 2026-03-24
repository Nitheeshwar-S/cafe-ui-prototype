const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = ['uploads/menu', 'uploads/combos', 'uploads/promos'];
    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
};

// Create directories on module load
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder based on request path
        let folder = 'menu';
        if (req.baseUrl.includes('combo')) {
            folder = 'combos';
        } else if (req.baseUrl.includes('promo')) {
            folder = 'promos';
        }

        const uploadPath = path.join(__dirname, '..', 'uploads', folder);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: category-timestamp-random.webp
        const folder = req.baseUrl.includes('combo') ? 'combo' :
                       req.baseUrl.includes('promo') ? 'promo' : 'menu';
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const filename = `${folder}-${timestamp}-${randomString}.webp`;
        cb(null, filename);
    }
});

// File filter - Accept only WEBP
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only WEBP format is allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

module.exports = upload;
