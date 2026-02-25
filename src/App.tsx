import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SkillPage from './pages/SkillPage';

const InternalPage = import.meta.env.DEV
  ? lazy(() => import('./pages/InternalPage'))
  : null;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills/:slug" element={<SkillPage />} />
          <Route
            path="/internal"
            element={
              InternalPage
                ? <Suspense><InternalPage /></Suspense>
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
