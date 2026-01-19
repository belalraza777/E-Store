import './App.css'
import Layout from './layout/Layout'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/authContext'

function App() {

  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  )
}

export default App
