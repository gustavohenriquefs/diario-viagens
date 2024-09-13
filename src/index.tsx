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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TravelDiaryToastProvider } from './contexts/message.context';
import { ListTravelDiary } from './pages/travel-diary/list-travel-diary/list-travel-diary';
import { CreateTravelDiary } from './pages/travel-diary/create-travel-diary/create-travel-diary';
import { UpdateTravelDiary } from './pages/travel-diary/update-travel-diary/update-travel-diary';
import { Setting } from './settings/settings';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementsByTagName('html')[0]?.classList?.add('bg-steel-blue-100');

root.render(
  <AuthProvider>
    <TravelDiaryToastProvider>
      <RouterProvider router={router} />
    </TravelDiaryToastProvider>
    <ToastContainer />
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
