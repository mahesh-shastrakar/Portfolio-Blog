// Import necessary modules
import CallToAction from "../components/CallToAction";

// Projects Component to display the projects page
export default function Projects() {
  // Return the JSX for the Projects component
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-md text-gray-500 text-center">
        I love working on new technologies and build new projects. Here are some
        of the projects I have worked on.
      </p>
      <CallToAction />
    </div>
  );
}
