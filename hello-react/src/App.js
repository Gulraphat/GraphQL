
import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;
