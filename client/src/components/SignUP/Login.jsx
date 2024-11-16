import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

// Login Component
const Login = () => {
  const { setAuthInfo, persist, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        '/login',
        JSON.stringify({ identity: email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response);
      const email1 = response?.data?.email;
      const accessToken = response?.data?.accessToken;

      setAuthInfo({ accessToken }, email1);
      setEmail('');
      setPwd('');
      navigate('/');
    } catch (err) {
        console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
      {errMsg && (
        <p className="flex justify-center items-center text-red-500 font-semibold">
          <b>{errMsg} !!!</b>
        </p>
      )}
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome Back</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor='Email'>Email</label>
            <input
              type="email"
              id='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              autoComplete='off'
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor='password'>Password :</label>
            <input
              type="password"
              id='password'
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type='submit'
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
              className="h-4 w-4 border-blue-500 accent-blue-500"
            />
            <label htmlFor="persist" className="text-sm text-[#4A2C2A] font-semibold ml-2">
              Remember me
            </label>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? 
          <span className="text-blue-500 hover:text-blue-600 cursor-pointer ml-1">
          <Link to="/register">Register Here</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login