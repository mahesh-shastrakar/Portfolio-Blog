import { Button, FileInput, TextInput, Select } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
  return (
    <div className="flex flex-col m-4 justify-center min-h-screen">
      <h1 className="text-3xl m-4 text-center font-semibold">Create Post</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TextInput
          label="Title"
          placeholder="Title"
          required
          className="flex-1"
        />
        <Select label="Category" required>
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
        <FileInput accept="image/*" label="Upload Image" />
        <Button gradientDuoTone={"purpleToPink"} outline>
          Upload Image
        </Button>
      </div>
      <ReactQuill
        theme="snow"
        placeholder="write something.... "
        className="h-72 mb-20"
        required
      />
      <Button type="submit" gradientDuoTone={"purpleToBlue"}>
        Publish
      </Button>
    </div>
  );
};

export default CreatePost;
