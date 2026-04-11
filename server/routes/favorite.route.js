import express from 'express';
import { verifyToken } from '../utils/verifyuser.js';
import {
  toggleFavorite,
  getUserFavorites,
  getLikedByUsers,
} from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/toggle/:listingId', verifyToken, toggleFavorite);
router.get('/my-favorites', verifyToken, getUserFavorites);
router.get('/liked-by/:listingId', verifyToken, getLikedByUsers);

export default router;
