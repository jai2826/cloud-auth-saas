import { OnboardingClient } from "@/app/onboarding/_components/OnboardingClient"
import { auth, type Session } from "@workspace/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() }) as Session

  if (!session) {
    redirect("/auth/sign-in")
  }

  

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <OnboardingClient userName={session.user.name} />
    </div>
  )
}







