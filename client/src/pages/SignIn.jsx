// Desc: SignIn page component to display the sign in form with email and password fields and sign in button

// Import necessary dependencies
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import axios from "axios";

//Create a functional component SignIn
const SignIn = () => {
  // Create state variables formData to store the form data and setFormData to update the form data
  const [formData, setFormData] = useState({});

  // useSelector hook to get the loading and error state variables from the user slice of the redux store
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // useDispatch hook to dispatch the signInStart, signInSuccess, and signInFailure actions from the user slice of the redux store
  const dispatch = useDispatch();

  // useNavigate hook to navigate to the specific URL path
  const navigate = useNavigate();

  // handleChange function to update the form data when the input fields are changed
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // handleSubmit function to handle the form submission when the sign in button is clicked
  const handleSubmit = async (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // If email or password is not present in the form data then dispatch the signInFailure action with the message "Please fill all the fields"
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      // Dispatch the signInStart action
      dispatch(signInStart());

      // Post the form data to the server using async function fetch to sign in the user

      const res = axios
        .post("/api/auth/signin", formData)
        .then((res) => {
          dispatch(signInSuccess(res.data));
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          dispatch(signInFailure(error.message));
        });
      // const res = await fetch("/api/auth/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // If response is not OK then dispatch the signInFailure action with the message "Invalid email or password"
      // const data = await res.json();
      // if (data.success === false) {
      //   dispatch(signInFailure(data.message));
      // }

      // If response is OK then dispatch the signInSuccess action with the data and navigate to the home page
      // if (res.ok) {
      //   dispatch(signInSuccess(data));
      //   navigate("/");
      // }
    } catch (error) {
      // If there is an error then dispatch the signInFailure action with the error message
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {/* // If loading is true then display the spinner with the text "Loading..." else display the text "Sign In" */}
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            {/* // Display the OAuth component to sign in with Google */}
            <OAuth />
          </form>
          {/* // Link to the sign up page */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {/* // If there is an error message then display the Alert component with the error message in red color */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
