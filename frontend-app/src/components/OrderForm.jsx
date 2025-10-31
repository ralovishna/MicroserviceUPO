import { useState, useEffect } from 'react';
import api from '../api/api.js';

export default function OrderForm({
	users,
	products,
	fetchOrders,
	existingOrder,
	backToList,
}) {
	const [userId, setUserId] = useState('');
	const [productId, setProductId] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [status, setStatus] = useState('PENDING');
	const [shippingAddress, setShippingAddress] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (existingOrder) {
			setUserId(existingOrder.userId);
			setProductId(existingOrder.productId);
			setQuantity(existingOrder.quantity);
			setStatus(existingOrder.status);
			setShippingAddress(existingOrder.shippingAddress);
		} else {
			setUserId('');
			setProductId('');
			setQuantity(1);
			setStatus('PENDING');
			setShippingAddress('');
		}
	}, [existingOrder]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage('');

		try {
			const payload = {
				userId: parseInt(userId),
				productId: parseInt(productId),
				quantity: parseInt(quantity),
				status,
				shippingAddress,
			};

			if (existingOrder) {
				await api.put(`orders/${existingOrder.id}`, payload);
			} else {
				await api.post('/orders', payload);
			}

			fetchOrders();
			backToList();
		} catch (err) {
			console.error('Failed to save order:', err);
			setErrorMessage(
				err.response?.data?.message || 'Failed to save order. Please try again.'
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-2'>
				{existingOrder ? 'Edit Order' : 'Create Order'}
			</h2>

			{errorMessage && (
				<div className='p-3 bg-red-100 text-red-700 border border-red-300 rounded'>
					{errorMessage}
				</div>
			)}

			{/* Row 1 - User & Product */}
			<div className='grid grid-cols-2 gap-4'>
				<select
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				>
					<option value=''>Select User</option>
					{users.map((u) => (
						<option key={u.id} value={u.id}>
							{u.firstName} {u.lastName}
						</option>
					))}
				</select>

				<select
					value={productId}
					onChange={(e) => setProductId(e.target.value)}
					required
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				>
					<option value=''>Select Product</option>
					{products.map((p) => (
						<option key={p.id} value={p.id}>
							{p.name} (${p.price})
						</option>
					))}
				</select>
			</div>

			{/* Row 2 - Quantity & Status */}
			<div className='grid grid-cols-2 gap-4'>
				<input
					type='number'
					min='1'
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
					placeholder='Quantity'
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				/>

				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className='border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500'
				>
					<option value='PENDING'>PENDING</option>
					<option value='SHIPPED'>SHIPPED</option>
					<option value='DELIVERED'>DELIVERED</option>
					<option value='CANCELLED'>CANCELLED</option>
				</select>
			</div>

			{/* Shipping Address */}
			<textarea
				rows={2}
				value={shippingAddress}
				onChange={(e) => setShippingAddress(e.target.value)}
				placeholder='Shipping Address'
				className='w-full border border-gray-300 rounded-md p-2 resize-none focus:ring-2 focus:ring-indigo-500'
			/>

			{/* Buttons */}
			<div className='flex justify-end space-x-3 mt-4'>
				<button
					type='submit'
					className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition'
				>
					{existingOrder ? 'Update Order' : 'Place Order'}
				</button>
			</div>
		</form>
	);
}
