import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../lib/device";

const DesktopHome = lazy(() => import("../pages/websiteUser/Home"));
const TabletHome  = lazy(() => import("../pages/tabUser/Home"));
const MobileHome  = lazy(() => import("../pages/mobileUser/Home"));

export default function HomeRoute() {
  const isMobile  = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const isTablet  = useMediaQuery({ minWidth: BREAKPOINTS.tabletMin, maxWidth: BREAKPOINTS.tabletMax });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktopMin });

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      {isMobile && <MobileHome />}
      {isTablet && <TabletHome />}
      {isDesktop && <DesktopHome />}
    </Suspense>
  );
}
