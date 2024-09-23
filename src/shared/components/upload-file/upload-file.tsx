import React, { ChangeEvent, useEffect, useState, forwardRef, useRef } from 'react';

interface UploadFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
  files?: File[]; // Torna opcional
  onFilesChange: (files: File[]) => void;
}

export const UploadFile = forwardRef<HTMLInputElement, UploadFileProps>(
  ({ classNameContainer = '', files = [], className, onFilesChange, ...props }: UploadFileProps, ref) => { // Define como array vazio por padrão
    const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles) {
        const selectedFilesArray = Array.from(selectedFiles).slice(0, 4);
        const newPreviews = selectedFilesArray.map((file) => ({
          url: URL.createObjectURL(file),
          file,
        }));

        // Atualiza os previews mantendo as imagens anteriores
        setPreviews((prev) => [...prev, ...newPreviews]);
        onFilesChange([...files, ...selectedFilesArray]); // Atualiza a lista de arquivos
      }
    };

    const handleRemovePreview = (index: number) => {
      const updatedPreviews = previews.filter((_, i) => i !== index);
      setPreviews(updatedPreviews);
      onFilesChange(updatedPreviews.map((preview) => preview.file)); // Atualiza a lista de arquivos ao remover
    };

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    useEffect(() => {
      const initialPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setPreviews(initialPreviews);
    }, []);

    return (
      <div className={classNameContainer + ' w-full'}> 
        <div
          className="cursor-pointer p-28 flex justify-center bg-white border border-gray-300 rounded-xl"
          onClick={handleClick}
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            className="hidden"
            {...props}
          />
          <div className="text-center">
            <span className="inline-flex justify-center items-center w-8 h-8 bg-gray-100 text-gray-800 rounded-full">
              <svg
                className="shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </span>
            <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
              <span className="pe-1 font-medium text-gray-800">Arraste suas imagens aqui ou</span>
              <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline">
                browse
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Escolha até 4 imagens.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-solid border-gray-300 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-x-3">
                <img className="rounded-lg w-16 h-16 object-cover" src={preview.url} alt={`Preview ${index}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{preview.file.name}</p>
                  <p className="text-xs text-gray-500">{Math.round(preview.file.size / 1024)} KB</p>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800"
                onClick={() => handleRemovePreview(index)}
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default UploadFile;
