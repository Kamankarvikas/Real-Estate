import mongoose from 'mongoose';
import Favorite from '../models/favorite.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Toggle favorite (add if not exists, remove if exists)
export const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(errorHandler(400, 'Invalid listing ID'));
    }

    // Verify the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    const existing = await Favorite.findOne({ userId, listingId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.status(200).json({ favorited: false, message: 'Removed from favorites' });
    }

    await Favorite.create({ userId, listingId });
    res.status(201).json({ favorited: true, message: 'Added to favorites' });
  } catch (error) {
    next(error);
  }
};

// Get all favorites of the logged-in user (with listing details, search, filter, pagination)
export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || '';
    const type = req.query.type || '';

    // Get all favorites for this user
    const favorites = await Favorite.find({ userId })
      .sort({ createdAt: -1 })
      .populate('listingId');

    // Filter out deleted listings
    let validListings = favorites
      .filter((fav) => fav.listingId !== null)
      .map((fav) => fav.listingId);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      validListings = validListings.filter(
        (listing) =>
          listing.name.toLowerCase().includes(searchLower) ||
          listing.address.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (type && type !== 'all') {
      validListings = validListings.filter((listing) => listing.type === type);
    }

    const total = validListings.length;
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;
    const paginatedListings = validListings.slice(skip, skip + pageSize);

    res.status(200).json({
      listings: paginatedListings,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    next(error);
  }
};

// Get users who liked a specific listing (for listing owner)
export const getLikedByUsers = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(errorHandler(400, 'Invalid listing ID'));
    }

    // Verify the listing belongs to the requesting user
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    if (listing.userRef !== userId) {
      return next(errorHandler(403, 'You can only view likes on your own listings'));
    }

    const favorites = await Favorite.find({ listingId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email avatar');

    const users = favorites
      .filter((fav) => fav.userId !== null)
      .map((fav) => ({
        _id: fav.userId._id,
        username: fav.userId.username,
        email: fav.userId.email,
        avatar: fav.userId.avatar,
        likedAt: fav.createdAt,
      }));

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
