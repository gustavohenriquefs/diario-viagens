import { FC } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ButtonPrimary } from '../../shared/components/buttons/button-primary';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { travelDiaryToast } from '../../contexts/message.context';
import { Input } from '../../shared/components/inputs/input';
import { Link } from 'react-router-dom';
import { AirplaneTakeoff } from '@phosphor-icons/react';

const schema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must have at least 6 characters' }),
});

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
}

export const SignUp: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
    resolver: zodResolver(schema),
  });

  const { showToast } = travelDiaryToast();

  const handleCreateAccount = async (data: SignUpFormInputs) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        showToast('Conta criada com sucesso!', 'success');
      })
      .catch((error) => {
        console.error(error, errors);
        showToast('Não foi possível criar conta! Tente novamente mais tarde...', 'error');
      });
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <div className="flex justify-center text-steel-blue-700">
              <AirplaneTakeoff size={64} />
            </div>
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Criar nova conta</h3>
            <p className='flex items-center gap-2'>
              Já tem uma conta?
              <Link to="/login" className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
          <form onSubmit={handleSubmit(handleCreateAccount)} className="space-y-5">
            <div>
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <Input
                type="text"
                id="name"
                required
                className="w-full"
                className="w-full"
                {...register('name')}
              />
            </div>
            <div>
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <Input
              <Input
                type="email"
                id="email"
                required
                className="w-full"
                className="w-full"
                {...register('email')}
              />
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                Senha
                Senha
              </label>
              <Input
              <Input
                type="password"
                id="password"
                required
                {...register('password')}
                className="w-full"
                className="w-full"
              />
            </div>


            <ButtonPrimary
              label="Criar conta"
              type="submit"
            />
          </form>
        </div>
      </div>
    </main>
  );
};
