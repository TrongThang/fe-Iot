import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import EmergencyAlertSystem from '@/components/common/EmergencyAlertSystem';
import { Toaster } from 'sonner';

function App() {
	return (
		<AuthProvider>
			<SocketProvider>
				<RouterProvider router={router} />
				<EmergencyAlertSystem />
				<Toaster />
			</SocketProvider>
		</AuthProvider>
	);
}

export default App;  