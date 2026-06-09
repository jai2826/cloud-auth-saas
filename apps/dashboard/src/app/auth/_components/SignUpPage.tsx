"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react"
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

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." }),
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [apiError, setApiError] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: SignUpValues) => {
    setApiError("")
    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (error) {
        setApiError(error.message ?? "Failed to create account.")
      } else {
        router.push("/projects")
      }
    } catch {
      setApiError("Network error. Please try again.")
    }
  }

  const password = form.watch("password")
  const passwordStrength = (() => {
    if (!password) return null
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1)
      return { label: "Weak", color: "bg-red-500", width: "w-1/4" }
    if (score === 2)
      return { label: "Fair", color: "bg-amber-500", width: "w-2/4" }
    if (score === 3)
      return { label: "Good", color: "bg-indigo-500", width: "w-3/4" }
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" }
  })()

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
              Create your account
            </h1>
            <p className="mt-0.5 text-xl text-zinc-500">
              Start managing your FGA policies and auth engine
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="rounded-xl border border-zinc-200 px-2 py-4 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-zinc-900">
              Get started
            </CardTitle>
            <CardDescription className="text-lg text-zinc-500">
              Create your workspace in seconds
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                {apiError}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block font-medium text-zinc-700"
                    >
                      Full name
                    </FieldLabel>
                    <div className="relative">
                      <User className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Jane Smith"
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
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block font-medium text-zinc-700"
                    >
                      Password
                    </FieldLabel>
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
                        className="absolute top-1/3 right-3 h-3.5 w-3.5 cursor-pointer text-zinc-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {passwordStrength && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${passwordStrength.color} ${passwordStrength.width}`}
                          />
                        </div>
                        <p className="text-[12px] text-zinc-400">
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[14px] text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-[12px] text-zinc-400">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 transition-colors hover:text-zinc-600"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-colors hover:text-zinc-600"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
