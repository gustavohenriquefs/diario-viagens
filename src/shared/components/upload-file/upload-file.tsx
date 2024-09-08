import { ChangeEvent, useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from "../../../firebase";
import { IcUpload } from '../icons/ic-upload';

interface UploadFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
}

export const UploadFile = ({ classNameContainer = '', className, ...props }: UploadFileProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Gerar a URL da imagem para exibição
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Configurar o upload do arquivo
      const fileRef = ref(storage, `uploads/${file.name}`);
      try {
        await uploadBytes(fileRef, file);
        console.log('Arquivo upado com sucesso:');
      } catch (error) {
        console.error('Ih, deu erro em upar:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className={`${classNameContainer} flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <IcUpload />
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para fazer o upload</span> ou arraste e solte</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" className={`${className} hidden`} onChange={handleFileChange} {...props} />
      </label>
      {preview && (
        <div className="mt-4 w-full flex justify-center">
          <img src={preview} alt="Prévia" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  );
};
