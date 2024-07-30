// Import necessary modules from libraries and hooks
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

// signUp component to display the sign up page with sign up form
const SignUp = () => {
  // useState hook to store the form data and error message state variables and set the default values
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // useState hook to store the loading state variable and set the default value to false
  const [loading, setLoading] = useState(false);

  // useNavigate hook to navigate to the specific URL path
  const navigate = useNavigate();

  // handleChange function to update the form data when the input fields are changed
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // handleSubmit function to handle the form submission when the sign up button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill all the fields");
    }
    try {
      // Set loading to true and error message to empty string
      setLoading(true);
      setErrorMessage("");

      // Post the form data to the server using async function fetch to register user and set the response data to the data state variable
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // parse the response data to json
      const data = await response.json();
      setLoading(false);

      // if user successfully registered then navigate to the sign in page
      if (response.ok) {
        navigate("/signin");
      }
      if (data.success === false) {
        setErrorMessage(data.message);
      }
    } catch (error) {
      // if error occurs then set the error message and loading to false
      setErrorMessage(error.message);
      setLoading(false);
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
          <p className=" text-sm mt-5 ">This is text something</p>
        </div>
        {/*Right*/}
        <div className="flex-1">
          <div>
            <form className=" flex flex-col gap-5 ">
              <div>
                <Label value="Your Username"></Label>
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={handleChange}
                />
              </div>
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
                {/* // If loading is true then display the spinner with the text "Loading..." else display the text "Sign Up" */}
                {loading ? (
                  <>
                    <Spinner className="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              {/* // Display the OAuth component to sign up with Google */}
              <OAuth />
            </form>
            <div className=" text-center gap-2 mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="text-purple-500 underline">
                Sign In
              </Link>
            </div>
          </div>

          {/* // If there is an error message then display the Alert component with the error message in red color */}
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

export default SignUp;
