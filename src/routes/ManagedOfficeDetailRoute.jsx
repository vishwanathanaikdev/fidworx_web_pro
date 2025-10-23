import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../lib/device";

// Lazy load different versions of ManagedOfficeDetail
const DesktopManagedOfficeDetail = lazy(() => import("../pages/websiteUser/ManagedOfficeDetail"));
const TabletManagedOfficeDetail  = lazy(() => import("../pages/tabUser/ManagedOfficeDetail"));
const MobileManagedOfficeDetail  = lazy(() => import("../pages/mobileUser/ManagedOfficeDetail"));

export default function ManagedOfficeDetailRoute() {
  const isMobile  = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const isTablet  = useMediaQuery({
    minWidth: BREAKPOINTS.tabletMin,
    maxWidth: BREAKPOINTS.tabletMax,
  });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktopMin });

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      {isMobile && <MobileManagedOfficeDetail />}
      {isTablet && <TabletManagedOfficeDetail />}
      {isDesktop && <DesktopManagedOfficeDetail />}
    </Suspense>
  );
}
