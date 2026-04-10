import { gamesService } from "@/services/games.service";
import { HomeFeed } from "@/components/modules/home/HomeFeed";
import { SidebarWidget } from "@/components/modules/home/SidebarWidget";
import { GamesCarousel } from "@/components/modules/home/GamesCarousel";
import { theoriesService } from "@/services/theories.service";

async function fetchStats() {
  try {
    const stats = await theoriesService.getSystemStats();
    return stats;
  } catch {
    return { totalTheories: 0, totalGames: 0, topTheorists: [] };
  }
}

export default async function Home() {
  const { data: games } = await gamesService.getAllGames(1, 10);
  console.log('games', games);
  const stats = await fetchStats();

  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Hero Section Slim */}
      <section className="w-full relative pt-16 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container px-6 mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-2xl mb-4">
              Lore<span className="text-primary not-italic">Hub</span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg font-medium max-w-lg text-center mx-auto mb-10">
              Pense alto. Conecte os pontos. Compartilhe suas teorias na maior base de dados de lore dos games.
          </p>

          {/* Destaques (Games Horizontal Row) */}
          <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-2">
            <GamesCarousel games={games} />
          </div>
        </div>
      </section>

      {/* Grid Principal */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Coluna Main: Fluxo de Teorias (75%) */}
          <div className="lg:col-span-3">
             <HomeFeed />
          </div>
          
          {/* Coluna Lateral: Status e Top Users (25%) */}
          <div className="lg:col-span-1 hidden lg:block">
             <SidebarWidget stats={stats} />
          </div>

        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="w-full py-10 text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em] border-t border-white/5 mt-auto">
         LoreHub &bull; Forged with Passion
      </footer>
    </main>
  );
}
