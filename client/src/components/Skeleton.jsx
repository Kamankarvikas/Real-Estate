
/**
 * Reusable Skeleton Loader Components
 *
 * Usage:
 *   <CardSkeleton />           - Single listing card skeleton
 *   <CardGridSkeleton count={6} cols={3} />  - Grid of card skeletons
 *   <TableSkeleton rows={5} cols={4} />      - Table skeleton
 *   <ListSkeleton count={4} />               - List item skeletons
 */

// Base shimmer block
function SkeletonBlock({ className = '' }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

// ─── Card Skeleton (matches ListingItem layout) ─────────────────────────────
export function CardSkeleton() {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Image placeholder */}
      <div className='relative'>
        <SkeletonBlock className='h-48 w-full rounded-none' />
        {/* Badge placeholder */}
        <div className='absolute top-3 left-3'>
          <SkeletonBlock className='h-6 w-16 rounded-full' />
        </div>
        {/* Heart button placeholder */}
        <div className='absolute top-3 right-3'>
          <SkeletonBlock className='h-9 w-9 rounded-full' />
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col gap-3'>
        {/* Price */}
        <SkeletonBlock className='h-5 w-28' />
        {/* Name */}
        <SkeletonBlock className='h-4 w-full' />
        {/* Address */}
        <div className='flex items-center gap-2'>
          <SkeletonBlock className='h-3 w-3 rounded-full shrink-0' />
          <SkeletonBlock className='h-3 w-3/4' />
        </div>
        {/* Description lines */}
        <div className='flex flex-col gap-1.5'>
          <SkeletonBlock className='h-3 w-full' />
          <SkeletonBlock className='h-3 w-4/5' />
        </div>
        {/* Divider */}
        <div className='border-t border-gray-100' />
        {/* Beds & Baths */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1.5'>
            <SkeletonBlock className='h-3.5 w-3.5 rounded-full' />
            <SkeletonBlock className='h-3 w-12' />
          </div>
          <div className='flex items-center gap-1.5'>
            <SkeletonBlock className='h-3.5 w-3.5 rounded-full' />
            <SkeletonBlock className='h-3 w-12' />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card Grid Skeleton ─────────────────────────────────────────────────────
export function CardGridSkeleton({ count = 6, cols = 3 }) {
  const gridClass =
    cols === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${gridClass} gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Table Skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className='w-full bg-white rounded-xl border border-gray-100 overflow-hidden'>
      {/* Table header */}
      <div className='flex items-center gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100'>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={`h-3.5 ${i === 0 ? 'w-1/4' : 'w-1/6'}`}
          />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className='flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0'
        >
          {Array.from({ length: cols }).map((_, colIdx) => {
            if (colIdx === 0) {
              // First column: image + text (like listing name)
              return (
                <div key={colIdx} className='flex items-center gap-3 w-1/4'>
                  <SkeletonBlock className='h-10 w-10 rounded-lg shrink-0' />
                  <SkeletonBlock className='h-3.5 w-full' />
                </div>
              );
            }
            if (colIdx === cols - 1) {
              // Last column: action buttons
              return (
                <div key={colIdx} className='flex items-center gap-2 w-1/6'>
                  <SkeletonBlock className='h-7 w-7 rounded-lg' />
                  <SkeletonBlock className='h-7 w-7 rounded-lg' />
                </div>
              );
            }
            return (
              <SkeletonBlock
                key={colIdx}
                className={`h-3.5 w-1/6`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── List Skeleton ──────────────────────────────────────────────────────────
export function ListSkeleton({ count = 4 }) {
  return (
    <div className='flex flex-col gap-3'>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100'
        >
          {/* Thumbnail */}
          <SkeletonBlock className='h-16 w-20 rounded-lg shrink-0' />
          {/* Content */}
          <div className='flex-1 flex flex-col gap-2'>
            <SkeletonBlock className='h-4 w-3/5' />
            <SkeletonBlock className='h-3 w-2/5' />
            <SkeletonBlock className='h-3 w-4/5' />
          </div>
          {/* Action */}
          <SkeletonBlock className='h-8 w-20 rounded-lg shrink-0' />
        </div>
      ))}
    </div>
  );
}

// ─── MyListings Card Skeleton (card + action buttons) ───────────────────────
export function MyListingCardSkeleton() {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Image */}
      <SkeletonBlock className='h-48 w-full rounded-none' />
      {/* Content */}
      <div className='p-4 flex flex-col gap-3'>
        <SkeletonBlock className='h-5 w-28' />
        <SkeletonBlock className='h-4 w-full' />
        <div className='flex items-center gap-2'>
          <SkeletonBlock className='h-3 w-3 rounded-full shrink-0' />
          <SkeletonBlock className='h-3 w-3/4' />
        </div>
        <div className='flex flex-col gap-1.5'>
          <SkeletonBlock className='h-3 w-full' />
          <SkeletonBlock className='h-3 w-4/5' />
        </div>
        <div className='border-t border-gray-100' />
        {/* Beds, Baths & Like */}
        <div className='flex items-center gap-4'>
          <SkeletonBlock className='h-3.5 w-14' />
          <SkeletonBlock className='h-3.5 w-14' />
          <SkeletonBlock className='h-6 w-12 rounded-full ml-auto' />
        </div>
        <div className='border-t border-gray-100' />
        {/* Action buttons */}
        <div className='grid grid-cols-3 gap-2'>
          <SkeletonBlock className='h-9 rounded-lg' />
          <SkeletonBlock className='h-9 rounded-lg' />
          <SkeletonBlock className='h-9 rounded-lg' />
        </div>
      </div>
    </div>
  );
}

export function MyListingGridSkeleton({ count = 6 }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {Array.from({ length: count }).map((_, i) => (
        <MyListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Carousel Skeleton (Home page featured carousel) ──────────────────────
export function CarouselSkeleton() {
  return (
    <div className='rounded-2xl overflow-hidden shadow-lg relative'>
      {/* Image placeholder */}
      <SkeletonBlock className='h-[250px] sm:h-[350px] lg:h-[420px] w-full rounded-none' />

      {/* Type badge placeholder (top-left) */}
      <div className='absolute top-4 left-4 z-10'>
        <SkeletonBlock className='h-7 w-20 rounded-full bg-gray-300' />
      </div>

      {/* Offer badge placeholder (top-right) */}
      <div className='absolute top-4 right-4 z-10'>
        <SkeletonBlock className='h-7 w-24 rounded-full bg-gray-300' />
      </div>

      {/* Bottom content overlay */}
      <div className='absolute inset-0 flex items-end pointer-events-none'>
        <div className='w-full bg-gradient-to-t from-black/50 via-black/20 to-transparent px-6 pb-5 pt-24'>
          {/* Title */}
          <SkeletonBlock className='h-5 sm:h-6 w-2/3 bg-gray-300 mb-3' />
          {/* Price */}
          <SkeletonBlock className='h-5 w-32 bg-gray-300 mb-2' />
          {/* Meta info */}
          <div className='flex items-center gap-3'>
            <SkeletonBlock className='h-3 w-14 bg-gray-300' />
            <SkeletonBlock className='h-3 w-14 bg-gray-300' />
            <SkeletonBlock className='h-3 w-16 bg-gray-300' />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User List Skeleton (for "Interested Users" modal) ─────────────────────
export function UserListSkeleton({ count = 4 }) {
  return (
    <div className='divide-y divide-gray-100'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='px-5 py-4 flex items-center gap-3'>
          {/* Avatar */}
          <SkeletonBlock className='h-10 w-10 rounded-full shrink-0' />
          {/* User info */}
          <div className='flex-1 flex flex-col gap-1.5'>
            <SkeletonBlock className='h-3.5 w-1/2' />
            <SkeletonBlock className='h-3 w-3/4' />
            <SkeletonBlock className='h-2.5 w-1/3' />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Listing Detail Skeleton (matches Listing.jsx layout) ───────────────────
export function ListingDetailSkeleton() {
  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Image Carousel Placeholder */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pt-8'>
        <SkeletonBlock className='h-[250px] sm:h-[350px] lg:h-[420px] w-full rounded-2xl' />
      </div>

      {/* Content */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Column */}
          <div className='flex-1'>
            {/* Badges */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex gap-2'>
                <SkeletonBlock className='h-7 w-20 rounded-full' />
                <SkeletonBlock className='h-7 w-24 rounded-full' />
              </div>
              <SkeletonBlock className='h-9 w-9 rounded-full' />
            </div>

            {/* Title */}
            <SkeletonBlock className='h-8 w-3/4 mb-3' />
            {/* Price */}
            <div className='flex items-baseline gap-3 mb-4'>
              <SkeletonBlock className='h-8 w-40' />
              <SkeletonBlock className='h-5 w-24' />
            </div>

            {/* Address */}
            <div className='flex items-center gap-2 mb-6 pb-6 border-b border-gray-200'>
              <SkeletonBlock className='h-4 w-4 rounded-full shrink-0' />
              <SkeletonBlock className='h-4 w-2/3' />
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center gap-2'>
                  <SkeletonBlock className='h-5 w-5 rounded-full' />
                  <SkeletonBlock className='h-5 w-8' />
                  <SkeletonBlock className='h-3 w-16' />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className='mb-6'>
              <SkeletonBlock className='h-5 w-40 mb-4' />
              <div className='flex flex-col gap-2'>
                <SkeletonBlock className='h-3.5 w-full' />
                <SkeletonBlock className='h-3.5 w-full' />
                <SkeletonBlock className='h-3.5 w-11/12' />
                <SkeletonBlock className='h-3.5 w-4/5' />
                <SkeletonBlock className='h-3.5 w-3/4' />
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className='lg:w-[380px] shrink-0'>
            <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
              <SkeletonBlock className='h-5 w-3/4 mb-3' />
              <SkeletonBlock className='h-3.5 w-full mb-2' />
              <SkeletonBlock className='h-3.5 w-5/6 mb-6' />
              <SkeletonBlock className='h-12 w-full rounded-xl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Form Skeleton (matches UpdateListing.jsx layout) ──────────────────
export function EditFormSkeleton() {
  return (
    <div className='grid lg:grid-cols-5 gap-6'>
      {/* Left - Property Details */}
      <div className='lg:col-span-3 space-y-6'>
        {/* Basic Info Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5'>
          <SkeletonBlock className='h-5 w-32' />
          {/* Property Name */}
          <div>
            <SkeletonBlock className='h-3.5 w-24 mb-2' />
            <SkeletonBlock className='h-12 w-full rounded-xl' />
          </div>
          {/* Description */}
          <div>
            <SkeletonBlock className='h-3.5 w-20 mb-2' />
            <SkeletonBlock className='h-[120px] w-full rounded-xl' />
          </div>
          {/* Address */}
          <div>
            <SkeletonBlock className='h-3.5 w-16 mb-2' />
            <SkeletonBlock className='h-12 w-full rounded-xl' />
          </div>
          {/* Phone */}
          <div>
            <SkeletonBlock className='h-3.5 w-36 mb-2' />
            <SkeletonBlock className='h-12 w-full rounded-xl' />
          </div>
        </div>

        {/* Type & Features Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5'>
          <SkeletonBlock className='h-5 w-28' />
          {/* Listing Type */}
          <div>
            <SkeletonBlock className='h-3 w-20 mb-3' />
            <div className='flex gap-3'>
              <SkeletonBlock className='h-12 flex-1 rounded-xl' />
              <SkeletonBlock className='h-12 flex-1 rounded-xl' />
            </div>
          </div>
          {/* Checkboxes */}
          <div className='grid grid-cols-2 gap-3'>
            <SkeletonBlock className='h-12 rounded-xl' />
            <SkeletonBlock className='h-12 rounded-xl' />
            <SkeletonBlock className='h-12 rounded-xl' />
          </div>
          {/* Number inputs */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <SkeletonBlock className='h-3.5 w-16 mb-2' />
              <SkeletonBlock className='h-12 rounded-xl' />
            </div>
            <div>
              <SkeletonBlock className='h-3.5 w-20 mb-2' />
              <SkeletonBlock className='h-12 rounded-xl' />
            </div>
          </div>
          {/* Price inputs */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <SkeletonBlock className='h-3.5 w-24 mb-2' />
              <SkeletonBlock className='h-12 rounded-xl' />
            </div>
            <div>
              <SkeletonBlock className='h-3.5 w-28 mb-2' />
              <SkeletonBlock className='h-12 rounded-xl' />
            </div>
          </div>
        </div>
      </div>

      {/* Right - Image Upload */}
      <div className='lg:col-span-2 space-y-6'>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4'>
          <SkeletonBlock className='h-5 w-32' />
          <SkeletonBlock className='h-3.5 w-48 mb-2' />
          <SkeletonBlock className='h-32 w-full rounded-xl' />
          <SkeletonBlock className='h-10 w-full rounded-xl' />
          {/* Image preview placeholders */}
          <div className='space-y-3 mt-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-3 border border-gray-100 rounded-xl'>
                <SkeletonBlock className='h-16 w-20 rounded-lg shrink-0' />
                <SkeletonBlock className='h-3.5 flex-1' />
                <SkeletonBlock className='h-8 w-16 rounded-lg shrink-0' />
              </div>
            ))}
          </div>
        </div>
        {/* Submit button */}
        <SkeletonBlock className='h-14 w-full rounded-xl' />
      </div>
    </div>
  );
}
