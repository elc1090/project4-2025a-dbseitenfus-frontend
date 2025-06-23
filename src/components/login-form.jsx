"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/api" 
import { CircularProgress } from "./ui/circular-progress"
import { useSession, signIn } from "next-auth/react"

export function LoginForm({ className, ...props }) {

  const { data: session } = useSession()
  
  useEffect(() => {
    if (session) {
      router.push("/") 
    }
  }, [session])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAuthenticatingWithGoogle, setIsAuthenticatingWithGoogle] = useState(false)
  const router = useRouter()

 const handleLogin = async (e) => {
  e.preventDefault(); // Impede o reload
  setLoading(true)
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false, // Impede redirecionamento automático
  })

  if (res.ok) {
    router.push("/") 
  } else {
    setLoading(false)
    toast.error("Erro no login")
  }
}

const handleGoogleLogin = async () => {
    setIsAuthenticatingWithGoogle(true)
    try {
      await signIn("google", { callbackUrl: "/" }) 
    } catch (err) {
      console.error("Erro ao logar:", err)
      setIsAuthenticatingWithGoogle(false)
    }
  }

  if (isAuthenticatingWithGoogle) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">CoWrite</h1>
            <div className="text-center text-sm">
              Não possui uma conta?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Inscreva-se
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="text">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              { loading ?
                <CircularProgress />
                : "Entrar"}              
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou
            </span>
          </div>
          <div className="">
        
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
    
        </div>
      </form>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Clicando em continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}