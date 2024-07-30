// the comment section component is used to display comments for a post and allow users to add, edit, and delete comments
import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

// import the Comment component
import Comment from "./Comment";

// the CommentSection component is created as a functional component
export default function CommentSection({ postId }) {
  // useState hook to store the comment, commentError, comments, showModal, and commentToDelete state variables and set the default values
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // useSelector hook to get the currentUser from the state
  const { currentUser } = useSelector((state) => state.user);

  // useNavigate hook to navigate to a different page
  const navigate = useNavigate();

  // handleSubmit function to handle the form submission and add a new comment using async function fetch
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if the comment length is greater than 200, return
    if (comment.length > 200) {
      return;
    }
    try {
      // adding a new comment using the content, postId, and userId
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      // if the response is ok, set the comment state variable, commentError state variable to null, and add the new comment to the comments array
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  // useEffect hook to fetch the comments for the post using async function fetch and set the comments state variable
  useEffect(() => {
    const getComments = async () => {
      try {
        // fetching the comments for the post using the postId
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // call the getComments function
    getComments();
  }, [postId]);

  // handleLike function to like a comment using async function fetch and update the comments state variable
  const handleLike = async (commentId) => {
    try {
      // if the currentUser is not available, navigate to the sign-in page
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      // liking a comment using the commentId and updating the comments state variable
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        // updating the comments state variable with the updated comment data including the likes and numberOfLikes
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // handleEdit function to edit a comment using async function fetch and update the comments state variable
  const handleEdit = async (comment, editedContent) => {
    // updating the comments state variable with the edited comment content
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  // handleDelete function to delete a comment using async function fetch and update the comments state variable
  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      // if the currentUser is not available, navigate to the sign-in page
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      // deleting a comment using the commentId and updating the comments state variable by filtering out the deleted comment
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      // if the response is ok, filter out the deleted comment from the comments state variable
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {/* // if the currentUser is available, display the user profile picture and username */}
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}

      {/* // if the currentUser is available, display the form to add a new comment using the handleSubmit function */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {/* // if the comments array length is 0, display a message that there are no comments yet or else display the comments */}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      {/* // Modal component to confirm the deletion of a comment using the handleDelete function and the commentToDelete state variable */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
