import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import ProtectedRoute from './contexts/protected-route.context';
import { AuthProvider } from './contexts/auth.context';

const router = createBrowserRouter([
  { path: 'home', element: <ProtectedRoute> <Home /> </ProtectedRoute> },
  { path: 'login', element: <Login /> },
  { path: 'sign-up', element: <SignUp /> },
  { path: '*', element: <Navigate to="/home" /> }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementsByTagName('html')[0]?.classList?.add('bg-steel-blue-100');

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
