import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import authenticateToken from '../middleware/auth.js';
import ProfileController from '../controllers/profileController.js';

const router = Router();

// Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'ntuma_avatars', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});
const uploadAvatar = multer({ storage: avatarStorage });

// All profile routes require authentication
router.use(authenticateToken);

router.get('/',                   ProfileController.getProfile);
router.put('/',                   ProfileController.updateProfile);
router.put('/avatar', uploadAvatar.single('avatar'), ProfileController.updateAvatar);
router.put('/password',           ProfileController.changePassword);
router.get('/orders',             ProfileController.getOrderHistory);
router.delete('/',                ProfileController.deleteAccount);

export default router;
