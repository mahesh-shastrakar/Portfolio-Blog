import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

// OAuth component to handle Google sign in using Firebase
const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the auth instance from the app instance
  const auth = getAuth(app);

  // Function to handle the Google sign in button click event
  const handleGoogleClick = async () => {
    // Create a new GoogleAuthProvider instance
    const provider = new GoogleAuthProvider();

    // Set the custom parameters for the provider instance to prompt the user to select an account during sign in
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      dispatch(signInStart());

      // Sign in with Google using the GoogleAuthProvider instance and get the results from Google
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await fetch("/api/auth/googleOAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoURL: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="purpleToPink"
      className="w-1/2 mx-auto"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Sign In with Google
    </Button>
  );
};

export default OAuth;
