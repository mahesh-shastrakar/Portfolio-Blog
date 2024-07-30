// Desc: Update post page

// Import necessary dependencies
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

// Create a functional component UpdatePost
export default function UpdatePost() {
  // useState hook to store the file, imageUploadProgress, imageUploadError, formData, and publishError state variables and set the default values
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  // useParams hook to get the postId from the URL
  const { postId } = useParams();

  // useNavigate hook to navigate to the specific URL path
  const navigate = useNavigate();

  // useSelector hook to get the currentUser state variable from the user slice of the redux store
  const { currentUser } = useSelector((state) => state.user);

  // useEffect hook to fetch the post data from the server using async function fetch and set the formData state variable
  useEffect(() => {
    try {
      // async function fetchPost to get the post data from the server using the postId and set the formData state variable
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        // If response is not OK then set the publishError state variable with the message
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }

        // If response is OK then set the publishError state variable to null and set the formData state variable with the post data
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      // Call the fetchPost function
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  // handleUpdloadImage function to upload the image to the firebase storage and set the image URL to the formData state variable
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      // Get the firebase storage and upload the image to the storage and set the image URL to the formData state variable
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Set the image upload progress and error state variables
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get the image upload progress and set the imageUploadProgress state variable
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          // Get the download URL of the image and set the image URL to the formData state variable
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      // If there is an error then set the imageUploadError state variable with the message
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  //  handleSubmit function to update the post data on the server using async function fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // async function fetch to update the post data on the server using the formData and currentUser and navigate to the post page
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      // If response is not OK then set the publishError state variable with the message
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      // If response is OK then set the publishError state variable to null and navigate to the post page
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          {/* // TextInput component to display the title input field with the placeholder "Title" and required attribute */}
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />

          {/* // Select component to display the category select field with the options "JavaScript", "React.js", and "Next.js" */}
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* // FileInput component to display the file input field with the accept attribute "image/*" and onChange event handler to set the file state variable */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {/* // If imageUploadProgress is true then display the CircularProgressbar with the value of imageUploadProgress else display the text "Upload Image" */}
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {/* // If imageUploadError is true then display the Alert component with the color "failure" and the message of imageUploadError */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* // If formData.image is true then display the image with the source of formData.image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {/* // ReactQuill component to display the content input field with the placeholder "Write something..." and required attribute */}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update post
        </Button>

        {/* // If publishError is true then display the Alert component with the color "failure" and the message of publishError */}
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
