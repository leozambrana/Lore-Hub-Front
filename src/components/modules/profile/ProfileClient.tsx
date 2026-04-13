'use client'

import { useState, useRef } from 'react'
import { useLoreStore } from '@/store/useLoreStore'
import { usersService } from '@/services/users.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Camera, Save, User as UserIcon, Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProfileClient() {
  const { user, setUser, logout } = useLoreStore()
  const router = useRouter()
  const [username, setUsername] = useState(user?.username || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-zinc-500 font-medium">Você precisa estar logado para ver esta página.</p>
        <Button onClick={() => router.push('/login')} className="bg-primary hover:bg-primary/90">
          Ir para Login
        </Button>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsSaving(true)
    try {
      const updatedUser = await usersService.updateProfile({ username })
      setUser(updatedUser)
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação básica
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB')
      return
    }

    setIsUploading(true)
    try {
      const updatedUser = await usersService.uploadAvatar(file)
      setUser(updatedUser)
      toast.success('Avatar atualizado!')
    } catch {
      toast.error('Erro ao subir avatar')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
          Seu <span className="text-primary not-italic">Perfil</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
          Gerencie sua identidade como investigador de teorias
        </p>
      </div>

      <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <UserIcon size={120} className="text-primary" />
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="relative group/avatar">
            <Avatar className="h-32 w-32 border-4 border-zinc-900 shadow-2xl cursor-pointer ring-offset-4 ring-offset-black transition-all group-hover/avatar:ring-2 group-hover/avatar:ring-primary">
              <AvatarImage src={user.avatarUrl || ''} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl font-black italic">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover/avatar:animate-pulse"
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">Foto de Perfil</p>
            <p className="text-white/40 text-[10px] uppercase font-medium">Recomendado: 400x400px (Máx. 2MB)</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                Nome de Usuário
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu codinome no hub..."
                  className="bg-black/50 border-white/5 h-12 pl-12 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                E-mail (Permanente)
              </label>
              <Input
                value={user.email}
                disabled
                className="bg-zinc-900/30 border-white/5 h-12 rounded-2xl opacity-50 cursor-not-allowed font-mono text-xs select-all"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSaving || !username.trim() || username === user.username}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black italic uppercase tracking-widest h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando Alterações...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Atualizar Perfil
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                logout()
                router.push('/')
                toast.success('Sessão encerrada.')
              }}
              className="w-full hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest h-10 border border-transparent hover:border-red-500/20 rounded-2xl"
            >
              <LogOut size={14} className="mr-2" /> Encerrar Sessão
            </Button>
          </div>
        </form>
      </div>

      {/* Meta info footer */}
      <div className="text-center">
         <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.5em]">
           Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
         </p>
      </div>
    </div>
  )
}
