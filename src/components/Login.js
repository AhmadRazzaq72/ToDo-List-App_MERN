import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    //For redirect
    let navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });

        const json = await response.json()
        console.log(json);
        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.authToken)
            navigate("/");
        }
        else {
            props.showAlert("Invalid Credential", "danger")
        }
        setCredentials({ email: "", password: "" })

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} required onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} required onChange={onChange} name="password" id="password" />
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login