import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteStart,
  deleteFailure,
  deleteSuccess,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import { Link } from "react-router-dom";
const DashProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState("");
  const [updateUserError, setUpdateUserError] = useState("");
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState("");
  const filePickerRef = React.useRef();
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImageFileUrl(objectUrl);
      uploadImage();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
        setDeleteUserError(data.message);
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
      setDeleteUserError(error.message);
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      if (!res.ok) {
        console.log("Could not sign out");
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full h-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className=" relative w-32 h-32 self-center cursor-pointer object-cover border shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress} %`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(245, 239, 145, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt={currentUser.username}
            className={`rounded-full w-full h-full object-cover border-8 border-[#e4e4e4]`}
          />
        </div>
        {imageFileUploadError && (
          <Alert type="error" color={"failure"}>
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          label="username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          label="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          label="Password"
          placeholder="Password"
          onChange={handleChange}
        />
        {updateUserSuccess && (
          <Alert type="success" color={"success"}>
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert type="error" color={"failure"}>
            {updateUserError}
          </Alert>
        )}
        {deleteUserError && (
          <Alert type="error" color={"failure"}>
            {deleteUserError}
          </Alert>
        )}

        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className=" w-14 h-14 text-red-400 dark:text-red-200 mb-4 mx-auto " />
                <h2 className="mb-5 text-lg text-red-400 dark:text-red-200 ">
                  Are you sure you want to delete your account?
                </h2>
                <div className="flex justify-center gap-4 ">
                  <Button color="failure" onClick={handleDeleteUser}>
                    Yes I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal.Header>
        </Modal>
        <Button
          gradientDuoTone={"purpleToBlue"}
          type="submit"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading || imageFileUploading ? "Loading.." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              className="w-full mx-auto"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          gradientDuoTone={"redToYellow"}
          className="cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </Button>
        <Button outline className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashProfile;
