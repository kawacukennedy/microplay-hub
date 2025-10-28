'use client'

import { useEffect, useRef, useState } from 'react'
import * as PIXI from 'pixi.js'

interface EditorCanvasProps {
  gameId: string
}

interface EditorObject {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, any>
}

export function EditorCanvas({ gameId }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const pixiAppRef = useRef<PIXI.Application | null>(null)
  const [objects, setObjects] = useState<EditorObject[]>([])
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [tool, setTool] = useState<'select' | 'add'>('select')

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Pixi.js app
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xf0f0f0,
    })

    canvasRef.current.appendChild(app.view as any)
    pixiAppRef.current = app

    // Add grid
    const gridGraphics = new PIXI.Graphics()
    gridGraphics.lineStyle(1, 0xcccccc, 0.5)
    for (let i = 0; i <= 800; i += 20) {
      gridGraphics.moveTo(i, 0)
      gridGraphics.lineTo(i, 600)
    }
    for (let i = 0; i <= 600; i += 20) {
      gridGraphics.moveTo(0, i)
      gridGraphics.lineTo(800, i)
    }
    app.stage.addChild(gridGraphics)

    // Handle mouse events
    app.view.addEventListener('mousedown', handleMouseDown)
    app.view.addEventListener('mousemove', handleMouseMove)
    app.view.addEventListener('mouseup', handleMouseUp)

    let isDragging = false
    let dragOffset = { x: 0, y: 0 }

    function handleMouseDown(event: MouseEvent) {
      const rect = (app.view as HTMLCanvasElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (tool === 'select') {
        // Check if clicking on an object
        const clickedObject = objects.find(obj =>
          x >= obj.x && x <= obj.x + obj.width &&
          y >= obj.y && y <= obj.y + obj.height
        )

        if (clickedObject) {
          setSelectedObject(clickedObject.id)
          isDragging = true
          dragOffset.x = x - clickedObject.x
          dragOffset.y = y - clickedObject.y
        } else {
          setSelectedObject(null)
        }
      } else if (tool === 'add') {
        // Add new object
        const newObject: EditorObject = {
          id: `obj_${Date.now()}`,
          type: 'obstacle', // TODO: Make this configurable
          x: Math.floor(x / 20) * 20,
          y: Math.floor(y / 20) * 20,
          width: 40,
          height: 40,
          properties: {}
        }
        setObjects(prev => [...prev, newObject])
        setTool('select')
      }
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDragging || !selectedObject) return

      const rect = (app.view as HTMLCanvasElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setObjects(prev => prev.map(obj =>
        obj.id === selectedObject
          ? { ...obj, x: x - dragOffset.x, y: y - dragOffset.y }
          : obj
      ))
    }

    function handleMouseUp() {
      isDragging = false
    }

    return () => {
      app.view.removeEventListener('mousedown', handleMouseDown)
      app.view.removeEventListener('mousemove', handleMouseMove)
      app.view.removeEventListener('mouseup', handleMouseUp)
      app.destroy()
    }
  }, [gameId, tool])

  // Render objects
  useEffect(() => {
    if (!pixiAppRef.current) return

    const app = pixiAppRef.current

    // Clear existing objects (keep grid)
    while (app.stage.children.length > 1) {
      app.stage.removeChild(app.stage.children[1])
    }

    // Add objects
    objects.forEach(obj => {
      const graphics = new PIXI.Graphics()

      if (obj.id === selectedObject) {
        graphics.lineStyle(2, 0x007bff, 1)
      } else {
        graphics.lineStyle(1, 0x333333, 1)
      }

      graphics.beginFill(0xcccccc, 0.7)
      graphics.drawRect(obj.x, obj.y, obj.width, obj.height)
      graphics.endFill()

      app.stage.addChild(graphics)
    })
  }, [objects, selectedObject])

  const handleDelete = () => {
    if (selectedObject) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedObject))
      setSelectedObject(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
        <button
          onClick={() => setTool('select')}
          className={`px-3 py-1 rounded text-sm ${
            tool === 'select' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          Select
        </button>
        <button
          onClick={() => setTool('add')}
          className={`px-3 py-1 rounded text-sm ${
            tool === 'add' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          Add Object
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedObject}
          className="px-3 py-1 rounded text-sm bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="border rounded" />

      {/* Object List */}
      <div className="max-h-32 overflow-y-auto">
        <h4 className="font-semibold mb-2">Objects ({objects.length})</h4>
        <div className="space-y-1">
          {objects.map(obj => (
            <div
              key={obj.id}
              onClick={() => setSelectedObject(obj.id)}
              className={`p-2 rounded cursor-pointer text-sm ${
                obj.id === selectedObject ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              {obj.type} at ({obj.x}, {obj.y})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}