// Import necessary libraries and hooks
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { Button, FileInput, TextInput, Select, Alert } from "flowbite-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

// CreatePost Component to create a new post
const CreatePost = () => {
  // State Variables to store file, imageUploadError, imageUploadProgress, imageUploadLoading, formData, and publishError
  const [file, setFile] = React.useState(null);
  const [imageUploadError, setImageUploadError] = React.useState(null);
  const [imageUploadProgress, setImageUploadProgress] = React.useState(0);
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [publishError, setPublishError] = React.useState(null);

  // useNavigate hook to navigate to a different page
  const navigate = useNavigate();

  // console.log(formData);

  // Function to handle form submit event
  const handleSubmit = async () => {
    // If title or content is empty then set publishError to "Please fill in all fields"
    if (!formData.title || !formData.content) {
      setPublishError("Please fill in all fields");
      return;
    }

    try {
      // Fetching the data from the server using async function fetch
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Parsing the response data to JSON
      const data = await res.json();

      // If response is not OK then set publishError to the error message
      if (!res.ok) {
        // console.log(data);
        setPublishError(data.message);
      } else {
        // If response is OK then navigate to the post page and set publishError to null and formData to empty object
        navigate(`/post/${data.slug}`);
        setPublishError(null);
        setFormData({});
      }
    } catch (error) {
      // console.log(error);
      // If any error occurs then set publishError to the error message
      setPublishError(error.message);
    }
  };

  // Function to handle image change event
  const handleImageChange = () => {
    // If file is empty then set imageUploadError to "Please select an image"
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    try {
      // Uploading the image to the firebase storage

      // Get the storage from the firebase app
      const storage = getStorage(app);

      // Create a new file name with the current timestamp and the file name
      const fileName = new Date().getTime() + "-" + file.name;

      // Create a reference to the storage with the file name
      const storageRef = ref(storage, fileName);

      // Upload the file to the storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Set imageUploadLoading to true
      setImageUploadLoading(true);

      // Add event listener to the uploadTask to track the progress of the upload task and get the download URL of the image after the upload is completed
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate the progress of the upload task
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // Set the imageUploadProgress to the progress
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          // If any error occurs then set imageUploadError to the error message and set imageUploadLoading to false and set imageUploadProgress to 0
          setImageUploadError(error);
          setImageUploadLoading(false);
          setImageUploadProgress(0);
        },
        () => {
          // If the upload is completed then get the download URL of the image and set the image URL to the formData and set imageUploadLoading to false and set imageUploadProgress to 0
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
            setImageUploadLoading(false);
            setImageUploadProgress(0);
          });
        }
      );
    } catch (error) {
      // If any error occurs then set imageUploadError to the error message
      setImageUploadError(error);
    }
  };
  // Return the JSX of CreatePost Component
  return (
    <div className="flex flex-col m-4 justify-center min-h-screen">
      <h1 className="text-3xl m-4 text-center font-semibold">Create Post</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* // text input for title  */}
        <TextInput
          label="Title"
          placeholder="Title"
          required
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* // Select input for category   */}
        <Select
          label="Category"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.selectedOptions[0].value,
            })
          }
        >
          <option type="uncategorized" value="uncategorized">
            Select a category
          </option>
          <option value="react">React</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="mongo">Mongo</option>
        </Select>
      </div>

      {/* // File input for image upload */}
      <div className="flex flex-col sm:flex-row my-4 gap-4 justify-between items-center border-4 border-dotted border-cyan-950 dark:border-cyan-200 p-4  ">
        <FileInput
          accept="image/*"
          label="Upload Image"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* // Button to upload image */}
        <Button
          gradientDuoTone={"purpleToPink"}
          outline
          onClick={handleImageChange}
          disabled={imageUploadLoading}
        >
          {/* // If imageUploadLoading is true then show CircularProgressbar else show "Upload Image" text */}
          {imageUploadLoading ? (
            <div className="w-8 h-8">
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress}%`}
              />
            </div>
          ) : (
            "Upload Image"
          )}
        </Button>
      </div>

      {/* // If formData.image is not empty then show the image with the image URL and if imageUploadError is not empty then show the error message */}
      {formData.image && (
        <img
          src={formData.image}
          alt="post"
          className="h-72 w-full object-cover mb-2 "
        />
      )}

      {/* // If imageUploadError is not empty then show the error message in Alert component  */}
      {imageUploadError && (
        <Alert type="error" className="w-full mb-2">
          {imageUploadError}
        </Alert>
      )}

      {/* // ReactQuill component for content input with placeholder "write something.... " and onChange event to set the content in the formData  */}
      <ReactQuill
        theme="snow"
        placeholder="write something.... "
        className="h-72 mb-20"
        required
        onChange={(e) => setFormData({ ...formData, content: e })}
      />

      {/* // Button to submit the form with gradientDuoTone purpleToBlue and onClick event to call handleSubmit function  */}
      <Button
        type="submit"
        gradientDuoTone={"purpleToBlue"}
        onClick={handleSubmit}
      >
        Publish
      </Button>

      {/* // If publishError is not empty then show the error message in Alert component */}
      {publishError && (
        <Alert type="error" className="w-full mt-4">
          {publishError}
        </Alert>
      )}
    </div>
  );
};

export default CreatePost;
