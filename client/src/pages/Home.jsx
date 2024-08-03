// Importing Required Libraries
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// Importing Components
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

// Home Component
export default function Home() {
  // State Variables to store posts data
  const [posts, setPosts] = useState({});

  // Fetching Posts Data from the server using useEffect
  useEffect(() => {
    try {
      // Fetching Posts Data from the server using async function fetchPosts
      const fetchPosts = async () => {
        const res = await fetch("/api/post/getPosts");

        // Parsing the response data to JSON
        const data = await res.json();

        // If response is OK then set the posts data to the state variable posts
        if (res.ok) {
          // console.log(data.posts);
          setPosts(data.posts);
        }
      };

      // Calling the fetchPosts function to fetch posts data
      fetchPosts();
    } catch (error) {
      // If any error occurs then log the error to the console
      console.error(error);
    }
  }, []);

  // Returning the JSX of Home Component
  return (
    <div>
      {/* // Hero Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Hi I'm Mahesh Shastrakar
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm ">
          I am a passionate software engineer with a strong background in web
          development and software engineering.
        </p>
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>

        {/* // Call to Action Component to navigate to Search Page */}
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      {/* // Call to Action Component to navigate to Github Profile */}
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      {/* // Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {/* // If posts data is available then display the posts data */}
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {/* // Mapping through the posts data and displaying the PostCard */}
              {/* Component */}
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* // Link to navigate to Search Page */}
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
