import { viewPaths } from "@workspace/ui/index"
import { notFound } from "next/navigation"

import { Auth } from "@workspace/ui/components/auth/auth"

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{
    path: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { path } = await params
  const { addAccount } = await searchParams
  const isAddingAccount = addAccount === "true"
  if (!Object.values(viewPaths.auth).includes(path)) {
    notFound()
  }

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <Auth path={path} isAddingAccount={isAddingAccount} />
    </div>
  )
}
