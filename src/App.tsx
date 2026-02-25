import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="/internal" element={<InternalPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
