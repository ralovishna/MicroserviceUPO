import { useEffect, useState } from 'react';
import api from '../api/api.js';
import Modal from '../components/Modal.jsx';
import UserList from '../components/UserList.jsx';
import UserForm from '../components/UserForm.jsx';

export default function UserPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// Pagination
	const [page, setPage] = useState(0); // 0-based index for pagination
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);

	// ✅ Fetch Users
	const fetchUsers = async (page = 0, size = 10) => {
		setLoading(true);
		try {
			const res = await api.get(`/users?page=${page}&size=${size}`);
			setUsers(res.data.content || res.data);
			setTotal(res.data.totalElements || res.data.length);
		} catch (err) {
			console.error('Failed to fetch users:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(page, rowsPerPage);
	}, [page, rowsPerPage]);

	// ✅ Add/Edit/Delete Handlers
	const handleAdd = () => {
		setSelectedUser(null);
		setIsModalOpen(true);
	};

	const handleEdit = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/users/${id}`);
			await fetchUsers(page, rowsPerPage);
			alert('User deleted successfully');
		} catch (err) {
			console.error('Failed to delete user:', err);
			alert('Failed to delete user');
		}
	};

	return (
		<div className='mx-auto p-6'>
			<UserList
				users={users}
				loading={loading}
				onAdd={handleAdd}
				onEdit={handleEdit}
				onDelete={handleDelete}
				page={page}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				setRowsPerPage={setRowsPerPage}
				total={total}
			/>

			{/* ✅ Modal for Add/Edit */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<UserForm
					existingUser={selectedUser}
					fetchUsers={() => fetchUsers(page, rowsPerPage)}
					backToList={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
