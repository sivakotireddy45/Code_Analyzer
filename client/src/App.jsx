import React,{useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import HomePage from './HomePage';
import { inject } from '@vercel/analytics';


function App() {
  useEffect(() => {
    inject();
  }, []);
  
  return (
    <HomePage/>
  )
}

export default App
