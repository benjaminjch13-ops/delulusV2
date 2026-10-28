# Delulu Journal V2 ✦

Versión completa: editor de libretas digitales + pedidos de libretas de cuero. La tienda publicada (solo pedidos) vive en el repositorio `delulusjournal`.

Soñá. Planeá. Repetí.

Página web de **Delulu Journal by Ensso** ([@delulu.journal](https://www.instagram.com/delulu.journal/)): libretas de cuero hechas a mano en Guatemala.

En la página la gente puede:

- **Diseñar libretas digitales**: portada de cuero en 3D (solapa, remaches, elástico, charm, iniciales), páginas libres con fotos, texto, stickers, cintas y plantillas, y hojearlas pasando las páginas con el dedo o el mouse.
- **Pedir su libreta de cuero** en 4 pasos (tamaño, color del cuero, elástico y charm) y mandar el pedido por DM a Instagram. Enlace directo: `/#pedir`.
- Exportar a PDF, imágenes o página web, y guardar copias. Todo se guarda en el navegador de cada persona.

## Cómo está hecho

Sin frameworks: HTML, CSS y JavaScript que se juntan en un solo archivo.

```
src/head.html      fuentes y título
src/body.html      estructura de pantallas e íconos
src/styles.css     todos los estilos
src/js/*.js        la app, por módulos (se cargan en orden por nombre)
  05-brand.js      marca: colores, logo, tamaños, cueros, elásticos y charms del pedido
  95-order.js      el flujo "Pedí tu libreta"
build.mjs          junta todo en dist/index.html (minificado)
```

Para cambiar los colores de elástico, charms o el usuario de Instagram, editá `src/js/05-brand.js`.

## Correr y publicar

```bash
npm install
npm run build      # crea dist/index.html
npm run dev        # versión sin minificar en http://localhost:3000
```

Vercel usa `vercel.json`: corre `npm run build` y publica la carpeta `dist`.
