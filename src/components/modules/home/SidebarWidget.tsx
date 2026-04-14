import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, TrendingUp, Flame, Server } from "lucide-react"

interface SidebarProps {
  stats: {
    totalTheories: number;
    totalGames: number;
    topTheorists: {
      id: string;
      username: string;
      avatarUrl: string | null;
      _count: { theories: number };
    }[];
  }
}

export function SidebarWidget({ stats }: SidebarProps) {
  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* Top Teoricos */}
      <div className="bg-zinc-950/60 border border-white/20 rounded-xl p-8 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center mb-6">
          <Trophy size={14} className="mr-2 text-primary" /> Top Teóricos
        </h3>
        <div className="flex flex-col gap-4">
          {stats.topTheorists.map((user, i) => (
            <div key={user.id} className="flex items-center gap-3">
              <span className={`text-xs font-black w-3 text-center ${i === 0 ? 'text-amber-500' : 'text-zinc-600'}`}>{i + 1}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-xs font-bold text-zinc-300 truncate">{user.username}</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{user._count.theories} Teorias</span>
              </div>
              {i === 0 && <Flame size={14} className="text-amber-500" />}
            </div>
          ))}
          {stats.topTheorists.length === 0 && (
             <p className="text-xs text-zinc-500 text-center py-2">Nenhum autor ainda.</p>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-zinc-950/60 border border-white/20 rounded-xl p-8 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center mb-6">
          <Server size={14} className="mr-2 text-primary" /> Estatísticas
        </h3>
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Teorias</span>
              <span className="text-xs font-black text-white">{stats.totalTheories}</span>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jogos Catalogados</span>
              <span className="text-xs font-black text-white">{stats.totalGames}</span>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ativos</span>
              <span className="text-xs font-black text-green-500 flex items-center"><TrendingUp size={12} className="mr-1" /> OK</span>
           </div>
        </div>
      </div>
    </div>
  )
}

