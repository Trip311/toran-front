import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Welcome from './Components/layout/Welcome/welcome';
import Loader from './Components/layout/Loader';
const Login = lazy(() => import('./Components/layout/Login/login'));
const Signup = lazy(() => import('./Components/layout/Signup/signup'));
const Home = lazy(() => import('./Components/layout/HomePage/homepage'));
const ViewReqs = lazy(() => import('./Components/layout/ViewReqs/ViewReqs'));


const AppRounter = () => {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path='/' element={<Welcome/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/requests' element={<ViewReqs/>}/>
            </Routes>
        </Suspense>
    )
}

export default AppRounter
