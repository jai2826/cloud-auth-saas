"use client"

import { useRouter } from "next/navigation";
import MarketingPage from "./_components/MarketingPage";

export default function MarketingRoute() {
  const router = useRouter();

  return (
    <MarketingPage
      onNavigate={(page: string) => {
        if (page === 'auth') router.push('/auth/signin')
        else if (page === 'dashboard') router.push('/dashboard')
      }}
    />
  )
}
