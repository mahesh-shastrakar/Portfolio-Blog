// Import necessary modules

// moment is a library that helps to parse, validate, manipulate, and display dates and times in JavaScript.
import moment from "moment";

// imported the necessary modules and components
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { set } from "mongoose";

// the comment component is created as a functional component
export default function Comment({ comment, onLike, onEdit, onDelete }) {
  // useState hook to store the user, isEditing, and editedContent state variables and set the default values
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  // useEffect hook to fetch the user data from the server using async function fetch and set the user state variable
  useEffect(() => {
    const getUser = async () => {
      try {
        // fetching the user data from the server using the userId
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        // if the response is ok, set the user state variable
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // call the getUser function
    getUser();
  }, [comment]);

  // handleEdit function to set the isEditing state variable to true
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  // handleSave function to update the comment content using async function fetch and set the isEditing state variable to false
  const handleSave = async () => {
    try {
      // updating the comment content using the comment id and editedContent
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      // if the response is ok, set the isEditing state variable to false
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // return the JSX of the comment component
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          {/* // display the username and the time of the comment using the user and comment data */}
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {/* // if the user is editing the comment, display the textarea to edit the comment content and the save and cancel buttons */}
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>

              {/* // display the number of likes and the edit and delete buttons if the current user is the author of the comment or an admin */}
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>

              {/* // if the current user is the author of the comment or an admin, display the edit and delete buttons */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
