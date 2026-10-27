# Teleprompter

Teleprompter web ligero: una pestaña con el texto pegada arriba al centro, justo debajo de la cámara, y el panel de configuración debajo. Guarda tu guion y tus ajustes en el navegador.

Stack: React 18, Vite, Tailwind CSS 4 y framer-motion (cargado con LazyMotion para que pese poco).

## Levantarlo en VS Code

Necesitás Node.js 18 o superior (`node -v` para revisar).

1. Descomprimí el zip. En PowerShell: `Expand-Archive pf-teleprompter.zip .`
2. Entrá a la carpeta y abrila en VS Code: `cd pf-teleprompter` y después `code .`
3. Abrí la terminal integrada de VS Code y corré:

```
npm install
npm run dev
```

4. Abrí http://localhost:5173

## Build de producción

```
npm run build
npm run preview
```

El resultado queda en `dist/`.

## Deploy en Vercel

Opción A, con GitHub:

1. Subí la carpeta a un repo nuevo (`git init`, `git add .`, `git commit -m "teleprompter"`, `git push`).
2. En vercel.com elegí Add New, Project, e importá el repo.
3. Vercel detecta Vite solo. No cambies nada y apretá Deploy.

Opción B, desde la terminal:

```
npx vercel
npx vercel --prod
```

## Uso

- Pegá tu guion en el cuadro Guion.
- Espacio inicia o pausa. Flecha arriba y abajo cambian la velocidad. R reinicia.
- La rueda del mouse mueve el texto sobre la pestaña.
- Pantalla completa funciona en la URL desplegada. Si el navegador lo bloquea, usá F11.

## Personalizar

- Colores y temas: variables al inicio de `src/index.css`.
- Texto de ejemplo y valores por defecto: `src/App.jsx`.
- Olas y grilla: `src/components/Waves.jsx` y `src/index.css`.
- Tipografías: el proyecto usa fuentes del sistema para no descargar nada.

## Compartir en LinkedIn

Pegá la URL de Vercel en un post. Para que la vista previa muestre una imagen, subí una de 1200x627 a `public/` y agregá en `index.html`:

```
<meta property="og:image" content="https://TU-DOMINIO/og.png" />
```
