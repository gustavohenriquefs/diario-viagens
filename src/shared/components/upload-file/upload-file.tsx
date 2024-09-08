import { InputHTMLAttributes } from "react";
import { IcUpload } from "../icons/ic-upload";

interface UploadFileProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
}

export const UploadFile = ({ classNameContainer = '', className, ...props }: UploadFileProps) => {
  return <div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className={`${classNameContainer} flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}>
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <IcUpload />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
      </div>
      <input id="dropzone-file" type="file" className={`${className} hidden`}  {...props} />
    </label>
  </div>
}