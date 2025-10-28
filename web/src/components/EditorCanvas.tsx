'use client'

import { useEffect, useRef, useState } from 'react'
import * as PIXI from 'pixi.js'

interface EditorCanvasProps {
  gameId: string
  onLevelChange?: (levelData: any) => void
}

interface EditorObject {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, any>
  sprite?: PIXI.Sprite
}

interface Asset {
  id: string
  filename: string
  url: string
  type: 'image' | 'sprite'
}

export function EditorCanvas({ gameId, onLevelChange }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const pixiAppRef = useRef<PIXI.Application | null>(null)
  const [objects, setObjects] = useState<EditorObject[]>([])
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [tool, setTool] = useState<'select' | 'add' | 'erase'>('select')
  const [selectedObjectType, setSelectedObjectType] = useState('obstacle')
  const [assets, setAssets] = useState<Asset[]>([])
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)

  // Game-specific object types
  const getObjectTypes = () => {
    switch (gameId) {
      case 'runner':
        return [
          { id: 'obstacle', name: 'Obstacle', color: 0xff0000 },
          { id: 'platform', name: 'Platform', color: 0x00ff00 },
          { id: 'powerup', name: 'Power-up', color: 0x0000ff },
          { id: 'enemy', name: 'Enemy', color: 0xff00ff }
        ]
      case 'memory-match':
        return [
          { id: 'card', name: 'Card', color: 0xffa500 }
        ]
      case 'tap-speed':
        return [
          { id: 'target', name: 'Target', color: 0x800080 }
        ]
      default:
        return []
    }
  }

  const objectTypes = getObjectTypes()

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Pixi.js app
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xf8f9fa,
    })

    canvasRef.current.appendChild(app.view as any)
    pixiAppRef.current = app

    // Handle mouse events
    app.view.addEventListener('mousedown', handleMouseDown)
    app.view.addEventListener('mousemove', handleMouseMove)
    app.view.addEventListener('mouseup', handleMouseUp)
    app.view.addEventListener('wheel', handleWheel)

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
          type: selectedObjectType,
          x: Math.floor(x / 20) * 20,
          y: Math.floor(y / 20) * 20,
          width: 40,
          height: 40,
          properties: {}
        }
        setObjects(prev => [...prev, newObject])
        onLevelChange?.({ objects: [...objects, newObject] })
      } else if (tool === 'erase') {
        // Remove object
        const clickedObject = objects.find(obj =>
          x >= obj.x && x <= obj.x + obj.width &&
          y >= obj.y && y <= obj.y + obj.height
        )

        if (clickedObject) {
          setObjects(prev => prev.filter(obj => obj.id !== clickedObject.id))
          setSelectedObject(null)
          onLevelChange?.({ objects: objects.filter(obj => obj.id !== clickedObject.id) })
        }
      }
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDragging || !selectedObject) return

      const rect = (app.view as HTMLCanvasElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setObjects(prev => prev.map(obj =>
        obj.id === selectedObject
          ? { ...obj, x: Math.floor((x - dragOffset.x) / 20) * 20, y: Math.floor((y - dragOffset.y) / 20) * 20 }
          : obj
      ))
    }

    function handleMouseUp() {
      isDragging = false
      if (selectedObject) {
        onLevelChange?.({ objects })
      }
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)))
    }

    return () => {
      app.view.removeEventListener('mousedown', handleMouseDown)
      app.view.removeEventListener('mousemove', handleMouseMove)
      app.view.removeEventListener('mouseup', handleMouseUp)
      app.view.removeEventListener('wheel', handleWheel)
      app.destroy()
    }
  }, [gameId, tool, selectedObjectType])

  // Render grid and objects
  useEffect(() => {
    if (!pixiAppRef.current) return

    const app = pixiAppRef.current
    app.stage.removeChildren()

    // Add grid
    if (showGrid) {
      const gridGraphics = new PIXI.Graphics()
      gridGraphics.lineStyle(1, 0xcccccc, 0.5)
      const gridSize = 20 * zoom

      for (let i = 0; i <= 800; i += gridSize) {
        gridGraphics.moveTo(i, 0)
        gridGraphics.lineTo(i, 600)
      }
      for (let i = 0; i <= 600; i += gridSize) {
        gridGraphics.moveTo(0, i)
        gridGraphics.lineTo(800, i)
      }
      app.stage.addChild(gridGraphics)
    }

    // Add objects
    objects.forEach(obj => {
      const graphics = new PIXI.Graphics()

      const objType = objectTypes.find(type => type.id === obj.type)
      const color = objType?.color || 0xcccccc

      if (obj.id === selectedObject) {
        graphics.lineStyle(3, 0x007bff, 1)
      } else {
        graphics.lineStyle(2, 0x333333, 1)
      }

      graphics.beginFill(color, 0.7)
      graphics.drawRect(obj.x * zoom, obj.y * zoom, obj.width * zoom, obj.height * zoom)
      graphics.endFill()

      app.stage.addChild(graphics)
    })

    // Apply zoom
    app.stage.scale.set(zoom, zoom)
  }, [objects, selectedObject, zoom, showGrid, objectTypes])

  const handleDelete = () => {
    if (selectedObject) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedObject))
      setSelectedObject(null)
      onLevelChange?.({ objects: objects.filter(obj => obj.id !== selectedObject) })
    }
  }

  const handleDuplicate = () => {
    if (selectedObject) {
      const obj = objects.find(o => o.id === selectedObject)
      if (obj) {
        const newObj: EditorObject = {
          ...obj,
          id: `obj_${Date.now()}`,
          x: obj.x + 60,
          y: obj.y + 60
        }
        setObjects(prev => [...prev, newObj])
        setSelectedObject(newObj.id)
        onLevelChange?.({ objects: [...objects, newObj] })
      }
    }
  }

  const handleUploadAsset = async (file: File) => {
    try {
      // Get presigned URL
      const presignRes = await fetch('/api/assets/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType: file.type
        })
      })

      const { presignedUrl, assetId } = await presignRes.json()

      // Upload file
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })

      // Confirm upload
      await fetch(`/api/assets/confirm/${assetId}`, {
        method: 'POST'
      })

      // Add to assets list
      const newAsset: Asset = {
        id: assetId,
        filename: file.name,
        url: presignedUrl.split('?')[0], // Remove query params
        type: file.type.startsWith('image/') ? 'image' : 'sprite'
      }

      setAssets(prev => [...prev, newAsset])
    } catch (error) {
      console.error('Failed to upload asset:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-100 rounded">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTool('select')}
            className={`px-3 py-1 rounded text-sm ${
              tool === 'select' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
            }`}
            title="Select objects"
          >
            Select
          </button>
          <button
            onClick={() => setTool('add')}
            className={`px-3 py-1 rounded text-sm ${
              tool === 'add' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
            }`}
            title="Add objects"
          >
            Add
          </button>
          <button
            onClick={() => setTool('erase')}
            className={`px-3 py-1 rounded text-sm ${
              tool === 'erase' ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-200'
            }`}
            title="Erase objects"
          >
            Erase
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm">Type:</label>
          <select
            value={selectedObjectType}
            onChange={(e) => setSelectedObjectType(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
          >
            {objectTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-200 rounded"
            title="Zoom out"
          >
            -
          </button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-200 rounded"
            title="Zoom in"
          >
            +
          </button>
        </div>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-1 rounded text-sm ${
            showGrid ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-200'
          }`}
          title="Toggle grid"
        >
          Grid
        </button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <div ref={canvasRef} className="border-2 border-gray-300 rounded shadow-inner" />
        {selectedObject && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded shadow">
            <div className="text-sm font-semibold mb-1">Selected Object</div>
            <div className="text-xs space-y-1">
              <div>ID: {selectedObject}</div>
              <div>Type: {objects.find(o => o.id === selectedObject)?.type}</div>
              <div className="flex gap-1 mt-2">
                <button
                  onClick={handleDuplicate}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Duplicate
                </button>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Object List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Objects ({objects.length})</h4>
          <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
            {objects.length === 0 ? (
              <p className="text-gray-500 text-sm">No objects placed</p>
            ) : (
              <div className="space-y-1">
                {objects.map(obj => (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObject(obj.id)}
                    className={`p-2 rounded cursor-pointer text-sm border ${
                      obj.id === selectedObject
                        ? 'bg-blue-100 border-blue-300'
                        : 'hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{obj.type}</div>
                    <div className="text-xs text-gray-600">
                      ({obj.x}, {obj.y}) {obj.width}×{obj.height}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Assets ({assets.length})</h4>
          <div className="border rounded p-2 bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUploadAsset(file)
              }}
              className="text-sm mb-2"
            />
            <div className="max-h-32 overflow-y-auto">
              {assets.length === 0 ? (
                <p className="text-gray-500 text-sm">No assets uploaded</p>
              ) : (
                <div className="space-y-1">
                  {assets.map(asset => (
                    <div key={asset.id} className="flex items-center space-x-2 text-sm">
                      <img src={asset.url} alt={asset.filename} className="w-8 h-8 object-cover rounded" />
                      <span className="flex-1 truncate">{asset.filename}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}