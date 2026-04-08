import React, { Suspense } from "react";
const RemoteDashboard = React.lazy(() => import("remoteApp/Dashboard"));
export default function App() {
  return <div><h1>Host App</h1><Suspense fallback="Loading remote..."><RemoteDashboard /></Suspense></div>;
}
