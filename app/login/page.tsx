"use client"
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { setCookie } from '@/utils/cookies';
import { axiosInstance } from '@/utils/instance';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react'

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [value, setValue] = useState<LoginFormValues>({
    email: "", password: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value: newValue } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: newValue
    }));
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postBody = {
      email: value.email,
      password: value.password
    }
    axiosInstance.createPost('/auth/login', postBody)
      .then((response) => {
        setCookie('jwt', response.users.users.authToken[0].token, 7);
        if (response) {
          router.push("/")
        }
        else {
          alert("Something went wrong!!")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <form className='space-y-7' onSubmit={handleLogin}>
        <h2 className='heading text-center'>Welcome back</h2>
        <div className='flex-col flex justify-center items-center space-y-5 w-80 mx-auto'>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            className="auth-input"
            value={value.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            className="auth-input"
            value={value.password}
            onChange={handleChange}
          />
          <button className='auth-button'>Login</button>
        </div>
        <h2 className='auth-info-text'>
          Dont have an account?
          <Link href="/signup" className="auth-info-link">
            Sign Up
          </Link>
        </h2>
       
        {/* <div className="text-gray-400 text-center font-semibold text-xs">_____________or_____________</div>  */}

        {/* <div>
          <GoogleSignInButton />
        </div> */}

      </form>
    </div>
  )
}

export default Login
