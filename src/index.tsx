import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

<div>
<script src="./node_modules/lodash/lodash.min.js"></script>
<script src="./node_modules/dropzone/dist/dropzone-min.js"></script>
</div>

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementsByTagName('html')[0]?.classList?.add('bg-steel-blue-100');

root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
