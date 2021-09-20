import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { default as Axios, default as axios } from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { SWRConfig } from "swr";
import CartProtectedRoute from './components/auth/CartProtecedRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Cart from './pages/Cart';
import Confirm from './pages/Confirm';
import CreateProduct from './pages/admin/CreateProduct';
import Dashboard from './pages/admin/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Home from "./pages/Home";
import Login from './pages/Login';
import Orders from './pages/Orders';
import Payment from './pages/PaymentPage';
import ProductDetails from './pages/ProductDetails';
import ProductListAdmin from './pages/admin/ProductList';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Shipping from './pages/Shipping';
import UpdateProduct from './pages/admin/UpdateProduct';
import UpdateProfile from './pages/UpdateProfile';
import OrdersList from './pages/admin/OrdersList';
import UpdateOrder from './pages/admin/UpdateOrder';
import UsersList from './pages/admin/UsersList';
import UpdateUser from './pages/admin/UpdateUser';
import ReviewsList from './pages/admin/ReviewsList';

Axios.defaults.baseURL = process.env.URL || "https://shopit--api.herokuapp.com/api"
Axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
    try {
        const { data } = await Axios.get(url)
        return data
    } catch (error) {
        throw error.response.data
    }
}

function App() {
    const [stripeApiKey, setstripeApiKey] = useState("")
    const getStripeApiKey = async () => {
        try {

            const { data } = await axios.get('/payment/stripeApi')
            setstripeApiKey(data?.stripeApiKey)
        } catch (error) {

        }
    }
    useEffect(() => { getStripeApiKey() }, [])

    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 50000,
            }}
        >

            <Router>
                <Header />
                <Route exact path='/' component={Home} />
                <Route exact path='/search/:keyword' component={Home} />
                <Route exact path='/product/:id' component={ProductDetails} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/forgot-Password/' component={ForgotPassword} />
                <Route exact path='/reset-password/:token' component={ResetPassword} />

                {/*CART & USER PROTECTED ROUTES*/}
                <CartProtectedRoute exact path='/cart' component={Cart} />
                <CartProtectedRoute exact path='/shipping' component={Shipping} />
                <CartProtectedRoute exact path='/order/confirm' component={Confirm} />

                {/*USER PROTECTED ROUTES*/}
                <ProtectedRoute isAdmin={false} exact path='/profile' component={Profile} />
                <ProtectedRoute isAdmin={false} exact path='/updateProfile' component={UpdateProfile} />
                <ProtectedRoute isAdmin={false} exact path='/orders' component={Orders} />
                {stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}>

                    <CartProtectedRoute exact path='/order/payment' component={Payment} /> </Elements>}
                {/*ADMIN ROUTES*/}
                <ProtectedRoute isAdmin={true} exact path='/dashboard' component={Dashboard} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/products' component={ProductListAdmin} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/orders' component={OrdersList} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/users' component={UsersList} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/reviews' component={ReviewsList} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/orders/:id' component={UpdateOrder} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/products/new' component={CreateProduct} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/products/:id' component={UpdateProduct} />
                <ProtectedRoute isAdmin={true} exact path='/dashboard/users/:id' component={UpdateUser} />

                <Footer />
            </Router>
        </SWRConfig>
    );
}

export default App;