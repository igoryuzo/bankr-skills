import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SkillPage from './pages/SkillPage';

const InternalPage = import.meta.env.DEV
  ? lazy(() => import('./pages/InternalPage'))
  : null;

export default function App() {
  return (
    <BrowserRouter>
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
