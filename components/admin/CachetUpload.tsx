'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface CachetUploadProps {
  currentCachetUrl?: string | null
  onUploadSuccess: (cachetUrl: string) => void
  onDeleteSuccess: () => void
}

const CachetUpload: React.FC<CachetUploadProps> = ({
  currentCachetUrl,
  onUploadSuccess,
  onDeleteSuccess
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Type de fichier non autorisé. Utilisez PNG, JPG ou JPEG.'
    }

    if (file.size > maxSize) {
      return 'Fichier trop volumineux. Taille maximale: 5MB.'
    }

    return null
  }

  const handleFileUpload = async (file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('cachet', file)

      const response = await fetch('/api/settings/cachet', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'upload')
      }

      onUploadSuccess(result.cachetUrl)
    } catch (error) {
      console.error('Erreur upload:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/settings/cachet', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }

      onDeleteSuccess()
    } catch (error) {
      console.error('Erreur suppression:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={20} />
          Cachet d'entreprise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {currentCachetUrl ? (
          <div className="space-y-4">
            <div className="relative w-48 h-32 mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={currentCachetUrl}
                alt="Cachet d'entreprise"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={openFileDialog}
                disabled={isUploading}
                variant="outline"
              >
                <Upload className="mr-2" size={16} />
                Remplacer
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
              >
                <X className="mr-2" size={16} />
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-4">
              Glissez-déposez votre cachet ici ou cliquez pour sélectionner
            </p>
            <Button
              onClick={openFileDialog}
              disabled={isUploading}
            >
              <Upload className="mr-2" size={16} />
              {isUploading ? 'Upload en cours...' : 'Sélectionner un fichier'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG ou JPEG - Taille max: 5MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}

export default CachetUpload
