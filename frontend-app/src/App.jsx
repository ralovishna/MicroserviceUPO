import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
} from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import { Navigate } from 'react-router-dom';

function App() {
	return (
		<Router>
			<nav className='bg-gray-800 p-4 text-white'>
				<NavLink className='mr-4 hover:underline' to='/users'>
					Users
				</NavLink>
				<NavLink className='mr-4 hover:underline' to='/products'>
					Products
				</NavLink>
				<NavLink className='hover:underline' to='/orders'>
					Orders
				</NavLink>
			</nav>
			<Routes>
				<Route path='/' element={<Navigate to='/orders' replace />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/orders' element={<OrdersPage />} />
			</Routes>
		</Router>
	);
}

export default App;
