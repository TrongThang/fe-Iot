import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
			<Toaster />
		</AuthProvider>
	);
}

export default App;  