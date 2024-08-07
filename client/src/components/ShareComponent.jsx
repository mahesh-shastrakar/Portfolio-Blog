import React from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareComponent = ({ post }) => {
  return (
    <div className="flex justify-center items-center m-5">
      {`Share this post :`}
      <TwitterShareButton url={window.location.href} title={post && post.title}>
        <TwitterIcon size={30}></TwitterIcon>
      </TwitterShareButton>

      <LinkedinShareButton
        url={window.location.href}
        title={post && post.title}
      >
        <LinkedinIcon size={30}></LinkedinIcon>
      </LinkedinShareButton>

      <TelegramShareButton
        url={window.location.href}
        title={post && post.title}
      >
        <TelegramIcon size={30}></TelegramIcon>
      </TelegramShareButton>

      <FacebookShareButton
        url={window.location.href}
        quote={`Check out this article on ${window.location.href} by Mahesh Shastrakar`}
      >
        <FacebookIcon size={30}></FacebookIcon>
      </FacebookShareButton>

      <WhatsappShareButton
        url={window.location.href}
        title={post && post.title}
        body={`Check out this article on ${window.location.href} by Mahesh Shastrakar \n `}
      >
        <WhatsappIcon size={30}></WhatsappIcon>
      </WhatsappShareButton>

      <EmailShareButton
        url={window.location.href}
        subject={post && post.title}
        body={`Check out this article on ${window.location.href} by Mahesh Shastrakar \n `}
      >
        <EmailIcon size={30}></EmailIcon>
      </EmailShareButton>
    </div>
  );
};

export default ShareComponent;
