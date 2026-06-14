"use client"
import { useRouter } from "next/navigation"

import { CreateOrganizationDialog } from "@workspace/ui/components/auth/organization/create-organization-dialog"

type Props = {
  userName: string
}
export function OnboardingClient({ userName }: Props) {
  const router = useRouter()

  return (
    <CreateOrganizationDialog
      open
      hideCancel
      onOpenChange={() => {}}
      onSuccess={(org) => {
        
        // org.slug is the canonical identifier — use it for the redirect
        router.replace(`/project/${org.slug}/settings`)
      }}
    />

    // <AlertDialog
    //   open
    //   // onOpenChange is intentionally omitted — this dialog cannot be dismissed
    // >
    //   <AlertDialogContent>
    //     <form onSubmit={handleSubmit} className="flex flex-col gap-6">
    //       <AlertDialogHeader>
    //         <AlertDialogMedia>
    //           <Briefcase />
    //         </AlertDialogMedia>

    //         <AlertDialogTitle>
    //           Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
    //         </AlertDialogTitle>

    //         <AlertDialogDescription>
    //           {orgLocalization?.organizationsDescription as string}
    //         </AlertDialogDescription>
    //       </AlertDialogHeader>

    //       <div className="flex flex-col gap-4">
    //         <Field data-invalid={!!nameError}>
    //           <Label htmlFor="onboarding-name">{orgLocalization?.name as string}</Label>

    //           <Input
    //             id="onboarding-name"
    //             name="name"
    //             autoFocus
    //             required
    //             placeholder={orgLocalization?.namePlaceholder as string}
    //             value={name}
    //             onChange={(e) => {
    //               setName(e.target.value)
    //               setNameError(undefined)
    //             }}
    //             onInvalid={(e) => {
    //               e.preventDefault()
    //               setNameError(localization.auth.fieldRequired)
    //             }}
    //             aria-invalid={!!nameError}
    //             disabled={isCreating}
    //           />

    //           <FieldError>{nameError}</FieldError>
    //         </Field>

    //         <SlugField
    //           id="onboarding-slug"
    //           value={slug}
    //           onChange={setSlug}
    //           disabled={isCreating}
    //         />
    //       </div>

    //       <AlertDialogFooter>
    //         <Button type="submit" disabled={isCreating} className="w-full">
    //           {isCreating && <Spinner />}
    //           {orgLocalization?.createOrganization as string}
    //         </Button>
    //       </AlertDialogFooter>
    //     </form>
    //   </AlertDialogContent>
    // </AlertDialog>
  )
}
