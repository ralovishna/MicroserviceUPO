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
	CircularProgress,
} from '@mui/material';

export default function UserList({
	users,
	loading,
	onAdd,
	onEdit,
	onDelete,
	page,
	rowsPerPage,
	setPage,
	setRowsPerPage,
	total,
}) {
	const [userToDelete, setUserToDelete] = useState(null);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TableContainer component={Paper} className='shadow-md'>
			{/* Header */}
			<div className='flex justify-between items-center p-4'>
				<h2 className='text-2xl font-semibold text-gray-800'>User List</h2>
				<button
					onClick={onAdd}
					className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'
				>
					Add User
				</button>
			</div>

			{/* Table */}
			<Table>
				<TableHead>
					<TableRow className='bg-gray-100'>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell align='center'>Country</TableCell>
						<TableCell align='center'>Actions</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={4} align='center' sx={{ py: 6 }}>
								<CircularProgress size={28} />
							</TableCell>
						</TableRow>
					) : users.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} align='center'>
								No users found
							</TableCell>
						</TableRow>
					) : (
						users.map((u) => (
							<TableRow key={u.id} hover>
								<TableCell className='font-medium text-gray-800'>
									{u.firstName} {u.lastName}
								</TableCell>
								<TableCell>{u.email}</TableCell>
								<TableCell align='center'>{u.country}</TableCell>
								<TableCell align='center'>
									<button
										onClick={() => onEdit(u)}
										className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2'
									>
										Edit
									</button>
									<button
										onClick={() => setUserToDelete(u)}
										className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
									>
										Delete
									</button>
								</TableCell>
							</TableRow>
						))
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

			{/* Confirm Delete Modal */}
			<ConfirmModal
				isOpen={!!userToDelete}
				title='Confirm User Deletion'
				message={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"?`}
				onConfirm={() => {
					onDelete(userToDelete.id);
					setUserToDelete(null);
				}}
				onCancel={() => setUserToDelete(null)}
			/>
		</TableContainer>
	);
}
