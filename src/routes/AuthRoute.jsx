// routes/AuthRoute.js
import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../lib/device";

// Lazy load separate login/register views
const DesktopAuth = lazy(() => import("../pages/websiteUser/component/AuthModal"));
// const TabletAuth = lazy(() => import("../pages/tabUser/component/AuthModal"));
// const MobileAuth = lazy(() => import("../pages/mobileUser/component/AuthModal"));
const MobileAuth = lazy(() => import("../pages/websiteUser/component/AuthModal"));

export default function AuthRoute() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS.tabletMin,
    maxWidth: BREAKPOINTS.tabletMax,
  });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktopMin });

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading Auth...</div>}>
      {isMobile && <MobileAuth />}
      {isTablet && <TabletAuth />}
      {isDesktop && <DesktopAuth />}
    </Suspense>
  );
}
