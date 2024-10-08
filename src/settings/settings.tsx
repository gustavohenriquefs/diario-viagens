import React, { useState } from 'react';
import { getDownloadURL, ref, StorageReference, uploadBytesResumable } from 'firebase/storage';
import { storage, auth } from '../firebase';
import { updateProfile, User } from 'firebase/auth';
import { Upload } from '@phosphor-icons/react/dist/ssr';
import { travelDiaryToast } from '../contexts/message.context';
import { ButtonPrimary } from '../shared/components/buttons/button-primary';

export const Setting: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const { showToast } = travelDiaryToast();

  const user = auth.currentUser;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage || !user) return;

    setUploading(true);

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      () => {
        showToast('Não foi possível realizar upload! Verifique as informações e tente novamente mais tarde.', 'error');
        setUploading(false);
      },
      () => {
        updateUserProfile(user, uploadTask.snapshot.ref)
          .then(() => {
            setUploading(false);
            showToast('Perfil atualizado com sucesso!', 'success');
          })
          .catch(() => {
            showToast('Não foi possível realizar upload! Verifique as informações e tente novamente mais tarde.', 'error');
            setUploading(false);
          });
      });
  };

  const updateUserProfile = async (user: User, ref: StorageReference) => {
    const downloadURL = await getDownloadURL(ref);
    updateProfile(user, { photoURL: downloadURL })
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Alterar imagem de perfil</h2>

      <div className="relative group mb-4">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <label
          htmlFor="image"
          className="w-32 h-32 bg-gray-800 bg-opacity-50 text-white rounded-full cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          <Upload size={32} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image"
          />
        </label>
      </div>

      <ButtonPrimary
        onClick={handleSubmit}
        disabled={uploading}
        label={uploading ? 'Uploading...' : 'Salvar imagem'}
      />
    </div>
  );
};
