import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { Cloud, CloudRain, Sun, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      
      // Salva usuário no localStorage (apenas dados, não token)
      authService.saveUser(response.user);
      onLoginSuccess();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || 'Erro ao autenticar');
      } else {
        setError('Erro ao autenticar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <Sun className="h-32 w-32 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Cloud className="h-40 w-40 text-blue-400 animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-10">
          <CloudRain className="h-24 w-24 text-blue-300" />
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 border border-slate-200 shadow-2xl bg-white dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="space-y-4 pb-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Cloud className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              Weather App
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-300">
              {isLogin
                ? 'Entre para acessar sua previsão personalizada'
                : 'Crie sua conta e comece a usar'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-900 dark:text-slate-200"
                >
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                  className="h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-900 dark:text-slate-200"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-900 dark:text-slate-200"
              >
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
                className="h-11 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {!isLogin && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-300 p-3 dark:bg-red-950/50 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-2 text-slate-600 dark:text-slate-300 font-medium">
                ou
              </span>
            </div>
          </div>

          {/* Toggle Mode Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              disabled={loading}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? (
                <>
                  Não tem uma conta?{' '}
                  <span className="underline font-semibold">Criar conta</span>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <span className="underline font-semibold">Entrar</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-slate-300 dark:border-slate-600">
            <p className="text-xs text-center text-slate-600 dark:text-slate-300">
              Ao continuar, você concorda com nossos{' '}
              <button className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                Termos de Uso
              </button>{' '}
              e{' '}
              <button className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                Política de Privacidade
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-0 right-0 text-center px-4">
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          © 2024 Weather App. Previsão do tempo em tempo real.
        </p>
      </div>
    </div>
  );
}
