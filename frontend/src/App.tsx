import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./login/login";
import Signup from "./signup/signup";
import Home from "./home/home";
import './App.css'
import { authClient } from "./lib/auth-client";
import { useState, type ReactNode } from "react";

function App() {

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, error } = authClient.useSession();
  const [buffering, setBuffering] = useState(true);

  setTimeout(() => {
    setBuffering(false);
  }, 500);

  if(buffering){
    return <div className='spinner'></div>
  }
  
  if(!buffering){
    if(session){
      return <>{children}</>
    }

    if(error) return <Navigate to='/login'/>

    return <Navigate to='/login'/>
  }
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='login' element={<Login />}></Route>
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
