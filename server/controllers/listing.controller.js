import jwt from 'jsonwebtoken';
import Listing from '../models/listing.model.js';
import Favorite from '../models/favorite.model.js';
import { errorHandler } from '../utils/error.js';
import getTransporter from '../config/nodemailer.js';

// Helper: optionally get userId from token (does not block if no token)
const getOptionalUserId = (req) => {
  const token = req.cookies.access_token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch (e) {
    return null;
  }
};


export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing=async(req,res,next)=>{
  const listing=await Listing.findById(req.params.id);

  if(!listing)
  {
    return next(errorHandler(404,'Listing not found'));
  }
  if(req.user.id !==listing.userRef)
  {
    return next(errorHandler(401,'you can only delete your own listings!'));
  }

  try
  {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('listing has been deleted!');

  }catch(error)
  {
    next(error);
  }
};

export const updateListing=async(req,res,next)=>{
  const listing=await Listing.findById(req.params.id);
  if(!listing)
  {
    return next(errorHandler(404,'Listing not found!'));
  }
  if(req.user.id !== listing.userRef)
  {
    return next(errorHandler(401,"you can only update your own listings!"));
  }
  try{
    const updatedListing= await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {  new: true }
    );
    res.status(200).json(updatedListing);
  }
  catch(error)
  {
    next(error);
  }
};

export const getListing=async(req,res,next)=>{
  try{
    const listing=await Listing.findById(req.params.id).lean();
    if(!listing){
      return next(errorHandler(404,'Listing not found!'));
    }

    // Attach favorited flag if user is logged in
    const userId = getOptionalUserId(req);
    if (userId) {
      const fav = await Favorite.findOne({ userId, listingId: listing._id });
      listing.favorited = !!fav;
    } else {
      listing.favorited = false;
    }

    res.status(200).json(listing);
  }catch(error)
  {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .lean();

    // Attach favorited flag if user is logged in
    const userId = getOptionalUserId(req);
    if (userId && listings.length > 0) {
      const listingIds = listings.map((l) => l._id);
      const userFavorites = await Favorite.find({
        userId,
        listingId: { $in: listingIds },
      }).lean();
      const favSet = new Set(userFavorites.map((f) => f.listingId.toString()));
      listings.forEach((listing) => {
        listing.favorited = favSet.has(listing._id.toString());
      });
    } else {
      listings.forEach((listing) => {
        listing.favorited = false;
      });
    }

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const contactOwner = async (req, res, next) => {
  try {
    const { listingId, senderName, senderEmail, senderPhone, message } = req.body;

    if (!listingId || !senderName || !senderEmail || !message) {
      return next(errorHandler(400, 'Please fill in all required fields'));
    }

    if (!senderPhone || !/^\d{10}$/.test(senderPhone)) {
      return next(errorHandler(400, 'Please enter a valid 10-digit phone number'));
    }

    const listing = await Listing.findById(listingId).lean();
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (!listing.ownerEmail) {
      return next(errorHandler(400, 'Owner email is not available for this listing'));
    }

    const transporter = getTransporter();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width:600px; margin:0 auto; padding:20px;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d9488, #134e4a); border-radius:16px 16px 0 0; padding:30px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700;">
              Kamankar<span style="color:#5eead4;">Estate</span>
            </h1>
            <p style="color:#99f6e4; margin:8px 0 0; font-size:14px;">New Property Inquiry</p>
          </div>

          <!-- Body -->
          <div style="background:#ffffff; padding:30px; border-radius:0 0 16px 16px;">

            <!-- Greeting -->
            <p style="color:#1e293b; font-size:16px; margin:0 0 20px;">
              Hi <strong>${listing.ownerName || 'Property Owner'}</strong>,
            </p>
            <p style="color:#64748b; font-size:14px; margin:0 0 24px; line-height:1.6;">
              You have received a new inquiry about your property listing. Here are the details:
            </p>

            <!-- Property Card -->
            <div style="background:#f0fdfa; border:1px solid #ccfbf1; border-radius:12px; padding:20px; margin-bottom:24px;">
              <p style="color:#0d9488; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin:0 0 6px; font-weight:600;">Property</p>
              <p style="color:#1e293b; font-size:16px; font-weight:600; margin:0 0 4px;">${listing.name}</p>
              <p style="color:#64748b; font-size:13px; margin:0;">${listing.address}</p>
              <p style="color:#0d9488; font-size:18px; font-weight:700; margin:12px 0 0;">
                ₹${listing.offer ? listing.discountPrice?.toLocaleString('en-IN') : listing.regularPrice?.toLocaleString('en-IN')}
                ${listing.type === 'rent' ? ' / month' : ''}
              </p>
            </div>

            <!-- Sender Info -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-bottom:24px;">
              <p style="color:#475569; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin:0 0 12px; font-weight:600;">From</p>
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:4px 0; color:#94a3b8; font-size:13px; width:70px;">Name</td>
                  <td style="padding:4px 0; color:#1e293b; font-size:14px; font-weight:500;">${senderName}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; color:#94a3b8; font-size:13px;">Email</td>
                  <td style="padding:4px 0; color:#1e293b; font-size:14px; font-weight:500;">
                    <a href="mailto:${senderEmail}" style="color:#0d9488; text-decoration:none;">${senderEmail}</a>
                  </td>
                </tr>
                ${senderPhone ? `
                <tr>
                  <td style="padding:4px 0; color:#94a3b8; font-size:13px;">Phone</td>
                  <td style="padding:4px 0; color:#1e293b; font-size:14px; font-weight:500;">
                    <a href="tel:${senderPhone}" style="color:#0d9488; text-decoration:none;">${senderPhone}</a>
                  </td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Message -->
            <div style="margin-bottom:24px;">
              <p style="color:#475569; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px; font-weight:600;">Message</p>
              <div style="background:#f8fafc; border-left:3px solid #0d9488; padding:16px; border-radius:0 8px 8px 0;">
                <p style="color:#334155; font-size:14px; margin:0; line-height:1.7; white-space:pre-wrap;">${message}</p>
              </div>
            </div>

            <!-- Reply Button -->
            <div style="text-align:center; margin-bottom:20px;">
              <a href="mailto:${senderEmail}?subject=Re: ${listing.name}"
                 style="display:inline-block; background:#0d9488; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:10px; font-size:14px; font-weight:600;">
                Reply to ${senderName}
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top:1px solid #e2e8f0; padding-top:20px; text-align:center;">
              <p style="color:#94a3b8; font-size:12px; margin:0; line-height:1.6;">
                This email was sent via <strong>Kamankar Estate</strong>.<br>
                Please do not share the sender's contact details with third parties.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Kamankar Estate" <${process.env.EMAIL_USER}>`,
      to: listing.ownerEmail,
      subject: `New Inquiry: ${listing.name} — from ${senderName}`,
      html: emailHtml,
      replyTo: senderEmail,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
}
