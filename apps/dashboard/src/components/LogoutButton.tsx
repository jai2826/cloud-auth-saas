"use client"
import { authClient } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { LogOut } from "lucide-react"

const LogOutButton = () => {
  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = "/auth/sign-in"
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
    </Button>
  )
}

export default LogOutButton
