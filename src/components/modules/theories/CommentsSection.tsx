'use client'

import { useState, useEffect } from 'react'
import { commentsService } from '@/services/comments.service'
import { useLoreStore } from '@/store/useLoreStore'
import { Comment } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MessageSquare, Trash2, CornerDownRight, Send } from 'lucide-react'
import axios from 'axios'

type CommentWithRelations = Comment & {
  user: { id: string; username: string; avatarUrl: string | null }
  replies: (Comment & { user: { id: string; username: string; avatarUrl: string | null } })[]
}

interface CommentsSectionProps {
  theoryId: string
}

function TimeAgo({ date }: { date: string }) {
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const calculate = () => {
      const diff = Date.now() - new Date(date).getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 1) return 'agora mesmo'
      if (mins < 60) return `há ${mins} min`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `há ${hours}h`
      return new Date(date).toLocaleDateString('pt-BR')
    }
    
    setText(calculate())
  }, [date])

  if (!text) return null
  return <span className="text-[10px] text-zinc-600">{text}</span>
}

function CommentItem({
  comment,
  onDelete,
  onReply,
}: {
  comment: CommentWithRelations
  onDelete: (id: string) => void
  onReply: (parentId: string, username: string) => void
}) {
  const { user } = useLoreStore()
  const canDelete = user && (user.id === comment.userId || user.role === 'ADMIN')

  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarImage src={comment.user?.avatarUrl || ''} />
          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
            {comment.user?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-zinc-300">{comment.user?.username}</span>
            <TimeAgo date={comment.createdAt} />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {user && (
              <button
                onClick={() => onReply(comment.id, comment.user?.username || '')}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors flex items-center gap-1"
              >
                <CornerDownRight size={10} /> Responder
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 size={10} /> Deletar
              </button>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l border-white/20 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="group/reply flex gap-3">
              <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                <AvatarImage src={reply.user?.avatarUrl || ''} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-[8px] font-bold">
                  {reply.user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-400">{reply.user?.username}</span>
                  <TimeAgo date={reply.createdAt} />
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentsSection({ theoryId }: CommentsSectionProps) {
  const { user, comments, setLoading, isLoading } = useLoreStore()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<{ parentId: string; username: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComments = async () => {
    setLoading(true)
    try {
      await commentsService.getByTheory(theoryId)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theoryId])

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para comentar!')
      return
    }
    const content = newComment.trim()
    if (!content) return

    setIsSubmitting(true)
    setLoading(true)
    try {
      await commentsService.create(theoryId, {
        content,
        parentId: replyTo?.parentId,
      })
      setNewComment('')
      setReplyTo(null)
      await loadComments()
      toast.success('Comentário publicado!')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao publicar comentário.')
      } else {
        toast.error('Erro inesperado.')
      }
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    setLoading(true)
    try {
      await commentsService.remove(theoryId, commentId)
      toast.success('Comentário removido.')
      // O service já limpa o store, mas o refetch garante a consistência total (ex: total de comments)
      await loadComments()
    } catch {
      toast.error('Não foi possível remover o comentário.')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (parentId: string, username: string) => {
    setReplyTo({ parentId, username })
    setNewComment(`@${username} `)
    document.getElementById('comment-input')?.focus()
  }

  const commentsDisplay = (comments as unknown as CommentWithRelations[]) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare size={16} className="text-primary" />
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
          Discussão <span className="text-primary ml-1">({commentsDisplay.length})</span>
        </h3>
      </div>

      {/* Input de comentário */}
      <div className="space-y-3">
        {replyTo && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CornerDownRight size={12} className="text-primary" />
            <span>Respondendo a <strong className="text-primary">@{replyTo.username}</strong></span>
            <button onClick={() => { setReplyTo(null); setNewComment('') }} className="ml-auto text-zinc-600 hover:text-white transition-colors text-[10px] uppercase tracking-widest">
              cancelar
            </button>
          </div>
        )}
        <div className="flex gap-3 items-start">
          {user && (
            <Avatar className="h-8 w-8 shrink-0 mt-1">
              <AvatarImage src={user.avatarUrl || ''} />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                {user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 space-y-2">
            <Textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
              }}
              placeholder={user ? 'Adicione sua perspectiva... (Ctrl+Enter para enviar)' : 'Entre para participar da discussão'}
              disabled={!user || isSubmitting}
              className="bg-zinc-950/80 border-white/20 text-white placeholder:text-zinc-600 resize-none rounded-xl text-sm min-h-[80px] focus-visible:ring-primary/50"
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-700">{newComment.length}/2000</span>
              <Button
                onClick={handleSubmit}
                disabled={!user || !newComment.trim() || isSubmitting}
                size="sm"
                className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                <Send size={12} className="mr-1.5" />
                {isSubmitting ? 'Enviando...' : 'Publicar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de comentários */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : commentsDisplay.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-3 border border-dashed border-white/20 rounded-2xl">
          <MessageSquare size={24} className="text-zinc-700" />
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Seja o primeiro a comentar
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {commentsDisplay.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

