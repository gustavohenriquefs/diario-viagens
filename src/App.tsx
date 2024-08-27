import './App.css';
import { Login } from './pages/login/login';
import { CreateTravelDiary } from './pages/travel-diary/create-travel-diary/create-travel-diary';

function App() {
  return (
    <div className="h-full">
      <Login />
      <CreateTravelDiary />
    </div>
  );
}

export default App;
