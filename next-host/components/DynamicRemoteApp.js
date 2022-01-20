import React, { useEffect, useState, useRef } from "react";
import { useDynamicScript } from "../hooks/useDynamicScript";
import styled from "@emotion/styled";
import EventStream from "eventing-bus/lib/event_stream";

const AppWrapper = styled.div`
  position: relative;
`;

async function loadComponent(scope, module) {
  await __webpack_init_sharing__("default");
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await window[scope].get(module);
  const Module = factory();

  return Module;
}

function DynamicRemoteApp({
  remoteAppInfo,
  innerHTMLContent,
  skeleton,
  skeletonThreshold,
}) {
  console.log("Remote-App injecter (in host app) rendered");
  const wrapperRef = useRef(null);
  const skeletonTimeoutRef = useRef(null);

  const { module, scope, url } = remoteAppInfo;

  const [remoteModule, setRemoteModule] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Send message to child && listen messages from child
  useEffect(() => {
    const microAppEventBus = new EventStream();
    window.microAppEventBus = microAppEventBus;

    const callback = (name) => {
      console.log(`Hey I am parent and I got a new message: ${name}!`);
    };
    const unsub = microAppEventBus.on("microAppChildEventsBus", callback);


    const messageTimeout = setTimeout(() => {
      microAppEventBus.publish("microAppParentEventsBus", "Hello from your container");
    }, 2000);
    return () => {
      clearTimeout(messageTimeout);
      unsub();
    };
  }, []);

  useEffect(() => {
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(true);
    }, skeletonThreshold);

    return () => {
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, [skeletonThreshold]);

  useEffect(() => {
    if (remoteModule) {
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
      const { mount } = remoteModule;
      setShowSkeleton(false);
      mount(wrapperRef.current);
    }
  }, [remoteModule]);

  const { ready } = useDynamicScript(url);

  useEffect(() => {
    async function load() {
      if (ready && !remoteModule) {
        const fetchedModule = await loadComponent(scope, module);
        setRemoteModule(fetchedModule);
      }
    }

    load();
  }, [remoteModule, ready, module, scope]);

  return (
    <AppWrapper>
      {showSkeleton && skeleton}
      <div
        dangerouslySetInnerHTML={{ __html: innerHTMLContent }}
        ref={wrapperRef}
      />
    </AppWrapper>
  );
}

// Never re-render when parent/prop changes
export default React.memo(DynamicRemoteApp, () => true);
