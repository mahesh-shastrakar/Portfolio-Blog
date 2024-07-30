// Desc: Call to action component to visit Github profile
import { Button } from "flowbite-react";

// Create a functional component CallToAction
export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Checkout my Github</h2>
        <p className="text-gray-500 my-2">
          Click on below button to visit my Github profile
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none rounded-tr-none"
        >
          {/* // Add the link to the Github profile in the href attribute of the anchor tag and set the target attribute to "_blank" to open the link in a new tab and the rel attribute to "noopener noreferrer" for security reasons */}
          <a
            href="https://github.com/mahesh-shastrakar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click Me
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://blog.hubspot.com/hs-fs/hubfs/parts-url_1.webp?width=893&height=600&name=parts-url_1.webp" />
      </div>
    </div>
  );
}
