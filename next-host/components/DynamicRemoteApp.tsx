import React, { useEffect, useState, useRef } from "react";
import { useDynamicScript } from "../hooks/useDynamicScript";
import styled from "@emotion/styled";


const AppWrapper = styled.div`
  position: relative;
`;


async function loadComponent(scope: any, module: any) {
  // @ts-ignore
  await __webpack_init_sharing__("default");
  const container = window[scope];
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  // @ts-ignore
  const factory = await window[scope].get(module);
  const Module = factory();
  // @ts-ignore
  window[`MF_${scope}_module`] = Module;
  return Module;
}

function DynamicRemoteApp({
  remoteAppInfo,
  innerHTMLContent,
  skeleton,
  skeletonThreshold,
  eventBus,
  locale
}: {remoteAppInfo: any, innerHTMLContent: string, skeleton: any, skeletonThreshold: number, locale?: string, eventBus: any}) {

  const wrapperRef = useRef(null);
  const skeletonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { module, scope, url } = remoteAppInfo;

  const [remoteModule, setRemoteModule] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);




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
      // @ts-ignore
      mount(wrapperRef.current, {locale, resources: window.i18NClones, eventBus});
    }
  }, [remoteModule, locale, eventBus]);

  const { ready } = useDynamicScript(url, scope);

  useEffect(() => {
    async function load() {
      if (ready && !remoteModule) {
        // @ts-ignore
        const moduleFromGlobalWindow = window[`MF_${scope}_module`];
        if (moduleFromGlobalWindow){
          setRemoteModule(moduleFromGlobalWindow);
          return;
        }
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
