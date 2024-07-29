import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all the fields"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className=" min-h-screen mt-20 ">
      <div className=" flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center ">
        {/*Left*/}
        <div className=" flex-1">
          <Link to="/" className="text-4xl  font-bold dark:text-white ">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 rounded-lg text-white ">
              Mahesh Shastrakar
            </span>
          </Link>
          <p className=" text-sm mt-5 ">I'm a web developer</p>
        </div>
        {/*Right*/}
        <div className="flex-1">
          <div>
            <form className=" flex flex-col gap-5 ">
              <div>
                <Label value="Your Email"></Label>
                <TextInput
                  type="email"
                  placeholder="abc@xyz.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password"></Label>
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                gradientDuoTone="purpleToPink"
                className="w-1/2 mx-auto"
                type="submit"
                outline
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Spinner className="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </form>
            <div className=" text-center gap-2 mt-5">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-500 underline">
                Sign Up
              </Link>
            </div>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
