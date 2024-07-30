// Importing necessary modules from libraries and hooks
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Importing PostCard component
import PostCard from "../components/PostCard";

// Search Component to display the search page with search filters and search results
export default function Search() {
  // useState hook to store the sidebarData, posts, loading, and showMore state variables and set the default values
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // console.log(sidebarData);

  // useLocation hook to get the current location of the page
  const location = useLocation();

  // useNavigate hook to navigate to the specific URL path
  const navigate = useNavigate();

  // useEffect hook to fetch the posts data from the server using async function fetch and set the posts data to the posts state variable
  useEffect(() => {
    // Get the search term, sort, and category from the URL params using URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    // If search term, sort, and category are present in the URL then set the sidebarData to the search term, sort, and category
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    // Fetch the posts data from the server using async function fetch and set the posts data to the posts state variable
    const fetchPosts = async () => {
      setLoading(true);

      // Get the startIndex from the URL params using URLSearchParams
      const searchQuery = urlParams.toString();

      // Fetching the data from the server using async function fetch with searchQuery
      const res = await fetch(`/api/post/getposts?${searchQuery}`);

      // If response is not OK then set loading to false
      if (!res.ok) {
        setLoading(false);
        return;
      }

      // If response is OK then set the posts data to the posts state variable and set loading to false and showMore to true or false based on the length of the posts data
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };

    // Call the fetchPosts function
    fetchPosts();
  }, [location.search]);

  // Function to handle the change in the input fields and set the sidebarData state variable based on the input field
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  // Function to handle the form submit and set the search term, sort, and category in the URL params and navigate to the search page
  const handleSubmit = (e) => {
    e.preventDefault();

    // Set the search term, sort, and category in the URL params using URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();

    // Navigate to the search page with the searchQuery
    navigate(`/search?${searchQuery}`);
  };

  // Function to handle the show more button click and fetch more posts data from the server and set the posts data to the posts state variable
  const handleShowMore = async () => {
    // Get the number of posts and startIndex from the posts data
    try {
      const numberOfPosts = posts.length;

      // Set the startIndex in the URL params using URLSearchParams
      const startIndex = numberOfPosts;

      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();

      // Fetching the data from the server using async function fetch with searchQuery
      const res = await fetch(`/api/post/getposts?${searchQuery}`);

      // If response is not OK then return
      if (!res.ok) {
        return;
      }

      // If response is OK then set the posts data to the posts state variable and set showMore to true or false based on the length of the posts data
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        {/* // Form to display the search filters with search term, sort, and category input fields */}
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* // Input field for search term */}
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* // Select field for sort and category with options */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          {/* // Select field for category with options  */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>

          {/* // Button to apply the filters and submit the form */}
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* // Display the posts results with PostCard component and show more button */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        {/* // Display the posts results with PostCard component and show more button */}
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}

          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
