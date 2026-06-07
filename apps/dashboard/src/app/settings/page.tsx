"use client"

import SettingsPage from "../_components/SettingsPage"

export default function SettingsRoute() {
  return (
    <SettingsPage
      apiConfig={{
        workerUrl: "https://fga-auth.purejoy.workers.dev",
        authToken: "",
        cacheEnabled: true,
        cacheTtl: 30,
        simulateLatency: true,
      }}
      onUpdateConfig={() => {
        // Demo route: local settings live inside the page component.
      }}
    />
  )
}
