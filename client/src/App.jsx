// App.jsx - Root component that wraps entire application
// Styles loaded via main.css
import Layout from './layout/Layout'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'sonner'

function App() {
  return (
    // AuthProvider - provides user authentication state to all components
    <AuthProvider>
      {/* Toast notifications - appears at top center */}
      <Toaster richColors position="top-center" closeButton />
      {/* Layout - renders header/footer based on user role */}
      <Layout>
        {/* AppRoutes - handles all page routing */}
        <AppRoutes />
      </Layout>
    </AuthProvider>
  )
}

export default App
