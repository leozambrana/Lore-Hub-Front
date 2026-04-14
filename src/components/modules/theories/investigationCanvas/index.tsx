'use client'

import React from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

import { Theory, WikiItem } from '@/types'
import { Save, Loader2, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Hooks e Sub-componentes
import { useInvestigationCanvas } from '@/hooks/useInvestigationCanvas'
import { TheoryNode } from './TheoryNode'
import { WikiNode } from './WikiNode'
import { NoteNode } from './NoteNode'
import { EdgeEditForm } from './EdgeEditForm'

const nodeTypes = { 
  theory: TheoryNode, 
  wiki: WikiNode,
  note: NoteNode
}

interface InvestigationCanvasProps {
  theory: Theory
  wikiItems: WikiItem[]
  isEditable?: boolean
}

export function InvestigationCanvas({ theory, wikiItems, isEditable }: InvestigationCanvasProps) {
  const { 
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
    handleSaveLayout, 
    addNoteNode,
    removeEdge,
    isNewEdge,
    isLoading 
  } = useInvestigationCanvas({ theory, wikiItems })

  return (
    <div className="w-full h-150 bg-zinc-950/20 rounded-[3rem] border border-white/20 overflow-hidden relative group">
      {/* HUD informativo */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-2">
        <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-3 w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Quadro de Investigação • {nodes.length} Elementos
          </span>
        </div>
      </div>

      {/* Ações do Canvas */}
      {isEditable && (
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          <Button 
            onClick={addNoteNode}
            variant="outline"
            className="bg-zinc-950/80 backdrop-blur-md border-white/20 text-zinc-300 hover:text-primary hover:border-primary/50 text-[10px] font-bold uppercase tracking-widest h-10 px-4 rounded-xl transition-all"
          >
            <StickyNote color="yellow" size={14} className="mr-2" />
            Adicionar Nota
          </Button>

          <Button 
            onClick={handleSaveLayout} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-[0_8px_30px_rgb(var(--primary)/0.3)] transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <Save className="mr-2" size={14} />}
            Salvar Layout
          </Button>
        </div>
      )}

      {/* Canvas principal */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        panOnScroll
        proOptions={{ hideAttribution: true }}
        className="bg-dot-zinc-800"
      >
        <Background color="#3f3f46" gap={20} size={1} className="opacity-20" />
        <Controls 
          showInteractive={false}
          className="bg-zinc-900 border-white/20 rounded-xl overflow-hidden [&_button]:bg-zinc-900! [&_button]:border-white/20! [&_button]:text-white! [&_button:hover]:bg-zinc-800! [&_svg]:fill-white!" 
        />
      </ReactFlow>

      {/* Modal de Edição de Conexão */}
      <Dialog open={!!edgeToEdit} onOpenChange={(open) => {
        if (!open && edgeToEdit) {
          if (isNewEdge) removeEdge(edgeToEdit.id)
          else setEdgeToEdit(null)
        }
      }}>
        <DialogContent 
          key={edgeToEdit?.id}
          className="bg-zinc-950 border-white/20 text-white rounded-[2rem] sm:max-w-[480px] outline-none"
        >
          {edgeToEdit && (
            <EdgeEditForm 
              edge={edgeToEdit} 
              onSave={(label) => updateEdgeLabel(edgeToEdit.id, label)}
              onCancel={() => {
                if (isNewEdge) removeEdge(edgeToEdit.id)
                else setEdgeToEdit(null)
              }}
              onDelete={() => removeEdge(edgeToEdit.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

