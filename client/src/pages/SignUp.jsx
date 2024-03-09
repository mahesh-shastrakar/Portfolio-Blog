import { TextInput, Label, Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
const SignUp = () => {
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
                <TextInput type="text" placeholder="Username" id="username" />
              </div>
              <div>
                <Label value="Your Email"></Label>
                <TextInput type="text" placeholder="Email" id="email" />
              </div>
              <div>
                <Label value="Your Password"></Label>
                <TextInput type="text" placeholder="Password" id="password" />
              </div>
              <Button
                gradientDuoTone="purpleToPink"
                className="w-1/2 mx-auto"
                type="submit"
                outline
              >
                Sign Up
              </Button>
            </form>
            <div className=" text-center gap-2 mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="text-purple-500 underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
