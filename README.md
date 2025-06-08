# Mi Gestión de Turnos

Una aplicación web moderna para la gestión eficiente de turnos y trabajos personales, desarrollada con React y nuevas tecnologias.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Descripción

Aplicación web completa diseñada para facilitar la administración de trabajos, turnos y estadísticas laborales personales. Con una interfaz moderna e intuitiva, permite organizar eficientemente el tiempo de trabajo y obtener insights sobre productividad. Cuenta con la capacidad de compartir tu trabajo y sus detalles a traves de multiplataformas.

## Funcionalidades

- **Dashboard**: Resumen general con estadísticas en tiempo real y accesos rápidos
- **Gestión de Trabajos**: Crear, editar y eliminar trabajos con colores personalizados
- **Calendario Interactivo**: Vista mensual con indicadores visuales de turnos por trabajo
- **Gestión de Turnos**: Registro y edición de turnos con asignación a trabajos específicos
- **Estadísticas**: Gráficos interactivos de productividad y análisis de tiempo por trabajo
- **Personalización**: Temas de colores y configuraciones de usuario

## Tecnologías

**Frontend**: React 18, Vite, React Router DOM, Tailwind CSS
**Animaciones**: Framer Motion, GSAP, Lucide React
**Estado**: React Context API, Local Storage, Custom Hooks
**Desarrollo**: ESLint, Prettier, Git, GitHub
**IA**: Claude Sonnet 4 (Anthropic) para desarrollo, arquitectura y refactorización

## Instalación

### Prerrequisitos
- Node.js (versión 16+)
- npm o yarn

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/MarcoCAVS18/gestor-turnos.git
cd gestion-turnos

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

### Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de construcción
npm run lint     # Ejecutar ESLint
```

## Estructura

```
src/
├── components/     # Componentes reutilizables
│   ├── calendar/  # Componentes del calendario
│   ├── forms/     # Formularios
│   ├── layout/    # Navegación y layout
│   ├── other/     # Loader y otros
│   └── ui/        # Componentes base
├── contexts/      # Contextos de React
├── hooks/         # Hooks personalizados
├── pages/         # Páginas principales
├── utils/         # Utilidades
└── styles/        # Estilos globales
```

## Desarrollador

**Marco Piermatei**
- GitHub: [@MarcoCAVS18](https://github.com/MarcoCAVS18)
- Email: marcopiermatei1@gmail.com