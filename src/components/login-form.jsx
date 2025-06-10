"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/api" 

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await login(username, password)
      if(!response.ok) {
        alert("Login falhou: " + (response || "Verifique usuário e senha."))
        return
      }
      const data = await response.json()
      if (data.token) {
        localStorage.setItem("token", data.token)
        router.push("/") 
      } else {
        alert("Login falhou: " + (data || "Verifique usuário e senha."))
      }
    } catch (error) {
      alert("Erro ao tentar logar: " + error.message)
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
              <Label htmlFor="text">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="usuário"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <Button type="submit" className="w-full">
              Entrar
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