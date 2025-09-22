# 📌 Sistema de Asistencia (Frontend Only)

Mini sistema web para registrar y generar reportes de asistencias de alumnos.  
Este proyecto está enfocado en **aprender y practicar tecnologías frontend modernas** sin necesidad de backend.

---

## 🚀 Tecnologías utilizadas

- **Vite + React** → Entorno rápido y moderno para desarrollo en React.
- **TailwindCSS** → Estilos utilitarios y responsivos.
- **Librería de componentes** → HeadlessUI / Radix UI (para modales, menús, etc.).
- **Zustand** → Manejo de estado global simple y escalable.
- **IndexedDB con Dexie** → Persistencia local de datos (asistencias, alumnos).
- **papaparse** → Exportación de reportes a CSV.
- **pdf-lib / jsPDF** → Exportación de reportes a PDF.
- **Vitest + React Testing Library** → Pruebas unitarias y de integración.
- **Playwright** → Pruebas end-to-end (E2E).

---

## 📋 Requerimientos funcionales

1. Registrar la asistencia de **19 alumnos** ficticios durante **30 días**.
   - Cada día puede marcarse como **Presente (P)** o **Falta (F)**.
2. Al completar los 30 registros de un alumno:
   - Se genera un **reporte individual** con:
     - Número de asistencias ✅
     - Número de faltas ❌
     - Porcentaje de faltas
     - Estado: **Aprobado / Desaprobado**
3. Reporte general:
   - Lista de alumnos que completaron sus 30 registros.
   - Exportación a **CSV** y **PDF**.
4. Reglas de aprobación:
   - Un alumno solo puede tener como máximo **10% de faltas** (3/30).
   - Si supera el límite, aparece como **Desaprobado**.

---

## 📂 Estructura del proyecto

```bash
asistencia-app/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables (Button, Modal, etc.)
│   ├── pages/           # Vistas principales (Dashboard, Reportes, etc.)
│   ├── store/           # Estado global con Zustand
│   ├── db/              # Configuración de Dexie (IndexedDB)
│   ├── utils/           # Funciones helper (exportar CSV, PDF, etc.)
│   ├── tests/           # Pruebas unitarias
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```
