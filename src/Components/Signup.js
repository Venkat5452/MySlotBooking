import React, { useState } from "react";
import { Link,} from "react-router-dom";
import { Form} from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./helper";
function Signup() {
  localStorage.removeItem('token');
  localStorage.removeItem('token1');
  const navigate=useNavigate();
    const [user,SetUser]=useState({
        name:"",
        email:"",
        password:"",
        otp:""
    });
    const [flag,setflag]=useState(true);
    const [flag1,setflag1]=useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault()
        const {name,value}=e.target
        SetUser ({
            ...user,
            [name]:value
        })
      };

      const signup2 =async (e) => {
        e.preventDefault();
          const {name,email,password,otp}=user
          if(name && email && password && password.length>=6 && otp.length===6) {
             axios.post( BASE_URL + "/signup",user)
             .then(res => {
              if(res.data.message==="SuccessFully Registered") {
                alert(res.data.message);
                localStorage.setItem('token',name);
                localStorage.setItem('token1',email);
              }
              else if(res.data==="Invalid OTP") {
                alert(res.data);
                navigate("/")
              }
              navigate("/");
            })
          }
          else {
            alert("Invalid Input");
            navigate("/")
          }
      }
      const signup1 = async(e)=>{
        e.preventDefault(e);
        const {email,name,password}=user;
        if(name && email && password && password.length>=6) {
            setflag1(true);
            axios.post(BASE_URL + "/makemail",user).then(res=>{
              alert(res.data);
              if(res.data==="OTP SENT Succesfully"){
                setflag(false)
                setflag1(false);
              }
            });
        }
        else {
            alert("Invalid Input");
        }
      }

      function cancel(){
        window.location.reload();
      }
  return (
    <>
      <div className="pp">
       <div className="p-4 box"> { flag && <div>
          <h2 className="mb-3">You can Signup here..</h2>
          {flag1 && <h5 className="text-success">Sending OTP...</h5>}
          <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                type="text"
                name="name"
                value={user.name}
                placeholder="Name"
                onChange={handleSubmit}
              />
            </Form.Group>
  
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
                placeholder="Password"
                name="password"
                value={user.password}
                minLength={'6'}
                onChange={handleSubmit}
              />
            </Form.Group>
  
            <div className="d-grid gap-2">
              <Button variant="primary" type="Submit" onClick={signup1}>
                Send OTP
              </Button>
            </div>
          </Form> </div>}
          {!flag && <div>
            <h2 className="mb-3">Verify Your OTP Sent to</h2>
            <h6>{user.email}</h6>
             <Form onSubmit={signup2}>
             <Form.Group className="mb-3" controlId="formBasicOTP">
              <Form.Control
                type="password"
                placeholder="Enter OTP"
                name="otp"
                value={user.otp}
                minLength={'6'}
                onChange={handleSubmit}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="Submit" onClick={signup2}>
                Verify OTP
              </Button>
            </div>
             </Form>
             <div className="p-3"><Button variant="primary" type="Submit" onClick={cancel}>
                Cancel
              </Button></div>
          </div>}
            <div className="p-3 box text-center mt-3">
              Move To Login page.. <Link to="/login">Login</Link>
            </div> 
        </div>
      </div>  
      </>
  )
}

export default Signup;