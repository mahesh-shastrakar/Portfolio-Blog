import { Button, FileInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
  return (
    <div className="flex flex-col m-4 justify-center min-h-screen">
      <h1 className="text-3xl m-4 text-center font-semibold">Create Post</h1>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-4 border-dotted border-cyan-950 dark:border-cyan-200 p-4  ">
        <FileInput accept="image/*" label="Upload Image" />
        <Button gradientDuoTone={"purpleToPink"} outline>
          Upload Image
        </Button>
      </div>
      <ReactQuill
        theme="snow"
        placeholder="write something.... "
        className="h-72 mb-12"
        required
      />
      <Button type="submit" gradientDuoTone={"purpleToBlue"}>
        Publish
      </Button>
    </div>
  );
};

export default CreatePost;
