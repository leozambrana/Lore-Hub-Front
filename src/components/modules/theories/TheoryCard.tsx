'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Edit2, Trash2 } from "lucide-react"
import { useLoreStore } from "@/store/useLoreStore"
import { useVote } from "@/hooks/useVote"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { theoriesService } from "@/services/theories.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Theory } from "@/types"

import Link from "next/link"

export function TheoryCard({ theory, initialVote }: { theory: Theory; initialVote?: 'UP' | 'DOWN' | null }) {
  const { user } = useLoreStore()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const isOwnerOrAdmin = user && (user.id === theory.userId || user.role === 'ADMIN')

  const { userVote, optimisticUpvotes, handleVote } = useVote({
    theoryId: theory.id,
    initialUpvotes: theory.upvotes,
    initialVote,
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await theoriesService.deleteTheory(theory.id)
      toast.success("Teoria removida irreversivelmente!")
      setIsAlertOpen(false)
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao remover a teoria.")
      } else {
        toast.error("Erro inesperado.")
      }
      setIsAlertOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border-white/5 bg-zinc-950/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <Link href={`/theories/${theory.id}`} className="flex-1 mr-3">
            <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight">
              {theory.title}
            </CardTitle>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerOrAdmin && (
              <>
                <Link href={`/theories/edit/${theory.id}`} passHref>
                  <Button variant="ghost" size="icon-sm" className="h-6 w-6 p-0 text-zinc-500 hover:text-primary hover:bg-primary/20 transition-all rounded-md">
                    <Edit2 size={12} />
                  </Button>
                </Link>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all rounded-md">
                      <Trash2 size={12} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-950 border-white/10 text-white rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black italic uppercase text-destructive tracking-widest">Apagar Teoria?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        Esta ação não pode ser desfeita. Sua teoria será apagada dos registros daquele universo para sempre.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-0 rounded-xl uppercase tracking-widest text-[10px] font-bold">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest text-[10px]" disabled={isDeleting}>
                        {isDeleting ? "Apagando..." : "Sim, Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <Badge variant="outline" className="text-[9px] border-white/10 text-zinc-500 uppercase tracking-widest ml-2">
              {new Date(theory.createdAt).toLocaleDateString('pt-BR')}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-zinc-400 line-clamp-3 pt-2 text-sm leading-relaxed">
          {theory.content}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => handleVote('UP')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${userVote === 'UP' ? 'text-primary' : 'text-zinc-500 hover:text-white'}`}
          >
            <ThumbsUp size={14} className={userVote === 'UP' ? "fill-primary" : ""} />
          </div>
          <span className="text-xs font-bold text-zinc-400">{optimisticUpvotes}</span>
          <div 
            onClick={() => handleVote('DOWN')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${userVote === 'DOWN' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
          >
            <ThumbsDown size={14} className={userVote === 'DOWN' ? "fill-red-500" : ""} />
          </div>
          <div className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-pointer ml-2 border-l border-white/10 pl-4">
            <MessageSquare size={14} className="text-primary/70" />
            <span className="text-xs font-bold">0</span>
          </div>
        </div>
        
        {theory.wikiUrl && (
          <a 
            href={theory.wikiUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
          >
            Wiki Fonte <ExternalLink size={12} />
          </a>
        )}
      </CardContent>
    </Card>
  )
}
