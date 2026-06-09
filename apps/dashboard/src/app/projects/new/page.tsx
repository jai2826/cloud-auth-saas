// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { ArrowRight, FolderPlus } from "lucide-react"
// import { useState } from "react"
// import { Controller, useForm } from "react-hook-form"
// import * as z from "zod"
// import { useRouter } from "next/navigation"
//     <div className="mx-auto flex w-full max-w-md flex-col gap-6">
//       <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">

// const newProjectSchema = z.object({
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//             Create a project
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Projects group your FGA policies and auth config.
//           </p>
//     .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
//       </div>

//       <Card className="border-border bg-card shadow-sm">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-lg font-semibold text-foreground">
//             New project
//           </CardTitle>
//           <CardDescription className="text-sm text-muted-foreground">
//             Give your project a name and a unique slug.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {apiError && (
//             <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
//               {apiError}
//             </div>
//           )}

//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <Controller
//               name="name"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel
//                     htmlFor={field.name}
//                     className="mb-1.5 block text-sm font-medium text-foreground"
//                   >
//                     Project name
//                   </FieldLabel>
//                   <Input
//                     {...field}
//                     id={field.name}
//                     placeholder="My Awesome App"
//                     aria-invalid={fieldState.invalid}
//                     className="h-10 rounded-lg border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
//                     onChange={(e) => {
//                       field.onChange(e)
//                       onNameChange(e.target.value)
//                     }}
//                   />
//                   {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//                 </Field>
//               )}
//             />

//             <Controller
//               name="slug"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel
//                     htmlFor={field.name}
//                     className="mb-1.5 block text-sm font-medium text-foreground"
//                   >
//                     Project slug
//                   </FieldLabel>
//                   <div className="flex h-10 items-center overflow-hidden rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
//                     <span className="flex h-full shrink-0 items-center border-r border-border bg-muted px-3 text-sm text-muted-foreground">
//                       cloudauth.dev/
//                     </span>
//                     <input
//                       {...field}
//                       id={field.name}
//                       placeholder="my-awesome-app"
//                       aria-invalid={fieldState.invalid}
//                       className="flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
//                     />
//                   </div>
//                   {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//                 </Field>
//               )}
//             />

//             <Button
//               type="submit"
//               disabled={form.formState.isSubmitting}
//               className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
//             >
//               {form.formState.isSubmitting ? (
//                 <>
//                   <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   <span>Creating project...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Create project</span>
//                   <ArrowRight className="h-3.5 w-3.5" />
//                 </>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//                 name="slug"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel
//                       htmlFor={field.name}
//                       className="text-[12px] font-medium text-zinc-700 mb-1.5 block"
//                     >
//                       Project slug
//                     </FieldLabel>
//                     <div className="flex items-center h-9 rounded-lg border border-zinc-200 bg-white overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20">
//                       <span className="px-3 text-[12px] text-zinc-400 border-r border-zinc-200 h-full flex items-center bg-zinc-50 shrink-0">
//                         cloudauth.dev/
//                       </span>
//                       <input
//                         {...field}
//                         id={field.name}
//                         placeholder="my-awesome-app"
//                         aria-invalid={fieldState.invalid}
//                         className="flex-1 px-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
//                       />
//                     </div>
//                     {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//                   </Field>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 disabled={form.formState.isSubmitting}
//                 className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 mt-2"
//               >
//                 {form.formState.isSubmitting ? (
//                   <>
//                     <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                     </svg>
//                     <span>Creating project...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>Create project</span>
//                     <ArrowRight className="h-3.5 w-3.5" />
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }