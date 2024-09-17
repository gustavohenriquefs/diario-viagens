import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import { IcUpload } from '../../icons/ic-upload';

interface UploadFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const UploadFile = forwardRef<HTMLInputElement, UploadFileProps>(({ classNameContainer = '', files, className, onFilesChange, ...props }: UploadFileProps, ref) => {
  const [previews, setPreviews] = useState<{ url: string, file: File }[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files) {
      // Limitar a seleção de arquivos a 10
      const selectedFiles = Array.from(files).slice(0, 10);

      // Gerar as URLs de prévia e salvar os arquivos no estado
      const newPreviews = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setPreviews(newPreviews);
      onFilesChange(selectedFiles); // Chamar o callback com os arquivos selecionados
    }
  };

  const handleRemovePreview = (index: number) => {
    // Remover a imagem da prévia
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const initialPreviews = files?.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    })) ?? [];

    setPreviews(initialPreviews);
  }, [files]);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <label
        htmlFor="dropzone-file"
        className={`${classNameContainer} flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
      >
        <div className="flex items-center justify-center w-full h-full relative">
          {/* Ícone de Upload e Texto (somente se não houver prévias) */}
          {previews.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <IcUpload />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para fazer o upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (máximo de 2 arquivos)</p>
            </div>
          )}

          {previews.length > 0 && (
            <div className="flex space-x-4">
              {previews.map((preview, index) => (
                <div key={preview.url} className="relative">
                  <img src={preview.url} alt={`Foto do local`} className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          id="dropzone-file"
          type="file"
          className={`${className} hidden`}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          ref={ref}
          {...props}
        />
      </label>  
    </div>
  );
});