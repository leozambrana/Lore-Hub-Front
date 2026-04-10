import { gamesService } from "@/services/games.service";
import { ExploreHub } from "@/components/modules/games/ExploreHub";

export const dynamic = 'force-dynamic';


export default async function ExplorarPage() {
  const initialData = await gamesService.getAllGames(1, 12);

  return (
    <main className="flex-1 flex flex-col items-center pb-20">
      <section className="w-full relative pt-16 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container px-6 mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-2xl mb-4">
              Explorar <span className="text-primary not-italic">Franquias</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-medium max-w-lg text-center mx-auto mb-2">
              Pesquise e navegue por todos os universos forjados pela comunidade.
          </p>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 mt-12">
         <ExploreHub initialData={initialData} />
      </section>
    </main>
  );
}
