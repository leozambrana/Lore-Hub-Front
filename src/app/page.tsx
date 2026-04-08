import { gamesService } from "@/services/games.service";
import { GameList } from "@/components/modules/games/GameList";
import { Compass, Trophy, Users } from "lucide-react";

export default async function Home() {
  const { data: games } = await gamesService.getAllGames(1, 100);

  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-2xl">
               Explorar a <span className="text-primary not-italic">Lore</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl">
               Descubra os mistérios escondidos, compartilhe suas teorias e mergulhe no conhecimento profundo dos seus universos favoritos.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-60">
                <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-primary" />
                    <span className="text-xs uppercase font-bold tracking-widest text-white">800+ Teorias</span>
                </div>
                <div className="flex items-center gap-2">
                    <Compass size={18} className="text-primary" />
                    <span className="text-xs uppercase font-bold tracking-widest text-white">25+ Franquias</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={18} className="text-primary" />
                    <span className="text-xs uppercase font-bold tracking-widest text-white">Comunidade Ativa</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid listing (Client Component with Server Hydration) */}
      <GameList initialData={games} />
      
      {/* Footer minimal */}
      <footer className="w-full py-10 text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em] border-t border-white/5 mt-auto">
         LoreHub &bull; Forged with Passion
      </footer>
    </main>
  );
}
