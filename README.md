# CalculadHora

Calculadora de suma de horas en formato HH:MM, desarrollada con React + Vite + Material UI.

## Características

- Entrada rápida de horas en formato 4 dígitos (ej: 0015 → 00:15)
- Suma automática y resultado en formato HH:MM y decimal
- UI moderna con modo claro/oscuro
- Responsive y lista para móvil/escritorio

## Instalación local

```bash
pnpm install
pnpm dev
```

O con npm:

```bash
npm install
npm run dev
```

## Despliegue en Vercel

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. Ve a [vercel.com/import](https://vercel.com/import) y conecta tu repositorio.
3. Vercel detectará Vite automáticamente. El comando de build será:
   - `pnpm build` o `npm run build`
4. Elige la rama y despliega.

## Configuración recomendada para Vercel

- Framework: **Vite**
- Build Command: `pnpm build` (o `npm run build`)
- Output Directory: `dist`

## Personalización

- Puedes cambiar el nombre, colores y textos en `src/App.tsx`.
- El modo claro/oscuro se alterna con el botón en la esquina superior derecha.

## Licencia

MIT
