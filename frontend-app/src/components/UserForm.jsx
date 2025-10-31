import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function UserForm({ fetchUsers, existingUser, backToList }) {
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		country: '',
	});

	const [errorMessage, setErrorMessage] = useState('');

	// ✅ Pre-fill form when editing
	useEffect(() => {
		if (existingUser) {
			setForm({
				firstName: existingUser.firstName || '',
				lastName: existingUser.lastName || '',
				email: existingUser.email || '',
				phone: existingUser.phone || '',
				address: existingUser.address || '',
				city: existingUser.city || '',
				country: existingUser.country || '',
			});
		} else {
			setForm({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				address: '',
				city: '',
				country: '',
			});
		}
		setErrorMessage('');
	}, [existingUser]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage('');

		try {
			if (existingUser) {
				await api.put(`/users/${existingUser.id}`, form);
			} else {
				await api.post('/users', form);
			}
			await fetchUsers();
			backToList();
		} catch (err) {
			console.error('Failed to save user:', err);
			setErrorMessage(
				err.response?.data?.message ||
					err.response?.data?.error ||
					'Failed to save user. Please check your input.'
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-5'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-2'>
				{existingUser ? 'Edit User' : 'Add User'}
			</h2>

			{errorMessage && (
				<div className='p-3 bg-red-100 text-red-700 border border-red-300 rounded'>
					{errorMessage}
				</div>
			)}

			{/* Row 1 — First Name, Last Name, Email, Phone */}
			<div className='grid grid-cols-4 gap-4'>
				<input
					name='firstName'
					placeholder='First Name'
					value={form.firstName}
					onChange={handleChange}
					required
					className='border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 border-gray-300'
				/>
				<input
					name='lastName'
					placeholder='Last Name'
					value={form.lastName}
					onChange={handleChange}
					required
					className='border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 border-gray-300'
				/>
				<input
					type='email'
					name='email'
					placeholder='Email'
					value={form.email}
					onChange={handleChange}
					required
					className='border p-2 col-span-2 rounded-md focus:ring-2 focus:ring-indigo-500 border-gray-300'
				/>
			</div>

			{/* Address, City, Phone, Country Layout */}
			<div className='grid grid-cols-2 gap-4 items-start'>
				{/* Address (spanning both rows) */}
				<div className='row-span-2'>
					<textarea
						rows={4}
						name='address'
						placeholder='Address'
						value={form.address}
						onChange={handleChange}
						className='w-full border border-gray-300 p-3 rounded-lg resize-none shadow-sm focus:ring-2 focus:ring-indigo-500'
					/>
				</div>

				{/* Row 1 → City */}
				<div>
					<input
						name='city'
						placeholder='City'
						value={form.city}
						onChange={handleChange}
						className='w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500'
					/>
				</div>

				{/* Row 2 → Phone + Country */}
				<div className='grid grid-cols-2 gap-4'>
					<input
						name='phone'
						placeholder='Phone'
						value={form.phone}
						onChange={handleChange}
						pattern='[0-9]{10,15}'
						title='Phone must be 10–15 digits'
						className='w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500'
					/>
					<input
						name='country'
						placeholder='Country'
						value={form.country}
						onChange={handleChange}
						className='w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500'
					/>
				</div>
			</div>

			{/* Buttons */}
			<div className='flex justify-end space-x-3 mt-4'>
				<button
					type='button'
					onClick={backToList}
					className='bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition'
				>
					Cancel
				</button>
				<button
					type='submit'
					className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition'
				>
					{existingUser ? 'Update User' : 'Add User'}
				</button>
			</div>
		</form>
	);
}
