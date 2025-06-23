"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, login } from "@/lib/api"
import { CircularProgress } from "./ui/circular-progress"
import { signIn } from "next-auth/react"

export function SignupForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [first_name, setFirst_name] = useState("")
  const [last_name, setLast_name] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await createUser({ username: email, email, first_name, last_name, password })
      if (response.ok) {
        const res = await signIn("credentials", {
          email, // <-- pode mudar para "username" se necessário
          password,
          redirect: false,
        })

        if (res.ok) {
          router.push("/")
        } else {
          alert("Login falhou após cadastro.")
        }
      } else {
        alert("Cadastro falhou: " + (response || "Verifique usuário e senha."))
        setLoading(false)
      }
    } catch (error) {
      alert("Erro ao tentar logar: " + error.message)
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Criar uma conta</h1>
            <div className="text-center text-sm">
              Já possui uma conta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Entrar
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="text">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="daniel@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Label htmlFor="text">Nome</Label>
              <Input
                id="first_name"
                type="text"
                placeholder=""
                required
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />

              <Label htmlFor="text">Sobrenome</Label>
              <Input
                id="last_name"
                type="text"
                placeholder=""
                required
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
              />

              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder=""
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              { loading ? <CircularProgress /> : "Cadastrar"}
            </Button>
          </div>
        </div>
      </form>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Clicando em Cadastrar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}