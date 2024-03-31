import { Button, FileInput, TextInput, Select, Alert } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const [file, setFile] = React.useState(null);
  const [imageUploadError, setImageUploadError] = React.useState(null);
  const [imageUploadProgress, setImageUploadProgress] = React.useState(0);
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [publishError, setPublishError] = React.useState(null);
  const navigate = useNavigate();
  console.log(formData);
  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      setPublishError("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
      } else {
        navigate(`/post/${data.slug}`);
        setPublishError(null);
        setFormData({});
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  const handleImageChange = () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      setImageUploadLoading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error);
          setImageUploadLoading(false);
          setImageUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
            setImageUploadLoading(false);
            setImageUploadProgress(0);
          });
        }
      );
    } catch (error) {
      setImageUploadError(error);
    }
  };
  return (
    <div className="flex flex-col m-4 justify-center min-h-screen">
      <h1 className="text-3xl m-4 text-center font-semibold">Create Post</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TextInput
          label="Title"
          placeholder="Title"
          required
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
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
      <div className="flex flex-col sm:flex-row my-4 gap-4 justify-between items-center border-4 border-dotted border-cyan-950 dark:border-cyan-200 p-4  ">
        <FileInput
          accept="image/*"
          label="Upload Image"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button
          gradientDuoTone={"purpleToPink"}
          outline
          onClick={handleImageChange}
          disabled={imageUploadLoading}
        >
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
      {formData.image && (
        <img
          src={formData.image}
          alt="post"
          className="h-72 w-full object-cover mb-2 "
        />
      )}
      {imageUploadError && (
        <Alert type="error" className="w-full mb-2">
          {imageUploadError}
        </Alert>
      )}
      <ReactQuill
        theme="snow"
        placeholder="write something.... "
        className="h-72 mb-20"
        required
        onChange={(e) => setFormData({ ...formData, content: e })}
      />
      <Button
        type="submit"
        gradientDuoTone={"purpleToBlue"}
        onClick={handleSubmit}
      >
        Publish
      </Button>
      {publishError && (
        <Alert type="error" className="w-full mt-4">
          {publishError}
        </Alert>
      )}
    </div>
  );
};

export default CreatePost;
