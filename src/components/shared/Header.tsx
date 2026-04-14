'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { PlusCircle, Search, Compass, LogIn, ShieldCheck, Library } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { usersService } from '@/services/users.service'
import { useLoreStore } from '@/store/useLoreStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const supabase = createClient()

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  
  const isTheoryPage = pathname?.startsWith('/theories/new') || pathname?.startsWith('/theories/edit')
  const { user, setUser } = useLoreStore()
  const [loading, setLoading] = useState(true)
  const isFetchingRef = useRef(false)

  const fetchProfile = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const { data: authData } = await supabase.auth.getUser()
      if (authData.user) {
        const profile = await usersService.getMe()
        setUser(profile)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      setUser(null)
    } finally {
      isFetchingRef.current = false;
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchProfile()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-black/60 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-10">
          <Link href="/" className="group">
            <h1 className="text-3xl font-black italic tracking-tighter text-white select-none">
              LORE<span className="text-primary not-italic transition-all group-hover:drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">HUB</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/explorar" 
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              <Compass size={14} className="inline mr-2 -mt-1 text-primary" /> Explorar
            </Link>
            <Link 
              href="/theories" 
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              <Library size={14} className="inline mr-2 -mt-1 text-primary" /> Teorias
            </Link>
            <Link 
              href="/wiki" 
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              <Search size={14} className="inline mr-2 -mt-1 text-primary" /> Wiki
            </Link>
            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin/review" 
                className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors animate-pulse"
              >
                <ShieldCheck size={14} className="inline mr-2 -mt-1" /> Revisão
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {!isTheoryPage && (
            <Link href="/theories/new" passHref>
              <Button 
                variant="outline" 
                className="hidden sm:flex h-10 border-white/20 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-105"
              >
                <PlusCircle size={14} className="mr-2" /> Nova Teoria
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div role="button" tabIndex={0} className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-foreground p-px cursor-pointer hover:scale-110 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black overflow-hidden relative group/avatar">
                   <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center text-[10px] font-bold text-white overflow-hidden uppercase relative z-10">
                    {user.avatarUrl ? (
                      <Image 
                        src={user.avatarUrl} 
                        alt={user.username} 
                        width={40} 
                        height={40} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      user.username?.substring(0, 2) || user.email?.substring(0, 2)
                    )}
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/20 text-white rounded-xl">
                <DropdownMenuLabel className="font-bold text-xs uppercase text-zinc-400">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-lg" asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-destructive/20 focus:text-destructive text-destructive font-semibold rounded-lg"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/')
                  }}
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !loading && (
              <Link href="/login">
                <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 group/btn">
                  <LogIn size={14} className="mr-2 transition-transform group-hover/btn:translate-x-0.5" /> Entrar
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}

