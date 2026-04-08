import { gamesService } from "@/services/games.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TheoryCard } from "@/components/modules/theories/TheoryCard";

interface GameDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function GameDetailsPage({ params }: GameDetailsPageProps) {
  const { slug } = await params;
  const game = await gamesService.getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Game Banner */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <Image
          src={game.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}
          alt={game.title}
          fill
          className="object-cover opacity-40 grayscale-[0.5]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
        
        <div className="container px-6 mx-auto relative h-full flex flex-col justify-end pb-12">
          <Link href="/" className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                <ArrowLeft size={16} />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest">Voltar para a Exploração</span>
          </Link>
          <div className="space-y-4">
             <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                Franquia Oficial
             </Badge>
             <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl">
                {game.title}
             </h1>
          </div>
        </div>
      </section>

      {/* Theories List Section */}
      <section className="container px-6 mx-auto py-16">
        <div className="flex flex-col md:flex-row gap-12">
            
            {/* Left Content: Theories List */}
            <div className="flex-1 space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">
                        Teorias da Comunidade <span className="text-primary ml-2 font-black italic">({game.theories?.length || 0})</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   {game.theories?.map((theory) => (
                      <TheoryCard key={theory.id} theory={theory} gameId={game.id} />
                   ))}

                   {(!game.theories || game.theories.length === 0) && (
                      <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                         <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-sm">Ainda não há lendas registradas para este mundo.</p>
                      </div>
                   )}
                </div>
            </div>

            {/* Right Sidebar: Activity / Meta */}
            <div className="w-full md:w-80 space-y-8">
               <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden p-8 backdrop-blur-xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Mestre de Lore</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      Seja o primeiro a forjar uma nova teoria para esta franquia e lidere o topo da Wiki.
                    </p>
                    <Link href={`/theories/new?gameId=${game.id}`} passHref>
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_8px_30px_rgb(var(--primary)/0.3)] transition-all">
                        Nova Teoria
                      </Button>
                    </Link>
               </Card>
            </div>
        </div>
      </section>
    </main>
  );
}
