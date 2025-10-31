const API_BASE = 'http://localhost:8080';

export const fetchUsers = async () => {
	const res = await fetch(`${API_BASE}/users`);
	return res.json();
};

export const createUser = async (user) => {
	const res = await fetch(`${API_BASE}/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(user),
	});
	return res.json();
};

export const fetchProducts = async () => {
	const res = await fetch(`${API_BASE}/products`);
	return res.json();
};

export const createProduct = async (product) => {
	const res = await fetch(`${API_BASE}/products`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(product),
	});
	return res.json();
};

export const fetchOrders = async () => {
	const res = await fetch(`${API_BASE}/orders`);
	return res.json();
};

export const createOrder = async (order) => {
	const res = await fetch(`${API_BASE}/orders`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(order),
	});
	return res.json();
};
