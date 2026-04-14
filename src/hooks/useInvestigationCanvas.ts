import { useState, useEffect, useCallback } from 'react'
import { 
  Node, 
  Edge, 
  ConnectionLineType,
  addEdge, 
  OnConnect,
  EdgeMouseHandler,
  useNodesState,
  useEdgesState,
  Connection,
  reconnectEdge
} from 'reactflow'
import { Theory, WikiItem } from '@/types'
import { theoriesService } from '@/services/theories.service'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export interface CanvasLayout {
  nodes: Node[]
  edges: Edge[]
}

const DEFAULT_LABEL_STYLE = { fill: '#fff', fontWeight: 700, fontSize: 10 }
const DEFAULT_LABEL_BG_STYLE = { fill: '#09090b', fillOpacity: 0.9, rx: 6, ry: 6 }
const MANUAL_EDGE_STYLE = { stroke: '#a1a1aa', strokeWidth: 2, opacity: 0.6 }

interface UseInvestigationCanvasProps {
  theory: Theory
  wikiItems: WikiItem[]
}

export function useInvestigationCanvas({ theory, wikiItems }: UseInvestigationCanvasProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isLoading, setIsLoading] = useState(false)
  const [edgeToEdit, setEdgeToEdit] = useState<Edge | null>(null)
  const [isNewEdge, setIsNewEdge] = useState(false)

  // 1. Função de inicialização/resgate dos dados
  const initializeCanvas = useCallback(() => {
    let rawData = theory.canvasData
    if (typeof rawData === 'string') {
      try { rawData = JSON.parse(rawData) } catch { rawData = null }
    }
    
    const savedLayout = (rawData as unknown as CanvasLayout) || { nodes: [], edges: [] }
    let initialNodes: Node[] = []
    
    if (Array.isArray(savedLayout.nodes) && savedLayout.nodes.length > 0) {
      initialNodes = savedLayout.nodes.map(node => {
        if (node.type === 'note') {
          return {
            ...node,
            data: {
              ...node.data,
              onChange: (val: string) => {
                setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, label: val } } : n))
              },
              onColorChange: (color: string) => {
                setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, color } } : n))
              }
            }
          }
        }
        if (node.type === 'wiki') {
          const wikiId = node.id.replace('wiki-', '')
          const currentItem = wikiItems.find(item => String(item.id) === wikiId)
          return {
            ...node,
            data: {
              ...node.data,
              imageUrl: currentItem?.imageUrl || node.data.imageUrl
            }
          }
        }
        if (node.id === 'theory-center') {
          return {
            ...node,
            data: {
              ...node.data,
              label: theory.title,
              imageUrl: theory.wikiMetadata?.image
            }
          }
        }
        return node
      })
    } else {
      initialNodes.push({ 
        id: 'theory-center', 
        type: 'theory', 
        data: { 
          label: theory.title,
          imageUrl: theory.wikiMetadata?.image
        }, 
        position: { x: 400, y: 300 }, 
        draggable: true 
      })

      wikiItems.forEach((item, i) => {
        const id = `wiki-${item.id}`
        const angle = (i / wikiItems.length) * 2 * Math.PI
        initialNodes.push({ 
          id, 
          type: 'wiki', 
          data: { 
            label: item.name, 
            category: item.category,
            imageUrl: item.imageUrl 
          }, 
          position: { x: 400 + 250 * Math.cos(angle) - 75, y: 300 + 250 * Math.sin(angle) - 30 } 
        })
      })
    }

    let initialEdges: Edge[] = []
    if (Array.isArray(savedLayout.edges) && savedLayout.edges.length > 0) {
      initialEdges = savedLayout.edges.map(edge => ({
        ...edge,
        labelStyle: edge.label ? DEFAULT_LABEL_STYLE : undefined,
        labelBgStyle: edge.label ? DEFAULT_LABEL_BG_STYLE : undefined
      }))
    } else {
      wikiItems.forEach((item) => {
        const id = `wiki-${item.id}`
        initialEdges.push({ 
          id: `e-${id}`, 
          source: 'theory-center', 
          target: id, 
          animated: true, 
          label: '', 
          style: { stroke: '#EAB308', strokeWidth: 2, opacity: 0.4 }, 
          type: ConnectionLineType.SmoothStep 
        })
      })
    }

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [theory, wikiItems, setNodes, setEdges])

  // 2. Dispara inicialização quando a teoria muda OU quando os dados do canvas no banco mudam
  useEffect(() => {
    initializeCanvas()
  }, [theory.id, theory.canvasData, initializeCanvas])

  // 3. Handlers de interação
  const addNoteNode = useCallback(() => {
    const id = `note-${Date.now()}`
    const newNode: Node = {
      id,
      type: 'note',
      position: { x: 400 + (Math.random() - 0.5) * 100, y: 300 + (Math.random() - 0.5) * 100 },
      data: { 
        label: '',
        onChange: (val: string) => {
          setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: val } } : n))
        },
        onColorChange: (color: string) => {
          setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, color } } : n))
        }
      },
    }
    setNodes(nds => [...nds, newNode])
  }, [setNodes])

  const onConnect: OnConnect = useCallback((params: Connection) => {
    if (params.source === params.target) return

    const id = `e-${Date.now()}`
    const newEdge: Edge = { 
      ...params, 
      id,
      label: 'Conexão',
      labelStyle: DEFAULT_LABEL_STYLE,
      labelBgStyle: DEFAULT_LABEL_BG_STYLE,
      animated: true, 
      style: MANUAL_EDGE_STYLE,
      type: ConnectionLineType.SmoothStep 
    }
    setEdges(eds => addEdge(newEdge, eds))
    setIsNewEdge(true)
    setEdgeToEdit(newEdge)
  }, [setEdges])

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
    },
    [setEdges]
  )

  const onEdgeClick: EdgeMouseHandler = useCallback((_event, edge) => {
    setIsNewEdge(false)
    setEdgeToEdit(edge)
  }, [])

  const updateEdgeLabel = (edgeId: string, label: string) => {
    setEdges(eds => eds.map(e => 
      e.id === edgeId ? { ...e, label, labelStyle: DEFAULT_LABEL_STYLE, labelBgStyle: DEFAULT_LABEL_BG_STYLE } : e
    ))
    setIsNewEdge(false)
    setEdgeToEdit(null)
  }

  const removeEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId))
    setEdgeToEdit(null)
    setIsNewEdge(false)
  }, [setEdges])

  const handleSaveLayout = async () => {
    setIsLoading(true)
    try {
      const cleanNodes = nodes.map(n => ({ 
        ...n, 
        data: { 
          ...n.data, 
          onChange: undefined, 
          onColorChange: undefined 
        } 
      }))
      const layout: CanvasLayout = { nodes: cleanNodes, edges }
      
      await theoriesService.updateTheory(theory.id, { canvasData: layout as any })
      
      // Força o Next.js a re-renderizar o Server Component da página para pegar os novos dados
      router.refresh()
      
      queryClient.invalidateQueries({ queryKey: ['theories', theory.id] })
      
      toast.success('Estado da investigação salvo com sucesso!')
    } catch {
      toast.error('Erro ao salvar o quadro.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    onEdgeClick,
    edgeToEdit,
    setEdgeToEdit,
    updateEdgeLabel,
    removeEdge,
    isNewEdge,
    handleSaveLayout,
    addNoteNode,
    isLoading
  }
}
