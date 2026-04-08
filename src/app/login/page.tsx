'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido. Verifique o formato.' }),
  password: z.string().min(6, { message: 'Mínimo de 6 caracteres.' }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })
        if (authError) throw authError
        
        toast.success(`Bem-vindo de volta, ${values.email.split('@')[0]}!`)
        router.push('/')
        router.refresh()
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        })
        if (authError) throw authError
        
        toast.success('Iniciado com sucesso! Verifique seu e-mail para confirmar.')
        setIsLogin(true)
      }
    } catch (err: unknown) {
      console.error('Auth check:', err)
      const error = err as Error
      const message = error.message === 'Invalid login credentials' 
        ? 'Acesso negado. Credenciais incorretas.' 
        : error.message || 'Erro inesperado no portal.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="dark min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-zinc-900 via-black to-black transition-all duration-700">
      <div className="w-full max-w-420px animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10 group">
          <div className="relative mb-2">
            <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] select-none">
              LORE<span className="text-primary not-italic">HUB</span>
            </h1>
            <div className="absolute -bottom-1 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-full shadow-[0_0_10px_#fff]" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase bg-white/5 py-1 px-3 border border-white/10 rounded-full backdrop-blur-sm">
            Central de Teorias e Lore
          </span>
        </div>

        <Card className="relative border-white/5 bg-zinc-950/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10 overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          
          <CardHeader className="relative z-10 pt-10 pb-6 text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white/90">
              {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-zinc-500 text-sm">
              {isLogin 
                ? 'Conecte-se para explorar e debater teorias.' 
                : 'Junte-se à comunidade para organizar o lore dos jogos.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Identificação</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu melhor e-mail"
                  {...register('email')}
                  className={`h-12 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/20 focus:border-primary transition-all ${errors.email ? 'border-destructive/50' : ''}`}
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-destructive mt-1.5 animate-in fade-in-0 slide-in-from-top-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Senha</Label>
                  {isLogin && (
                    <button type="button" className="text-[10px] text-primary/60 hover:text-primary font-bold uppercase tracking-widest transition-colors">
                      Esqueci a Senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha secreta"
                    {...register('password')}
                    className={`h-12 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/20 focus:border-primary transition-all ${errors.password ? 'border-destructive/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-medium text-destructive mt-1.5 animate-in fade-in-0 slide-in-from-top-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-[0.2em] shadow-[0_8px_30px_rgb(var(--primary)/0.3)] transition-all hover:translate-y-px active:translate-y-px"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin opacity-50" />
                  ) : (
                    isLogin ? 'Entrar no Hub' : 'Criar Conta'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="relative z-10 px-8 pb-10 flex flex-col gap-6">
            <div className="w-full h-px bg-white/5" />
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
              }}
              className="group text-xs text-zinc-500 hover:text-white transition-all text-center"
            >
               {isLogin ? (
                <>Deseja contribuir? <span className="text-primary font-black uppercase tracking-widest ml-1 group-hover:underline">Cadastre-se</span></>
              ) : (
                <>Já faz parte da comunidade? <span className="text-primary font-black uppercase tracking-widest ml-1 group-hover:underline">Entrar</span></>
              )}
            </button>
          </CardFooter>
        </Card>
        
        <p className="mt-12 text-center text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity cursor-default">
            LoreHub Ecosystem &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}
