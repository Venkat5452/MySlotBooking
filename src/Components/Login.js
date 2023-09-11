import React, { useState } from "react";
import { Link} from "react-router-dom";
import { Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import './Login.css';
import axios from "axios";
import { BASE_URL } from "./helper";
const Login=( )=> {
  localStorage.removeItem('token');
  localStorage.removeItem('token1');
  const navigate=useNavigate();
  const [d,sd]=useState("1");
  const [user,SetUser]=useState({
      password:"",
      email:""

  });
  
  const handleSubmit = async (e) => {
    e.preventDefault()
      const {name,value}=e.target
      SetUser ({
          ...user,
          [name]:value
      })
    };
    const login1=async(e)=>{
      e.preventDefault();
      const {email,password}=user
      if(email && password ) {
        sd("");
         axios.post( BASE_URL + "/login",user)
         .then(res => {
          alert(res.data.message)
          sd(res.data.message);
          localStorage.setItem('token',res.data.user.name);
          localStorage.setItem('token1',res.data.user.email);
          navigate("/");
        })
      }
      else {
        alert("Invalid Input");
      }
    }
     return (
      <>
      <div className="pp">
        <div className="p-4 box">
          <h2 className="mb-2">Please Login here</h2>
          {d==="" && (<h6 className="text-success">Verifying user....</h6>)}
          <Form onSubmit={login1}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                placeholder="Email address"
                onChange={handleSubmit}
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                name="password"
                value={user.password}
                placeholder="Password"
                onChange={handleSubmit}
              />
            </Form.Group>
  
            <div className="d-grid gap-2">
              <Button variant="primary" type="Submit">
                Log In
              </Button>
            </div>
          </Form>
            <div className="p-3 box text-center mt-3">
              Don't have an account? <Link to="/Signup">Sign up</Link>
            </div> 
        </div>
      </div>  
      </>
    )
}

export default Login;