import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {

  const [credentials, setCredentials] = useState({name: "", email: "", password: "", c_password: "" })
    //For redirect
    let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password, c_password} = credentials
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    if(password === c_password){
      
    const json = await response.json()
    console.log(json);
    if (json.success) {
      //save the auth token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/Login")
      props.showAlert("Account Created Successfully", "success")
    }
    else {
      props.showAlert("Please try again", "danger")
    }
    setCredentials({name:"", email: "", password: "", c_password: "" })
  }
  else{
    props.showAlert("Password not match", "danger")
  }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" value={credentials.name} minLength={3} required onChange={onChange} id="name" name="name" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" value={credentials.email} required onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" value={credentials.password} minLength={5} required onChange={onChange} name="password" id="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="c_password" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" value={credentials.c_password} minLength={5} required onChange={onChange} name="c_password" id="c_password" />
        </div>
        <button type="submit" className="btn btn-primary" >Sign Up</button>
      </form>

    </div>
  )
}

export default Signup