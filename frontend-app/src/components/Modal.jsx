// src/components/Modal.jsx
export default function Modal({
	isOpen,
	onClose,
	children,
	widthClass = 'max-w-4xl',
}) {
	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`relative w-full ${widthClass} mx-4 bg-white rounded-2xl shadow-xl p-6 transition-all duration-300`}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold'
				>
					&times;
				</button>

				{children}
			</div>
		</div>
	);
}
