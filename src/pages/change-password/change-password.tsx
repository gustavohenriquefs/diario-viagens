import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, User } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/auth.context';
import { travelDiaryToast } from '../../contexts/message.context';
import { ButtonPrimary } from '../../shared/components/buttons/button-primary';
import { Input } from '../../shared/components/inputs/input';

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const currentUser = auth.user as User;
  const { showToast } = travelDiaryToast();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    if (currentUser) {
      try {
        await updatePassword(currentUser, data.newPassword);
        showToast('Senha atualizada com sucesso', 'success');
        reset();
      } catch (error) {
        if (error instanceof Error && (error as any).code === 'auth/requires-recent-login') {
          const email = currentUser.email;
          const password = data.currentPassword;
          if (password) {
            const credential = EmailAuthProvider.credential(email ?? '', password);
            try {
              await reauthenticateWithCredential(currentUser, credential);
              await updatePassword(currentUser, data.newPassword);
              showToast('Senha atualizada com sucesso', 'success');
              reset();
            } catch (reauthError) {
              showToast('Senha atual inválida! Por favor, tente novamente.', 'error');
            }
          } else {
            showToast('Re-autenticação cancelada.', 'error');
          }
        } else {
          showToast('Não foi possível atualizar senha! Tente novamente mais tarde.', 'error');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Alterar senha</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              Senha atual
            </label>
            <Input
              id="currentPassword"
              type="password"
              className={`w-full ${errors.currentPassword ? 'border-red-500' : ''}`}
              placeholder="Digite a senha atual"
              {...register('currentPassword', {
                required: 'Senha atual é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })
              }
            />
            {errors.currentPassword && <p className="text-red-500 text-xs italic">{errors.currentPassword.message}</p>}
          </div>

          <hr className='mb-3' />
          {/* New Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              Nova senha
            </label>
            <Input
              id="newPassword"
              type="password"
              className={`w-full ${errors.newPassword ? 'border-red-500' : ''}`}
              placeholder="Digite a nova senha"
              {...register('newPassword', { required: 'Nova senha é obrigatória', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />
            {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmar nova senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirmar nova senha"
              {...register('confirmPassword', {
                required: 'Por favor, confirme a nova senha',
                validate: (value) => value === watch('newPassword') || 'As senhas não coincidem',
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <ButtonPrimary
              type="submit"
              disabled={loading}
              label={loading ? 'Atualizando...' : 'Alterar senha'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
