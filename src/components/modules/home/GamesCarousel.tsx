'use client'

import { Game } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

import { GAME_FALLBACK_IMAGE } from '@/constants/images'

export function GamesCarousel({ games }: { games: Game[] }) {
  if (!games || games.length === 0) return null

  return (
    <Carousel
      opts={{ align: "start", dragFree: true }}
      className="w-full relative"
    >
      <CarouselContent className="-ml-4">
        {games.map(game => (
          <CarouselItem key={game.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]">
            <Link href={`/games/${game.slug}`} className="block">
               <div className="relative aspect-4/3 rounded-2xl overflow-hidden group border border-white/20 bg-zinc-900 cursor-pointer shadow-xl">
                  {/* Image Background */}
                  <Image 
                    src={game.imageUrl || GAME_FALLBACK_IMAGE} 
                    alt={game.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 right-3 z-10">
                     <Badge variant="outline" className="bg-zinc-950/80 backdrop-blur-md text-white border-white/20 hover:bg-zinc-950 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 whitespace-nowrap">
                        {game.stats?.theories || 0} Teorias
                     </Badge>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                     <h3 className="text-white font-black italic tracking-wide truncate drop-shadow-md text-lg">
                        {game.title}
                     </h3>
                  </div>
               </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Navigation Buttons (Hidden on small screens) */}
      <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 bg-zinc-900 border-white/20 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-transform h-10 w-10 disabled:opacity-0" />
      <CarouselNext className="hidden md:flex -right-6 lg:-right-12 bg-zinc-900 border-white/20 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-transform h-10 w-10 disabled:opacity-0" />
    </Carousel>
  )
}

