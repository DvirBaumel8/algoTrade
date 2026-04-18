import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StockSearch from './pages/StockSearch';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StockSearch />} />
        <Route path="/dashboard/:symbol" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
