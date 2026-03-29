export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50' onClick={onCancel}>
      <div
        className='bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='text-lg font-bold text-slate-800 mb-2'>{title}</h3>
        <p className='text-gray-500 text-sm mb-6'>{message}</p>
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onCancel}
            className='px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors'
          >
            Yes, Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
