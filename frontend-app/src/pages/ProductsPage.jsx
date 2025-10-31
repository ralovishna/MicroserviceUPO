import { useEffect, useState } from 'react';
import api from '../api/api.js';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Modal from '../components/Modal.jsx';

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);

	const fetchProducts = async (page = 0, size = 10) => {
		try {
			const res = await api.get(`/products?page=${page}&size=${size}`);
			setProducts(res.data.content || res.data);
			setTotal(res.data.totalElements || res.data.length);
		} catch (err) {
			console.error('Failed to fetch products:', err);
		}
	};

	useEffect(() => {
		fetchProducts(page, rowsPerPage);
	}, [page, rowsPerPage]);

	const startAdd = () => {
		setSelectedProduct(null);
		setIsModalOpen(true);
	};

	const startEdit = (product) => {
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const handleDelete = async (productId) => {
		try {
			await api.delete(`/products/${productId}`);
			await fetchProducts(page, rowsPerPage);
			alert('Product deleted successfully');
		} catch (err) {
			console.error('Failed to delete product:', err);
			alert('Failed to delete product');
		}
	};

	return (
		<div className='mx-auto p-6'>
			<ProductList
				products={products}
				fetchProducts={fetchProducts}
				startEdit={startEdit}
				startAdd={startAdd}
				onDelete={handleDelete}
				page={page}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				setRowsPerPage={setRowsPerPage}
				total={total}
			/>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ProductForm
					editProduct={selectedProduct}
					fetchProducts={() => fetchProducts(page, rowsPerPage)}
					cancelEdit={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
