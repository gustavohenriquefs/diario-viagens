import { zodResolver } from '@hookform/resolvers/zod';
import { AirplaneTakeoff } from '@phosphor-icons/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../contexts/auth.context';
import { auth } from '../../firebase';
import { ButtonPrimary } from '../../shared/components/buttons/button-primary';
import { Input } from '../../shared/components/inputs/input';

interface LoginInputs {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(schema),
  });

  const handleLogin: SubmitHandler<LoginInputs> = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = await user.getIdToken();
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        navigate('/home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [navigate, user]);

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <span className='flex-none flex justify-center text-steel-blue-700'>
            <AirplaneTakeoff size={64} />
          </span>
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
            <p className="">Não tem uma conta? <Link to="/sign-up" className="font-medium text-steel-blue-700 hover:text-steel-blue-900">Sign up</Link></p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-medium">Email</label>
              <Input id="email" type="email" required className="w-full mt-2" {...register('email')} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="font-medium">Password</label>
              <Input id="password" type="password" required className="w-full mt-2" {...register('password')} />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <ButtonPrimary label="Sign in" type="submit" />
          </form>
        </div>
      </div>
    </main>
  );
};
