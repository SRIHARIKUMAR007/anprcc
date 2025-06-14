
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye } from "lucide-react";

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

const LiveWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const initializeWeather = () => {
      const tamilNaduWeather: WeatherData[] = [
        {
          city: 'Chennai',
          temperature: 32,
          humidity: 78,
          windSpeed: 15,
          visibility: 8.5,
          condition: 'cloudy',
          description: 'Partly cloudy with sea breeze',
          impact: 'low'
        },
        {
          city: 'Coimbatore',
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          condition: 'sunny',
          description: 'Clear and pleasant',
          impact: 'low'
        },
        {
          city: 'Madurai',
          temperature: 35,
          humidity: 55,
          windSpeed: 8,
          visibility: 9,
          condition: 'sunny',
          description: 'Hot and dry',
          impact: 'medium'
        },
        {
          city: 'Salem',
          temperature: 26,
          humidity: 85,
          windSpeed: 18,
          visibility: 6,
          condition: 'rainy',
          description: 'Light rain affecting traffic',
          impact: 'high'
        }
      ];
      
      setWeatherData(tamilNaduWeather);
    };

    initializeWeather();
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setWeatherData(prev => prev.map(weather => ({
        ...weather,
        temperature: Math.max(20, Math.min(40, weather.temperature + Math.floor(Math.random() * 4 - 2))),
        humidity: Math.max(40, Math.min(95, weather.humidity + Math.floor(Math.random() * 10 - 5))),
        windSpeed: Math.max(5, Math.min(25, weather.windSpeed + Math.floor(Math.random() * 6 - 3))),
        visibility: Math.max(2, Math.min(15, weather.visibility + Math.random() * 2 - 1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Live Weather Impact
          </span>
          <Badge variant="secondary" className={`${isLive ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {isLive ? 'LIVE' : 'STATIC'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weatherData.map((weather) => (
            <div key={weather.city} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(weather.condition)}
                  <span className="font-semibold text-white">{weather.city}</span>
                </div>
                <Badge variant="secondary" className={getImpactColor(weather.impact)}>
                  {weather.impact.toUpperCase()} Impact
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-slate-300">{weather.description}</div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-slate-300">{weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-slate-300">{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-slate-300">{weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-slate-300">{weather.visibility.toFixed(1)} km</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveWeatherWidget;
