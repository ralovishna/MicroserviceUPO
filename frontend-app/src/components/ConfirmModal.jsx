import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}) {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className='bg-white p-6 rounded-2xl shadow-lg w-96'
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h3>
					<p className='text-gray-600 mb-6'>{message}</p>

					<div className='flex justify-end space-x-3'>
						<button
							onClick={onCancel}
							className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition'
						>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
						>
							Delete
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
