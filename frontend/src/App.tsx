import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { ArtworkDetailPage } from './pages/ArtworkDetailPage'
import { ArtistsPage } from './pages/ArtistsPage'
import { ArtistDetailPage } from './pages/ArtistDetailPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { WishlistPage } from './pages/WishlistPage'
import { ApplyPage } from './pages/ApplyPage'
import { StudioPage } from './pages/StudioPage'
import { AdminPage } from './pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="artworks" element={<ExplorePage />} />
          <Route path="artworks/:idOrSlug" element={<ArtworkDetailPage />} />
          <Route path="artists" element={<ArtistsPage />} />
          <Route path="artists/:id" element={<ArtistDetailPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="apply"
            element={
              <ProtectedRoute>
                <ApplyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="studio"
            element={
              <ProtectedRoute roles={['ARTIST']}>
                <StudioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute roles={['OWNER']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
