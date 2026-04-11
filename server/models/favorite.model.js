import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only favorite a listing once
favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });
// Fast lookup by userId (for "my favorites" page)
favoriteSchema.index({ userId: 1, createdAt: -1 });
// Fast lookup by listingId (for like counts)
favoriteSchema.index({ listingId: 1 });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
