import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import './index.css';
import { Login } from './pages/login/login';
import reportWebVitals from './reportWebVitals';
import { Home } from './pages/home/home';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: 'login', element: <Login /> }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementsByTagName('html')[0]?.classList?.add('bg-steel-blue-100');

root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
