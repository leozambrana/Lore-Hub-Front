import { WikiItem } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { WIKI_FALLBACK_IMAGE } from '@/constants/images'

const CATEGORY_LABELS: Record<string, string> = {
  CHARACTER: 'Personagem',
  ITEM: 'Item',
  LOCATION: 'Local',
  EVENT: 'Evento',
  OTHER: 'Outro',
}

export function WikiCard({ item }: { item: WikiItem }) {
  return (
    <Link href={`/wiki/${item.id}`}>
      <Card className="group border-white/5 bg-zinc-950/40 hover:bg-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer h-full shadow-2xl">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={item.imageUrl || WIKI_FALLBACK_IMAGE}
            alt={item.name}
            fill
            className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-zinc-950/80 backdrop-blur-md text-[9px] uppercase font-black tracking-widest px-2 py-1 border-white/10 rounded-lg text-white">
              {CATEGORY_LABELS[item.category] || item.category}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
        </div>
        
        <CardContent className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1 truncate">
            {item.game?.title || 'Universo Desconhecido'}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {item.name}
          </h3>
          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed italic">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
