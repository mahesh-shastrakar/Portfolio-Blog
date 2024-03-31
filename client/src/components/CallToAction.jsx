import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JavaScript Projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://github.com/mahesh-shastrakar"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.valuecoders.com%2Fblog%2Ftechnology-and-apps%2F5-reasons-choose-facebooks-reactjs%2F&psig=AOvVaw0if2g0Srh9dqVXokchy9a1&ust=1711974914664000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKC2-tbBnoUDFQAAAAAdAAAAABAE" />
      </div>
    </div>
  );
}
