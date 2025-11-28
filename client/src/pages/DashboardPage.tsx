import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authService } from '@/services/auth.service';
import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  LogOut,
  MapPin,
  Settings,
  Sun,
  Thermometer,
  User,
  Wind,
} from 'lucide-react';

interface DashboardPageProps {
  onLogout: () => void;
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  // Dados mockados para demonstração
  const currentWeather = {
    location: 'São Paulo, SP',
    temperature: 24,
    condition: 'Parcialmente nublado',
    feelsLike: 26,
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 5,
  };

  const forecast = [
    { day: 'Seg', high: 26, low: 18, icon: Sun, condition: 'Ensolarado' },
    { day: 'Ter', high: 24, low: 17, icon: Cloud, condition: 'Nublado' },
    { day: 'Qua', high: 22, low: 16, icon: CloudRain, condition: 'Chuva' },
    { day: 'Qui', high: 25, low: 18, icon: Sun, condition: 'Ensolarado' },
    { day: 'Sex', high: 27, low: 19, icon: Sun, condition: 'Ensolarado' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Weather App
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Previsão do tempo em tempo real
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white/95 backdrop-blur-md border-slate-200 shadow-xl dark:bg-slate-900/95 dark:border-slate-700"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem className="cursor-pointer text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:bg-slate-100 dark:focus:bg-slate-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:bg-slate-100 dark:focus:bg-slate-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:focus:text-red-300 dark:focus:bg-red-950/30"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Current Weather - Hero Card */}
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {currentWeather.location}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-light text-white">
                      {currentWeather.temperature}°
                    </span>
                    <span className="text-2xl font-light text-white/90">C</span>
                  </div>
                  <p className="text-lg text-white/90">
                    {currentWeather.condition}
                  </p>
                  <p className="text-sm text-white/80">
                    Sensação térmica {currentWeather.feelsLike}°C
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Cloud className="h-32 w-32 text-white/30" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-200 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:scale-105 cursor-pointer dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Umidade
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {currentWeather.humidity}%
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-500/20">
                    <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:scale-105 cursor-pointer dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Vento
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {currentWeather.windSpeed}
                      <span className="text-lg"> km/h</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-500/20">
                    <Wind className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:scale-105 cursor-pointer dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Visibilidade
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {currentWeather.visibility}
                      <span className="text-lg"> km</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-500/20">
                    <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:scale-105 cursor-pointer dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Índice UV
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {currentWeather.uvIndex}
                      <span className="text-lg"> /10</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-500/20">
                    <Thermometer className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5-Day Forecast */}
          <Card className="border-slate-200 bg-white backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">
                Previsão para 5 dias
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Acompanhe a previsão do tempo para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-5">
                {forecast.map((day, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center space-y-3 rounded-lg border border-slate-200 bg-white p-4 transition-all hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    onClick={() => {
                      // Placeholder para futura funcionalidade
                      console.log(`Clicou em ${day.day}`);
                    }}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {day.day}
                    </p>
                    <day.icon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {day.high}°
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {day.low}°
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {day.condition}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
