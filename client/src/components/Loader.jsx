export default function Loader() {
  return (
    <div className='fixed inset-0 bg-teal-900 flex items-center justify-center z-50'>
      {/* Outer ring */}
      <div className='relative flex flex-col items-center'>
        <div className='w-28 h-28 rounded-full border-4 border-teal-700 border-t-teal-400 animate-spin' />

        {/* Inner ring spinning opposite */}
        <div className='absolute top-3 w-22 h-22 rounded-full border-4 border-slate-700 border-b-slate-300 animate-spin-reverse'
          style={{ width: '88px', height: '88px' }}
        />

        {/* Center dot pulse */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-teal-400 rounded-full animate-pulse' />

        {/* Brand label */}
        <div className='mt-8 text-center'>
          <h2 className='text-xl font-bold text-white tracking-wide'>
            Kamankar<span className='text-teal-400'>Estate</span>
          </h2>
          <div className='flex items-center justify-center gap-1.5 mt-3'>
            <div className='w-2 h-2 bg-teal-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
            <div className='w-2 h-2 bg-teal-300 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
            <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
