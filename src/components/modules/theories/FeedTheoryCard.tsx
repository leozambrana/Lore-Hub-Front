import { Theory } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare } from "lucide-react"
import Link from "next/link"

export function FeedTheoryCard({ theory }: { theory: Theory }) {
  const commentCount = theory._count?.comments || 0;

  return (
    <Card className="border-white/20 bg-zinc-950/60 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/theories/${theory.id}`} className="block flex-1 pr-6 cursor-pointer">
            <h3 className="text-xl md:text-2xl font-black text-zinc-50 group-hover:text-primary transition-colors leading-tight mb-2">
              {theory.title}
            </h3>
            <p className="text-zinc-500 line-clamp-2 text-sm leading-relaxed font-medium">
              {theory.content}
            </p>
          </Link>
          <div className="shrink-0 flex flex-col items-end gap-2">
            {theory.game && (
              <Badge variant="outline" className="text-[10px] border-white/20 text-zinc-500 uppercase tracking-widest hidden sm:inline-flex bg-zinc-950">
                {theory.game.title}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={theory.user?.avatarUrl || ""} />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">{theory.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-bold text-zinc-300 capitalize">{theory.user?.username}</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest hidden sm:inline ml-1">
              • {new Date(theory.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors cursor-pointer">
              <Heart size={14} className="fill-red-500" />
              <span className="text-xs font-bold">{theory.upvotes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <MessageSquare size={14} className={commentCount > 0 ? "text-primary/70" : ""} />
              <span className="text-xs font-bold">{commentCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

