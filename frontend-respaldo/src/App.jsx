import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import Perfil from './Pages/Perfil'
import AdminDashboard from './Pages/Admin_dashboard'
import MyEvents from './Pages/MyEvents'
import MySubscriptions from './Pages/MySubscriptions'


function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" richColors />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/my-events" element={<MyEvents />} />
                <Route path="/my-subscriptions" element={<MySubscriptions />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App