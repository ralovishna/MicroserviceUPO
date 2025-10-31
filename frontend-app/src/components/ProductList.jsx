import { useState } from 'react';
import ConfirmModal from './ConfirmModal.jsx';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	TablePagination,
} from '@mui/material';

export default function ProductList({
	products,
	startEdit,
	startAdd,
	onDelete,
	page,
	rowsPerPage,
	setPage,
	setRowsPerPage,
	total,
}) {
	const [productToDelete, setProductToDelete] = useState(null);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TableContainer component={Paper} className='shadow-md'>
			<div className='flex justify-between items-center p-4'>
				<h2 className='text-2xl font-semibold text-gray-800'>Product List</h2>
				<button
					onClick={startAdd}
					className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'
				>
					Add Product
				</button>
			</div>

			<Table>
				<TableHead>
					<TableRow className='bg-gray-100'>
						<TableCell>Image</TableCell>
						<TableCell>Name</TableCell>
						<TableCell align='center'>Price</TableCell>
						<TableCell align='center'>Stock</TableCell>
						<TableCell align='center'>Category</TableCell>
						<TableCell align='center'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products.map((p) => (
						<TableRow key={p.id} hover>
							<TableCell>
								<img
									src={
										p.imageUrl?.startsWith('http')
											? p.imageUrl
											: `http://localhost:8080${p.imageUrl}`
									}
									alt={p.name}
									className='w-16 h-16 object-cover rounded-md border'
								/>
							</TableCell>
							<TableCell className='font-medium text-gray-800'>
								{p.name}
							</TableCell>
							<TableCell align='center'>${p.price?.toFixed(2)}</TableCell>
							<TableCell align='center'>
								<span
									className={`px-2 py-1 rounded-full text-sm font-medium ${
										p.stockQuantity > 10
											? 'bg-green-100 text-green-700'
											: p.stockQuantity > 0
											? 'bg-yellow-100 text-yellow-700'
											: 'bg-red-100 text-red-700'
									}`}
								>
									{p.stockQuantity}
								</span>
							</TableCell>
							<TableCell align='center'>{p.category}</TableCell>
							<TableCell align='center'>
								<button
									onClick={() => startEdit(p)}
									className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2'
								>
									Edit
								</button>
								<button
									onClick={() => setProductToDelete(p)}
									className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
								>
									Delete
								</button>
							</TableCell>
						</TableRow>
					))}
					{products.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} align='center'>
								No products found
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

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

			<ConfirmModal
				isOpen={!!productToDelete}
				title='Confirm Product Deletion'
				message={`Are you sure you want to delete "${productToDelete?.name}"?`}
				onConfirm={() => {
					onDelete(productToDelete.id);
					setProductToDelete(null);
				}}
				onCancel={() => setProductToDelete(null)}
			/>
		</TableContainer>
	);
}
