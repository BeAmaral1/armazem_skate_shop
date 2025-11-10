import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';

const ImageUploader = ({ onUpload, multiple = false, value = null, maxSize = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return false;
    }

    // Validar tamanho (em MB)
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      setError(`Imagem muito grande. Máximo: ${maxSize}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const uploadToCloudinary = async (file) => {
    // Configuração do Cloudinary (usar .env.local ou valores hardcoded)
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    // Se não configurou, avisar
    if (cloudName === 'demo' || uploadPreset === 'ml_default') {
      console.warn('⚠️ Cloudinary não configurado! Configure as variáveis de ambiente.');
      console.warn('📝 Veja o arquivo .env.cloudinary.example para instruções');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Erro no upload');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      throw new Error('Falha ao fazer upload da imagem');
    }
  };

  const handleFiles = async (files) => {
    const fileList = Array.from(files);

    if (!multiple && fileList.length > 1) {
      setError('Apenas uma imagem é permitida');
      return;
    }

    for (const file of fileList) {
      if (!validateFile(file)) {
        return;
      }
    }

    setUploading(true);
    setError('');

    try {
      if (multiple) {
        const urls = [];
        for (const file of fileList) {
          // Preview local
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(prev => prev ? [...prev, reader.result] : [reader.result]);
          };
          reader.readAsDataURL(file);

          // Upload para Cloudinary
          const url = await uploadToCloudinary(file);
          urls.push(url);
        }
        onUpload(urls);
      } else {
        const file = fileList[0];

        // Preview local
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload para Cloudinary
        const url = await uploadToCloudinary(file);
        onUpload(url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index = null) => {
    if (multiple && index !== null) {
      setPreview(prev => prev.filter((_, i) => i !== index));
      // Chamar onUpload com array atualizado
    } else {
      setPreview(null);
      onUpload(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {(!preview || multiple) && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-dark-600 bg-dark-50'
              : 'border-gray-300 hover:border-dark-600'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-3">
            {uploading ? (
              <>
                <Loader className="w-12 h-12 mx-auto text-dark-600 animate-spin" />
                <p className="text-sm text-gray-600">Fazendo upload...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Clique para selecionar ou arraste a imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF até {maxSize}MB
                    {multiple && ' (múltiplas imagens permitidas)'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {(Array.isArray(preview) ? preview : [preview]).map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(multiple ? index : null)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>Dica:</strong> As imagens serão otimizadas automaticamente. 
          Para melhor qualidade, use imagens de alta resolução.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
