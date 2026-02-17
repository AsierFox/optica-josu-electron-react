# App Electron Óptica Josu - Sistema de Gestión

Aplicación de escritorio desarrollada con **Electron** y **React** diseñada para la gestión integral de inventario y generación de presupuestos.

## 🚀 Características

* **Panel de Inventario**: Gestión de productos con edición en línea (Inline Editing) y validación de campos.
* **Filtros Avanzados**: Filtrado dinámico por Proveedor y Firma con búsqueda inteligente.
* **Generación de PDF**: Creación de presupuestos profesionales con cálculos de IVA automatizados mediante `jsPDF` y `html2canvas`.
* **Arquitectura Segura**: Separación de procesos (Main/Renderer) utilizando `contextBridge` e IPC para la comunicación con MySQL.
* **Interfaz Moderna**: Basada en **Ant Design** para una experiencia de usuario fluida y profesional.

## 🛠️ Tecnologías

* **Core**: [Electron](https://www.electronjs.org/), [React.js](https://reactjs.org/)
* **UI**: Ant Design (Icons & Components)
* **Base de Datos**: MySQL
* **Manejo de Fechas**: Day.js
* **Documentación**: jsPDF & html2canvas

## 📂 Estructura del Proyecto

```text
src/
├── main/             # Proceso Principal (Electron, IPC, MySQL)
│   ├── models/       # Modelos de datos (TypeScript interfaces)
│   └── db/           # Conexión y queries a la base de datos
└── renderer/         # Proceso de Renderizado (React)
    ├── components/   # Componentes hijos (Tablas, Stats, Celdas editables)
    ├── pages/        # Vistas principales (Stock, Presupuestos)
    └── layouts/      # Estructuras de navegación (AdminLayout)
