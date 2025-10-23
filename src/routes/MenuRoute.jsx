import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../lib/device";

// Lazy load different versions of MenuPage
const DesktopMenu = lazy(() => import("../pages/websiteUser/MenuPage"));
const TabletMenu  = lazy(() => import("../pages/tabUser/MenuPage"));
const MobileMenu  = lazy(() => import("../pages/mobileUser/MenuPage"));

export default function MenuRoute() {
  const isMobile  = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const isTablet  = useMediaQuery({
    minWidth: BREAKPOINTS.tabletMin,
    maxWidth: BREAKPOINTS.tabletMax,
  });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktopMin });

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      {isMobile && <MobileMenu />}
      {isTablet && <TabletMenu />}
      {isDesktop && <DesktopMenu />}
    </Suspense>
  );
}
