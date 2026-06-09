"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const [apiError, setApiError] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: SignInValues) => {
    setApiError("")
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })
      if (error) {
        setApiError(error.message ?? "Invalid credentials.")
      } else {
        router.push("/projects")
      }
    } catch {
      setApiError("Network error. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-120 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Sign in to CloudAuth
            </h1>
            <p className="mt-0.5 text-xl text-zinc-500">
              Manage your FGA policies and auth engine
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="rounded-xl border border-zinc-200 bg-white px-2 py-4 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-zinc-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-lg text-zinc-500">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-red-600">
                {apiError}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block font-medium text-zinc-700"
                    >
                      Email address
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        placeholder="you@company.com"
                        aria-invalid={fieldState.invalid}
                        className="h-9 rounded-lg border-zinc-200 bg-white pl-9 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-indigo-500/20"
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
                    <div className="mb-1.5 flex items-center justify-between">
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-medium text-zinc-700"
                      >
                        Password
                      </FieldLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-[13px] text-indigo-600 transition-colors hover:text-indigo-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                      <Input
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        className="h-9 rounded-lg border-zinc-200 bg-white pl-9 text-[13px] text-zinc-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                      />
                      <Button
                        variant="ghost"
                        className="cursor-pointer absolute top-1/3 right-3 h-3.5 w-3.5  text-zinc-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye/>}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[16px] font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
              >
                {form.formState.isSubmitting ? (
                  <>
                  {/* NOTE: This is a loading spinner */}
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[14px] text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
