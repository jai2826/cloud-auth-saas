"use client"

import { ArrowLeft, ArrowRight, Mail, Shield, UserCheck } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { createClient } from "@workspace/auth/client"
import { useRouter } from "next/navigation"

const authClient = createClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
)
// 1. Zod Schema
const authSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
})

type AuthFormValues = z.infer<typeof authSchema>

export default function SignUpPage() {
  const [apiError, setApiError] = useState("")
  const router = useRouter()
  // 2. Native hook initialization
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  // 3. Type-safe submit
  const onSubmit = async (values: AuthFormValues) => {
    console.log("✅ ZOD PASSED! Firing API Request with payload:", values)
    setApiError("")

    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name || values.email.split("@")[0]!,
      })

      if (error) setApiError(error.message as string)
      else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setApiError("Network failure to Edge API.")
    }
  }

  return (
    <div
      id="auth_container"
      className="relative w-full h-full max-w-8xl flex min-h-screen flex-col justify-center overflow-hidden bg-[#09090b] font-sans text-zinc-100"
    >
      <div className="absolute top-6 left-6">
        <button
          id="btn_back_marketing"
          onClick={() => router.push("/")}
          className="flex cursor-pointer items-center space-x-2 rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Exit to Landing</span>
        </button>
      </div>

      <div className="relative z-10 px-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded border border-indigo-500/20 bg-indigo-600/10 p-2.5 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
        </div>

        <h2 className="mb-2 text-center font-sans text-xl font-bold tracking-tight text-white">
          "Create Developer Account"
          {/* "Access FGA Management Console"} */}
        </h2>
        <p className="mb-8 text-center font-mono text-xs text-zinc-400">
          "Define secure relation tuples at edge velocity."
          {/* "Provide credentials to retrieve active workspace schema."} */}
        </p>

        <Card className="border-zinc-800 bg-zinc-900 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-white">
              Create your account
              {/* "Welcome back" */}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Provision a workspace identity.
              {/* "Enter your workspace credentials." */}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {apiError && (
              <div className="mb-4 rounded border border-rose-500/20 bg-rose-950/20 p-3 font-mono text-xs text-rose-400">
                {apiError}
              </div>
            )}

            {/* 4. Native Form Integration */}
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log("❌ ZOD BLOCKED SUBMIT:", errors)
              )}
              className="space-y-5"
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                      htmlFor={field.name}
                    >
                      Name
                    </FieldLabel>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="e.g. Jane Doe"
                        aria-invalid={fieldState.invalid}
                        className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 pl-10 font-mono text-xs text-white placeholder-zinc-700 outline-none focus:border-indigo-500"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                      htmlFor={field.name}
                    >
                      Workspace Identity Email
                    </FieldLabel>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. dev.evaluator@company.io"
                        className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 pl-10 font-mono text-xs text-white placeholder-zinc-700 outline-none focus:border-indigo-500"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                      htmlFor={field.name}
                    >
                      Secret Passkey
                    </FieldLabel>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        placeholder="e.g. testpassword123@"
                        aria-invalid={fieldState.invalid}
                        className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 pl-10 font-mono text-xs text-white placeholder-zinc-700 outline-none focus:border-indigo-500"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                id="btn_auth_submit"
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center space-x-1.5 rounded bg-zinc-100 py-2.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-white disabled:opacity-50"
              >
                {form.formState.isSubmitting ? (
                  <span>Retrieving Workspace...</span>
                ) : (
                  <>
                    <span>Initialize Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-0.5 font-mono text-[10px] text-zinc-500">
                  OR TEST INSTANTLY
                </span>
              </div>
            </div>

            <Button
              id="btn_bypass_auth_demo"
              // onClick={handleDemoLogin}
              type="button"
              className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded border border-indigo-500/20 bg-zinc-950 py-2.5 font-mono text-xs text-indigo-400 transition-all hover:border-indigo-500/40 hover:bg-zinc-950/70"
            >
              <UserCheck className="h-4 w-4 text-indigo-400" />
              <span>Launch Sandbox (Demo Mode)</span>
            </Button>

            <div className="mt-6 text-center">
              <button
                id="btn_toggle_auth_mode"
                onClick={() => {
                  setApiError("")
                  router.push("/auth/signin")
                }}
                type="button"
                className="cursor-pointer font-mono text-xs text-indigo-400 underline hover:text-indigo-300"
              >
                Already have an enterprise key? Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
