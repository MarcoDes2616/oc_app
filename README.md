# Club de Operaciones de Trading - Mobile App

[![Expo](https://img.shields.io/badge/expo-5.3.0-blue.svg)](https://expo.io/)

Aplicación móvil para gestión de señales de trading y operativas académicas.



1. Introducción
Aplicación móvil para estudiantes de trading que acompaña los planes operativos de la academia, proporcionando:

Señales de trading en tiempo real

Dashboard de rendimiento

Gestión de operaciones

Notificaciones personalizadas

Stack Tecnológico:

React Native 0.79.5

Expo SDK 53

Arquitectura basada en Context API

Navegación con React Navigation 7.x

2. Requisitos del Sistema
Node.js v16+
Expo CLI
Android Studio/Xcode (para desarrollo nativo)


3. Instalación
git clone [repo-url]
cd operationa-club
npm install
cp .env.example .env # Configurar variables
expo start

4. Estructura del Proyecto
/
├── assets/              # Recursos multimedia
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Gestión de estado global
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Configuración de rutas
│   ├── screens/         # Pantallas
│   ├── services/        # Lógica de negocio
│   │   └── axios.js     # Instancia Axios configurada
|   |   └── authService.js  # Servicio de autenticación  
│   └── utils/           # Helpers
├── .env                 # Variables de entorno
├── app.json             # Configuración Expo
└── eas.json             # Build EAS


5. Flujo de Autenticación
Diagrama de Secuencia:
Usuario solicita token vía email

Token válido por 30 minutos (primer uso)

Uso exitoso extiende validez a 7 días

Sesión se invalida al:

Solicitar nuevo token

Iniciar en otro dispositivo


6. Funcionalidades Clave
6.1 Módulo de Señales
Filtrado por proyectos activos (backend)

Refresh manual para nuevas señales

Filtros por estado: Las señales obtenidas se filtran por el estado de la señal para mejor visualización.

6.2 Dashboard de Trading
CRUD de libro de operaciones

Métricas clave:
const profitRatio = (totalProfit / totalOperations) * 100;

Gráficos de rendimiento (implementar con victory-native)

6.3 Notificaciones

sequenceDiagram
  Admin->>Backend: Crea señal
  Backend->>Expo: Push Notification
  Expo->>Dispositivos: Entrega notificación

Configuración en app.json:

"plugins": [
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#FF5733"
    }
  ]
]

7. Configuración de Entorno
Variables requeridas (.env):

EXPO_PUBLIC_API_PROD=https://api.produccion.com
EXPO_PUBLIC_API_LOCAL=http://localhost:3000


8. Deployment
Build para producción:
eas build -p android --profile production


Configuración EAS (eas.json):
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease",
        "buildType": "apk"
      }
    }
  }
}

9. Convenciones de Código
Componentes: PascalCase (SignalItems.jsx)

Hooks: prefijo use (useNotificactions.js)

Estilos: StyleSheet.create (no inline)

10. Troubleshooting
Problemas comunes:
Token inválido:

Verificar tiempo de expiración

Confirmar que no haya sesión activa en otro dispositivo

Notificaciones no llegan:
expo notifications:configure

Errores de build:
expo doctor
rm -rf node_modules && npm install