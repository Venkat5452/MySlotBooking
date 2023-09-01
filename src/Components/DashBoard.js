import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {useState} from 'react';
import './DashBoard.css'
import axios from 'axios';
import { BASE_URL } from './helper';
function DashBoard() {
//   const availableTimeSlots = [
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "12:00 PM",
//     "12:30 PM",
//     "1:00 PM",
//     "1:30 PM",
//     "2:00 PM",
//     "2:30 PM",
//     "3:00 PM",
//     "3:30 PM",
//     "4:00 PM"
// ];
  const [name,setname]=useState("");
  const [availableTimeSlots,setavailableTimeSlots]=useState([
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM"
  ])
  const [predate,setpredate]=useState("");
  const [maxdate,setmaxdate]=useState("");
  const [mydata,setmydata]=useState([]);
  const [email,setemail]=useState("");
  const [dateflag,setdateflag]=useState(false);
  const [sday,setsday]=useState("");
  const [sslottime,setslottime]=useState("");
  const [mybookingflag,setmybookingflag]=useState(false);
  const [isdata,setisdata]=useState(false);
  const [findday,setfindday]=useState([]);
  // const [sslot,setsslot]=useState({
  //   day:"",
  //   slots:""
  // });/
  const [getuser,setgetuser]=useState({
    email:""
  });
  const [usersslot,setusersslot]=useState({
    name:"",
    email:"",
    day:"",
    slottime:""
  });
  const navigate=useNavigate();

  function confirmday() {
    //axios.get("http://localhost:9002/getday/" + sday).then(res=>(setfindday(res.data)));
    if(mydata.length!==0) {
      alert("Slot already Booked By you");
    }
    else if(!sday) {
        alert("Please Select a Day");
      }
      else {
        console.log(findday);
        console.log(sday);
        axios.get( BASE_URL +"/getday/" + sday).then((res)=>{
         setfindday(res.data);
        });
         setdateflag(true);
        console.log(findday);
        if(dateflag===true) {
          console.log(findday);
        }
      }
  }
  function bookslot(){
    if(sslottime) {
       usersslot.name=name;
       usersslot.email=email;
       usersslot.day=sday;
       usersslot.slottime=sslottime;
       axios.post(BASE_URL +"/makeslot",usersslot).then(res => {alert(res.data.message)});
       //axios.post("http://localhost:9002/makeday",sslot).then(res => {alert(res.data.message)});
       console.log(dateflag);
       setdateflag(false);
       console.log(findday);
       setsday("");
       setslottime("");
       setmybookingflag(false);
    }
    else {
      alert("Please select Valid Slot");
    }
  }
  function goback() {
    window.location.reload();
     setdateflag(false);
     setsday("");
     setslottime("");
     setmybookingflag(false);
  }
  function seebooking() {
    getuser.email=email;
    setmybookingflag(true);
    console.log(getuser);
    console.log(mydata);
    if(mydata.length===1) {
      setisdata(true);
    }
    // axios.get("http://localhost:9002/getmyslot/" + email).then(res =>(setmydata(res.data)));
  }
  // function filldata() {
  //   console.log(mydata.length);
  //   console.log(mydata);
  //   if(mydata.email===0) {
  //     setisdata(false);
  //   }
  // }
  function closebooking() {
    setmybookingflag(false);
  }
  function deleteslot() {
    axios.delete(BASE_URL +"/deletemyslot/" + email);
    setisdata(false);
    
  }
  useEffect(()=>{
    function f() {
      if(!localStorage.getItem('token')) {
          navigate("/login");  
      }
      else {
        // console.log(getuser);
        //console.log(predate);
        const date = new Date();
        let day = date.getDate() + 1;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if(month.length!==2) {
           month="0"+month;
        }
        setpredate(`${year}-${month}-${day}`);
        setmaxdate(`${year + 1}-${month}-${day}`)
        //console.log(predate);
        axios.get(BASE_URL +"/getmyslot/" + email).then(res =>(setmydata(res.data)));
        if(sday!=="") {
            //console.log(sday);
            axios.get(BASE_URL +"/getday/" + sday).then((res)=>{
            setfindday(res.data);
            //console.log(res.data);
            setavailableTimeSlots(availableTimeSlots.filter(f=>!findday.includes(f)));
            //console.log(availableTimeSlots);
          })
        }
        setname(localStorage.getItem('token'));
        setemail(localStorage.getItem('token1'));
        //setavailableTimeSlots([...Set(availableTimeSlots,findday)]);
      }
    }
      f();
  },);
  const handlelogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('token1');
    navigate('/');
  }
  
  // (function (){ 
  //   if(email!=="" && mydata!==[])axios.get("http://localhost:9002/getmyslot/" + email).then(res =>setmydata(res.data));
  // })();
  const arrayDataItems = mydata.map(data => 
    <p key={data._id}>
      <h6 class="text-warning">Day :{data.day.substring(0,10)}(YYYY-MM-DD)</h6>
      <h5> slot : {data.slottime}</h5>
    </p>
   )
  return (
    <>
   <div class="pp p-5">
    <div>
    <h1>Book Your Appointment</h1>
    <br></br>
    <h1 class="text-success">{name}</h1>
    </div>
    <div className='pp p-5'>
       <div className='text-success'>
      <div class="container-fluid border border-dark rounded p-4"> 
        {!dateflag && <div class="form p-3">
          <label for="day"><h3>Appointment Day</h3></label>
          <input id="day" class="form-control" type="date" min={predate} max={maxdate} onChange={(e) => (setsday(e.target.value))}/>
          {/* <label for="slot">Slot-Timing</label>
          <input id="slot" class="form-control" type="time" /> */}
          <div class='p-2'><Button variant='primary' onClick={confirmday}>Confirm Day</Button></div>
        </div>}
        {dateflag && <div>
          <h3 class="text-primary">Available Slots on</h3>
          <h3>({sday})</h3>
        <div class="form-group p-5 ">
           <label class="myDropDown" for="exampleFormControlSelect1" className='p-2'><h5>Slot</h5></label>
            <select onChange={(e) => (setslottime(e.target.value))}>
            <option selected value="">Select</option>
             {availableTimeSlots.map(fbb =><option class="bg-success" key={fbb.key} value={fbb}>{fbb}</option>)};
             </select>
        </div>
        <div class="flex-row"><div className='p-2'><Button variant='primary' onClick={bookslot}>Confirm Slot</Button></div>
        <div className='p-2'><Button variant='primary' onClick={goback} >Back</Button></div></div>
        </div>}
        {!dateflag&&!mybookingflag && (<Button variant='primary' onClick={seebooking}>See my booking</Button>)}
        {!dateflag&&mybookingflag && (<Button variant='primary' onClick={closebooking} >Close</Button>)}
        {isdata && !dateflag&&mybookingflag && <div class="p-2">
          <ul className='bg-dark p-2'>{arrayDataItems}</ul>
          <Button variant='danger' onClick={deleteslot}>Cancel Appointment</Button>
          </div>}
        {!isdata && !dateflag&&mybookingflag && <div class="p-2">
          <ul className='bg-dark p-2'>No slot Found</ul>
          </div>}
       </div>
    <br></br>
      <Button draggable = "true" variant='primary' onClick={handlelogout}>Log out</Button> </div>
    </div>
    </div>  
    </>

  )
}

export default DashBoard;