import { Route, Routes } from 'react-router-dom';
import './App.css';
import DashBoard from './Components/DashBoard';
import Login from './Components/Login';
import Signup from './Components/Signup';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={
          <DashBoard/> 
        }/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/Signup' element={<Signup/>}/>
       </Routes>
    </div>
  );
}

export default App;
