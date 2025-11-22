This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Manual QA de rutas protegidas

Verifica que las rutas protegidas redirigen a `/login` cuando no hay sesión activa:

1. Cierra sesión o borra la cookie `bia_session`.
2. Abre cada ruta en una ventana/guía nueva y confirma la redirección automática a `/login`:
   - `/analisis-bia`
   - `/estrategias-bia`
   - `/lista`
   - `/proceso-critico`
   - `/continuidad`
   - `/plan`
   - cualquier página bajo `/private/*`
3. Realiza una petición `GET` o `POST` a cualquier endpoint bajo `/api/*` (excepto `/api/auth/login` y `/api/auth/logout`) y valida que devuelve `401` cuando no hay sesión.
4. Inicia sesión y confirma que todas las rutas anteriores cargan el contenido esperado sin redirecciones.

Puedes repetir los pasos 2 y 3 para probar rutas nuevas que se añadan en el futuro.
