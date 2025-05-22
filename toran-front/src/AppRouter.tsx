import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Welcome from './Components/layout/Welcome/welcome';
const Login = lazy(() => import('./Components/layout/Login/login'));
const Signup = lazy(() => import('./Components/layout/Signup/signup'));
const Home = lazy(() => import('./Components/layout/HomePage/homepage'));


const AppRounter = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/' element={<Welcome/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/home' element={<Home/>}/>
            </Routes>
        </Suspense>
    )
}

export default AppRounter
