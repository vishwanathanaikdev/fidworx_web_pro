// src/routes/AboutUsRoute.jsx
import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../lib/device";

const DesktopAboutUs = lazy(() => import("../pages/websiteUser/AboutUs"));
const TabletAboutUs  = lazy(() => import("../pages/tabUser/AboutUs"));
const MobileAboutUs  = lazy(() => import("../pages/mobileUser/AboutUs"));

export default function AboutUsRoute() {
  const isMobile  = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const isTablet  = useMediaQuery({ minWidth: BREAKPOINTS.tabletMin, maxWidth: BREAKPOINTS.tabletMax });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktopMin });

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      {isMobile && <MobileAboutUs />}
      {isTablet && <TabletAboutUs />}
      {isDesktop && <DesktopAboutUs />}
    </Suspense>
  );
}
