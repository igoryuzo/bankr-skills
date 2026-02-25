import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SkillPage from './pages/SkillPage';
import InternalPage from './pages/InternalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills/:slug" element={<SkillPage />} />
          <Route
            path="/internal"
            element={import.meta.env.DEV ? <InternalPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
