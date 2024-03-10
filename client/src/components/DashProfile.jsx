import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-full h-full rounded-full object-cover border-8 border-[lightgrey]"
          />
        </div>
        <TextInput label="Name" value={currentUser.username} disabled />
        <TextInput label="Email" value={currentUser.email} disabled />
        <TextInput type="password" label="Password" placeholder="Password" />
        <Button gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="flex justify-center gap-4 mt-4">
        <Button gradientDuoTone={"redToYellow"} className="cursor-pointer">
          Delete Account
        </Button>
        <Button outline className="cursor-pointer">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashProfile;
