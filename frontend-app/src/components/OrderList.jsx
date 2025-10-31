import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
	TablePagination,
	Avatar,
	Chip,
	Box,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal.jsx';

export default function OrderList({
	orders,
	loading,
	startEdit,
	startAdd,
	users,
	products,
	onDelete,
	page,
	rowsPerPage,
	setPage,
	setRowsPerPage,
	total,
}) {
	const [orderToDelete, setOrderToDelete] = useState(null);

	const getUserById = (id) =>
		Array.isArray(users) ? users.find((u) => u.id === id) : null;

	const getProductById = (id) =>
		Array.isArray(products) ? products.find((p) => p.id === id) : null;

	const handleChangePage = (_, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	// ---- Soft background (no opacity), solid text ----
	const getStatusChipProps = (status) => {
		const lower = (status || '').toLowerCase();
		let baseColor = 'grey';

		switch (lower) {
			case 'pending':
				baseColor = 'warning';
				break;
			case 'shipped':
				baseColor = 'info';
				break;
			case 'delivered':
				baseColor = 'success';
				break;
			case 'cancelled':
				baseColor = 'error';
				break;
		}

		return {
			// Use MUI's .light variant for soft pastel background
			sx: {
				bgcolor: `${baseColor}.50`, // Very light tint (like #FFF8E1 for warning)
				color: `${baseColor}.800`, // Dark, readable text
				borderRadius: '0.25rem', // Less rounded
				fontWeight: 600,
				minWidth: 88,
				opacity: 1, // Full visibility
				'& .MuiChip-label': {
					padding: '0 8px',
				},
			},
		};
	};

	return (
		<TableContainer component={Paper} className='shadow-md'>
			{/* Header */}
			<Box className='flex justify-between items-center p-4'>
				<Typography variant='h5' fontWeight={600} color='gray.800'>
					Order List
				</Typography>
				<button
					onClick={startAdd}
					className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'
				>
					Add Order
				</button>
			</Box>

			{/* Table */}
			<Table>
				<TableHead sx={{ bgcolor: 'grey.100' }}>
					<TableRow>
						<TableCell>Order ID</TableCell>
						<TableCell>User</TableCell>
						<TableCell>Product</TableCell>
						<TableCell align='center'>Qty</TableCell>
						<TableCell align='center'>Total</TableCell>
						<TableCell align='center'>Status</TableCell>
						<TableCell align='center'>Actions</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={7} align='center' sx={{ py: 6 }}>
								<CircularProgress size={28} />
							</TableCell>
						</TableRow>
					) : orders.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} align='center'>
								No orders found
							</TableCell>
						</TableRow>
					) : (
						orders.map((o) => {
							const user = getUserById(o.userId);
							const product = getProductById(o.productId);

							return (
								<TableRow key={o.id} hover>
									<TableCell>{o.id}</TableCell>

									{/* User */}
									<TableCell>
										{user ? (
											<Box>
												<Typography variant='body2' fontWeight='medium'>
													{user.firstName} {user.lastName}
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													{user.email}
												</Typography>
											</Box>
										) : (
											'Unknown'
										)}
									</TableCell>

									{/* Product – bigger image */}
									<TableCell>
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
										>
											<Avatar
												src={product?.imageUrl}
												alt={product?.name}
												variant='rounded'
												sx={{ width: 48, height: 48 }}
											>
												{product?.name?.[0] || '?'}
											</Avatar>
											<Typography variant='body2'>
												{product?.name || 'Unknown'}
											</Typography>
										</Box>
									</TableCell>

									<TableCell align='center'>{o.quantity}</TableCell>

									<TableCell align='center'>
										${o.totalPrice?.toFixed(2) ?? '0.00'}
									</TableCell>

									{/* Status – Soft background, solid text */}
									<TableCell align='center'>
										<Chip
											label={o.status || 'Unknown'}
											{...getStatusChipProps(o.status)}
										/>
									</TableCell>

									{/* Actions */}
									<TableCell align='center'>
										<button
											onClick={() => startEdit(o)}
											className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs mr-1'
										>
											Edit
										</button>
										<button
											onClick={() => setOrderToDelete(o)}
											className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs'
										>
											Delete
										</button>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			<TablePagination
				component='div'
				count={total}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
				labelDisplayedRows={({ from, to, count }) =>
					`${from}-${to} of ${count}`
				}
			/>

			{/* Confirm Modal */}
			<ConfirmModal
				isOpen={!!orderToDelete}
				title='Confirm Order Deletion'
				message={`Are you sure you want to delete Order #${orderToDelete?.id}?`}
				onConfirm={() => {
					onDelete(orderToDelete.id);
					setOrderToDelete(null);
				}}
				onCancel={() => setOrderToDelete(null)}
			/>
		</TableContainer>
	);
}
