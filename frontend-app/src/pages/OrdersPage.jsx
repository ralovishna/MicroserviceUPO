import { useState, useEffect } from 'react';
import api from '../api/api.js';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import Modal from '../components/Modal.jsx';

export default function OrdersPage() {
	const [orders, setOrders] = useState([]);
	const [users, setUsers] = useState([]);
	const [products, setProducts] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [page, setPage] = useState(0); // 0-based for TablePagination
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);

	// ✅ Fetch orders (paginated)
	const fetchOrders = async (page = 0, size = 10) => {
		setLoading(true);
		try {
			const res = await api.get(`/orders?page=${page}&size=${size}`);
			setOrders(res.data.content || res.data);
			setTotal(res.data.totalElements || res.data.length);
		} catch (err) {
			console.error('Failed to fetch orders:', err);
		} finally {
			setLoading(false);
		}
	};

	const fetchUsersAndProducts = async () => {
		try {
			const usersRes = await api.get('/users');
			const productsRes = await api.get('/products');

			// Ensure arrays even if backend returns paginated structure
			setUsers(usersRes.data.content || usersRes.data || []);
			setProducts(productsRes.data.content || productsRes.data || []);
		} catch (err) {
			console.error('Failed to fetch users/products:', err);
		}
	};

	useEffect(() => {
		fetchOrders(page, rowsPerPage);
		fetchUsersAndProducts();
	}, [page, rowsPerPage]);

	const startAdd = () => {
		setSelectedOrder(null);
		setIsModalOpen(true);
	};

	const startEdit = (order) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	const handleDelete = async (orderId) => {
		try {
			await api.delete(`/orders/${orderId}`);
			await fetchOrders(page, rowsPerPage);
			alert('Order deleted successfully');
		} catch (err) {
			console.error('Failed to delete order:', err);
			alert('Failed to delete order');
		}
	};

	return (
		<div className='mx-auto p-6'>
			<OrderList
				orders={orders}
				loading={loading}
				startEdit={startEdit}
				startAdd={startAdd}
				users={users}
				products={products}
				onDelete={handleDelete}
				page={page}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				setRowsPerPage={setRowsPerPage}
				total={total}
			/>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<OrderForm
					users={users}
					products={products}
					existingOrder={selectedOrder}
					fetchOrders={() => fetchOrders(page, rowsPerPage)}
					backToList={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
