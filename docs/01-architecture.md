
3. **Contenido para cada archivo** (ejemplo en `/docs/01-architecture.md`):
````markdown
# Arquitectura de la Aplicación

## Diagrama de Componentes
![Diagrama](assets/architecture-diagram.png)

## Estructura de Carpetas
```bash
src/
├── context/           # Lógica de estado global
│   ├── AppContext.js # Autenticación
│   └── DataContext.js # Gestión de señales
├── services/
│   └── axios.js         # Configuración Axios