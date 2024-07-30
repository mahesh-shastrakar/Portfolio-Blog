// Importing Spinner, Button, and Link components from Flowbite and React Router Dom
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Importing CallToAction, CommentSection, and PostCard components
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

// PostPage Component to display the post page with the post content
export default function PostPage() {
  // useParams hook to get the postSlug from the URL params
  const { postSlug } = useParams();

  // State variables to store loading, error, post, and recentPosts data and set the default values
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  // useEffect hook to fetch the post data from the server using async function fetch and set the post data to the post state variable
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        // If response is not OK then set error to true and loading to false
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        // If response is OK then set the post data to the post state variable and set loading to false and error to false
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    // Call the fetchPost function
    fetchPost();
  }, [postSlug]);

  // useEffect hook to fetch the recent posts data from the server using async function fetch and set the recent posts data to the recentPosts state variable
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        // Fetching the data from the server using async function fetch with limit of 3 posts
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();

        // If response is OK then set the recent posts data to the recentPosts state variable
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };

      // Call the fetchRecentPosts function
      fetchRecentPosts();
    } catch (error) {
      // If any error occurs then log the error message
      console.error(error.message);
    }
  }, []);

  // If loading is true then display the Spinner component with size xl else display the post content
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  // If error is true then display the error message

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* // show the post title if post is available */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>

      {/* // show the post category if post is available */}
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      {/* // show the post image if post is available */}
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      {/* // show the post author and date if post is available  */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* // show the post content if post is available with dangerouslySetInnerHTML to render the HTML content from the server */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* // CallToAction component to display the call to action section to redirect to github profile */}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* // CommentSection component to display the comments section with the postId */}
      <CommentSection postId={post._id} />

      {/* // If recentPosts is available then display the recent articles section with PostCard component for each post */}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
