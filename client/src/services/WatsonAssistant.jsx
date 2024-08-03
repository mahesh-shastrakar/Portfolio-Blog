import React from "react";
import {
  WebChatContainer,
  setEnableDebug,
} from "@ibm-watson/assistant-web-chat-react";

// Include this if you want to get debugging information from this library. Note this is different than
// the web chat "debug: true" configuration option which enables debugging within web chat.

export default function WatsonAssistant() {
  const webChatOptions = {
    integrationID: "597e8415-93e3-4506-b579-986fa80cfcad",
    region: "jp-tok",
    serviceInstanceID: "cadfcbb4-0d5f-425c-b0af-baec9c8a3a9f",
    // subscriptionID: 'only on enterprise plans',
    // Note that there is no onLoad property here. The WebChatContainer component will override it.
    // Use the onBeforeRender or onAfterRender prop instead.
  };
  setEnableDebug(true);

  return <WebChatContainer config={webChatOptions} />;
}
