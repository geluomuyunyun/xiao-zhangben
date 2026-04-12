import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import BillsPage from './pages/BillsPage';
import StatsPage from './pages/StatsPage';
import CategoryPage from './pages/CategoryPage';
import MePage from './pages/MePage';

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
        <Routes>
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="*" element={<Navigate to="/bills" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
