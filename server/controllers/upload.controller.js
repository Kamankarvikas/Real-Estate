import cloudinary from '../config/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No image file provided'));
    }

    // Convert buffer to base64 for cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'kamankar-estate',
      resource_type: 'image',
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(errorHandler(500, 'Image upload failed'));
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return next(errorHandler(400, 'No image public_id provided'));
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result,
    });
  } catch (error) {
    next(errorHandler(500, 'Image deletion failed'));
  }
};
