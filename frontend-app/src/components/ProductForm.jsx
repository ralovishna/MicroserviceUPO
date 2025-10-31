import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductForm({
	fetchProducts,
	editProduct,
	cancelEdit,
}) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stockQuantity, setStockQuantity] = useState('');
	const [category, setCategory] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (editProduct) {
			setName(editProduct.name);
			setDescription(editProduct.description || '');
			setPrice(editProduct.price);
			setStockQuantity(editProduct.stockQuantity);
			setCategory(editProduct.category);
			setImagePreview(
				editProduct.imageUrl?.startsWith('http')
					? editProduct.imageUrl
					: `http://localhost:8080${editProduct.imageUrl}`
			);
		} else {
			setName('');
			setDescription('');
			setPrice('');
			setStockQuantity('');
			setCategory('');
			setImageFile(null);
			setImagePreview('');
		}
	}, [editProduct]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage('');

		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('description', description);
			formData.append('price', price);
			formData.append('stockQuantity', stockQuantity);
			formData.append('category', category);

			if (imageFile) formData.append('image', imageFile);

			if (editProduct)
				await axios.put(
					`http://localhost:8080/products/${editProduct.id}`,
					formData
				);
			else await axios.post('http://localhost:8080/products', formData);

			fetchProducts();
			cancelEdit();
		} catch (err) {
			console.error('Failed to save product:', err);
			setErrorMessage(
				err.response?.data?.message ||
					err.response?.data?.error ||
					'Failed to save product. Please check your input.'
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-2'>
				{editProduct ? 'Edit Product' : 'Add Product'}
			</h2>

			{errorMessage && (
				<div className='p-3 bg-red-100 text-red-700 border border-red-300 rounded'>
					{errorMessage}
				</div>
			)}

			{/* Row 1 - Name, Category */}
			<div className='grid grid-cols-2 gap-4'>
				<input
					placeholder='Product Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				/>
				<input
					placeholder='Category'
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				/>
			</div>

			{/* Row 2 - Price, Stock */}
			<div className='grid grid-cols-2 gap-4'>
				<input
					placeholder='Price'
					type='number'
					step='0.01'
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				/>
				<input
					placeholder='Stock Quantity'
					type='number'
					value={stockQuantity}
					onChange={(e) => setStockQuantity(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				/>
			</div>

			{/* Description */}
			<textarea
				rows={3}
				placeholder='Description'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className='w-full border border-gray-300 rounded-md p-2 resize-none focus:ring-2 focus:ring-indigo-500'
			/>

			{/* Image Upload */}
			<div className='space-y-2'>
				<input
					type='file'
					accept='image/*'
					onChange={handleImageChange}
					className='w-full border border-gray-300 rounded-md p-2'
				/>
				{imagePreview && (
					<img
						src={imagePreview}
						alt='Preview'
						className='w-32 h-32 object-cover border rounded'
					/>
				)}
			</div>

			{/* Buttons */}
			<div className='flex justify-end space-x-3 mt-4'>
				<button
					type='submit'
					className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition'
				>
					{editProduct ? 'Update Product' : 'Add Product'}
				</button>
			</div>
		</form>
	);
}
