import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "flowbite-react";
import { BsInstagram, BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
const FooterComponent = () => {
  return (
    <Footer container className="border border-t-8 border-pink-500 ">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white "
            >
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 rounded-lg text-white ">
                Mahesh Shastrakar
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/maheshshastrakar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link href="/about">Mahesh About</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Page" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/maheshshastrakar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link href="/about">Mahesh About</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="New" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/maheshshastrakar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link href="/about">Mahesh About</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Mahesh Shastrakar"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.linkedin.com/in/maheshshastrakar"
              target="_blank"
              icon={BsLinkedin}
            />
            <Footer.Icon
              href="https://www.github.com/in/mahesh-shastrakar"
              target="_blank"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://www.instagram.com/mahesh__shastrakar"
              target="_blank"
              icon={BsInstagram}
            />
            <Footer.Icon
              href="https://www.twitter.com/maheshshastrakar"
              target="_blank"
              icon={BsTwitter}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
