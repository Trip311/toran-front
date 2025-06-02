import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Welcome from './Components/layout/Welcome/welcome.js';
import Loader from './Components/layout/Loader.jsx';
const Login = lazy(() => import('./Components/layout/Login/login.js'));
const Signup = lazy(() => import('./Components/layout/Signup/signup.js'));
const Home = lazy(() => import('./Components/layout/HomePage/homepage.js'));
const ViewReqs = lazy(() => import('./Components/layout/ViewReqs/ViewReqs.js'));
const MyRequests = lazy(() => import('./Components/layout/HomePage/Navbar/MyRequests/MyRequests.js'));


const AppRounter = () => {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path='/' element={<Welcome/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/requests' element={<ViewReqs/>}/>
                <Route path='/my-requests' element={<MyRequests/>}/>
            </Routes>
        </Suspense>
    )
}

export default AppRounter
