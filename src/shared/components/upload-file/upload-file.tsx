import { ChangeEvent, useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from "../../../firebase";
import { IcUpload } from '../icons/ic-upload';

interface UploadFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
}

export const UploadFile = ({ classNameContainer = '', className, ...props }: UploadFileProps) => {
  const [previews, setPreviews] = useState<{ url: string, file: File }[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Limitar a seleção de arquivos a 2
      const selectedFiles = Array.from(files).slice(0, 2);

      // Gerar as URLs de prévia e salvar os arquivos no estado
      const newPreviews = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setPreviews(newPreviews);
    }
  };

  const handleRemovePreview = (index: number) => {
    // Remover a imagem da prévia
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (previews.length > 0) {
      for (const preview of previews) {
        const fileRef = ref(storage, `uploads/${preview.file.name}`);
        try {
          await uploadBytes(fileRef, preview.file);
          console.log('Arquivo upado com sucesso:', preview.file.name);
        } catch (error) {
          console.error('Erro ao upar o arquivo:', preview.file.name, error);
        }
      }
    }
  };

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

          {/* Mostrar as prévias das imagens */}
          {previews.length > 0 && (
            <div className="flex space-x-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview.url} alt={`Prévia ${index + 1}`} className="w-32 h-32 object-cover rounded-lg" />
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
          {...props}
          multiple
          accept="image/*"
        />
      </label>
    </div>
  );
};
