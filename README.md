# App de Gestión de Inventarios Móvil para PYMES

## Descripción
Aplicación móvil desarrollada con React Native para la gestión de inventarios de pequeñas y medianas empresas. Permite controlar productos, categorías y usuarios, con funcionalidades de alta, baja, modificación, seguimiento de stock y códigos QR. La app integra alertas y control de roles para usuarios administrativos.

## Tecnologías
- Frontend: React Native, Hooks, Context API
- Backend: Node.js, Express.js
- Base de datos: MongoDB / PostgreSQL
- Autenticación: JWT (JSON Web Tokens)
- Encriptación: Bcrypt para contraseñas y datos críticos
- Navegación: Drawer Navigator + Top Tab Navigator
- Iconos: React Native Vector Icons
- Organización de tareas: KANBAN con Trello / GitHub Projects

## Requisitos
- Node.js >= 18
- npm >= 9
- Expo CLI

## Instalación

### Backend
1. Ir al directorio backend:
   cd backend
2. Instalar dependencias:
   npm install
3. Configurar variables de entorno (.env):
   PORT=5000
   DB_URI=<TU_URI_DE_BASE_DE_DATOS>
   JWT_SECRET=<TU_SECRET_KEY>
4. Iniciar servidor:
   npm start

### Frontend
1. Ir al directorio frontend:
   cd frontend
2. Instalar dependencias:
   npm install
3. Iniciar la app:
   npx expo start
4. Escanear el QR con Expo Go en tu dispositivo móvil.

## Funcionalidades
- Gestión de productos (alta, baja, modificación)
- Gestión de categorías y usuarios
- Seguimiento de stock con alertas
- Escáner de códigos QR para identificar productos
- Roles de usuario con control de acceso
- Encriptación de contraseñas y datos críticos
- Navegación mediante Drawer + Top Navigator
- Iconos y UI intuitiva
- Estado local para inputs y alertas
- Estado global para usuarios, productos y categorías
- Hooks propios para validaciones y generación de QR

## Endpoints Principales (Backend)
| Ruta | Método | Descripción |
|------|--------|-------------|
| /api/auth/login | POST | Iniciar sesión |
| /api/users | GET | Listar usuarios |
| /api/products | GET/POST/PUT/DELETE | Gestión de productos |
| /api/categories | GET/POST/PUT/DELETE | Gestión de categorías |

(Reemplaza con tus endpoints reales si son diferentes)

## KANBAN
El proyecto se organizó mediante Trello/GitHub Projects, siguiendo metodología KANBAN:
- Backlog: Ideas y funcionalidades pendientes
- To Do: Tareas planificadas
- In Progress: Tareas en desarrollo
- Done: Tareas completadas

## Capturas de Pantalla
(Reemplaza con tus imágenes reales)
- Pantalla principal con Drawer Navigator
- Top Tab Navigator con categorías
- Lista de productos y alertas de stock
- Escáner QR funcionando

## Autor
Angel Castillo  
Semestre: 3  
Proyecto: Actividad 6 – Desarrollo de Apps Móviles
