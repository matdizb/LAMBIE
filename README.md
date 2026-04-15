StudyFlow - Backend proxy para Gemini API

Instrucciones rápidas:

1) Instalar dependencias

```bash
npm install
```

2) Crear `.env` a partir de `.env.example` y añadir tu `API_KEY` de Google

3) Iniciar servidor

```bash
npm start
```

4) Por defecto el backend escucha en `http://localhost:3000` y expone `/api/generate`.

Cliente (frontend):
- El `script.js` ya está preparado para usar el backend en `http://localhost:3000/api/generate`.
- Si alojas el backend en otra URL, actualiza `BACKEND_URL` en `script.js`.

Notas de seguridad:
- No subas tu `.env` a repositorios públicos.
- Para producción, usa secretos del proveedor o almacena la key en un vault.
