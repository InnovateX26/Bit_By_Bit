"use client";

import dynamic from "next/dynamic";

const NearbyServicesClient = dynamic(
  () => import("@/components/NearbyServicesClient"),
  { ssr: false }
);

export default function NearbyServicesPage() {
  return <NearbyServicesClient />;
}
