import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AuthProvider } from './contexts/auth.context';
import { TravelDiaryToastProvider } from './contexts/message.context';
import ProtectedRoute from './contexts/protected-route.context';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { CreateTravelDiary } from './pages/travel-diary/create-travel-diary/create-travel-diary';
import { ListTravelDiary } from './pages/travel-diary/list-travel-diary/list-travel-diary';
import { UpdateTravelDiary } from './pages/travel-diary/update-travel-diary/update-travel-diary';
import { Setting } from './settings/settings';
import { ChangePasswordForm } from './pages/change-password/change-password';

const router = createBrowserRouter([
  {
    path: 'home', element: <ProtectedRoute> <Home /> </ProtectedRoute>,
    children: [
      {
        path: 'diary-travels',
        element: <ListTravelDiary />
      },
      {
        path: 'diary-travels/:id',
        element: <UpdateTravelDiary />
      },
      {
        path: 'diary-travels/new',
        element: <CreateTravelDiary />
      },
      {
        path: 'change-password',
        element: <ChangePasswordForm /> 
      },
      {
        path: '',
        element: <Navigate to="/home/diary-travels" />
      },
      {
        path: '*',
        element: <Navigate to="/home/diary-travels" />
      }
    ]
  },
  {
    path: 'settings',
    element: <ProtectedRoute> <Setting /> </ProtectedRoute>
  },
  { path: 'login', element: <Login /> },
  { path: 'sign-up', element: <SignUp /> },
  { path: '*', element: <Navigate to="/home" /> }
]);


function App() {
  return (
    <AuthProvider>
      <TravelDiaryToastProvider>
        <RouterProvider router={router} />
      </TravelDiaryToastProvider>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
