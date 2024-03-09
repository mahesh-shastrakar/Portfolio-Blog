import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill all the fields");
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        navigate("/signin");
      }
      if (data.success === false) {
        setErrorMessage(data.message);
      }
    } catch (error) {
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
                {loading ? (
                  <>
                    <Spinner className="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <OAuth />
            </form>
            <div className=" text-center gap-2 mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="text-purple-500 underline">
                Sign In
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

export default SignUp;
