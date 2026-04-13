'use client'

import { Theory } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MessageSquare, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface TheoryListCardProps {
  theory: Theory
}

export function TheoryListCard({ theory }: TheoryListCardProps) {
  return (
    <Link href={`/theories/${theory.id}`} className="group block">
      <div className="bg-zinc-950/40 border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.03] hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Indicador de Hover lateral */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />

        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              {theory.game?.title}
            </Badge>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={10} />
              {new Date(theory.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-primary transition-colors leading-tight truncate md:whitespace-normal line-clamp-2">
            {theory.title}
          </h2>

          <p className="text-zinc-500 text-sm font-medium line-clamp-2 italic opacity-80 leading-relaxed max-w-2xl">
            {theory.content}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 border border-white/10">
                <AvatarImage src={theory.user?.avatarUrl || ''} />
                <AvatarFallback className="bg-zinc-800 text-[8px] font-bold">
                  {theory.user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {theory.user?.username}
              </span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto md:ml-0">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Heart size={14} className="group-hover:text-red-500 transition-colors" />
                <span className="text-[10px] font-black">{theory.upvotes || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <MessageSquare size={14} className="group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black">{theory._count?.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
           <ArrowRight className="text-primary" size={20} />
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-2">Ler Mais</span>
        </div>
      </div>
    </Link>
  )
}
