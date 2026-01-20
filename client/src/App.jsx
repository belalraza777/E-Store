// Styles loaded via main.css
import Layout from './layout/Layout'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'sonner'

function App() {

  return (
    <AuthProvider>
      <Toaster richColors position="top-center" closeButton />
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  )
}

export default App
