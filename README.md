# Oh! Qué Postre — Web estilo App

## Abrir para pruebas
1. Descomprime el ZIP.
2. Abre `index.html` con doble clic, o súbelo a un hosting estático.
3. Para una prueba más parecida a producción puedes usar VS Code + Live Server.

## Incluido
- Diseño responsive móvil primero.
- Diseño de escritorio ampliado.
- Las 7 latas originales de 350 ml.
- Precios acordados: Pay de Limón $85, Tres Leches $85, Cheesecake $90, Ferrero $95, Fresa con Crema $90, Maracuyá $90, Oreo $90.
- Refrigerador visual con las 7 latas.
- Arrastrar/tocar lata hacia el porta vasos original.
- Carrito funcional con cantidades y subtotal.
- Reproductor real de `Vicio 2`.
- Artista: Flow 3D Ink.
- Burbuja intermitente de MODO DE PRUEBA.
- Sección de IA soporte de prueba.
- Sección Merch.
- Preparado visualmente para Stripe y PayPal.

## Pagos
Todavía NO hay cobro real porque faltan las claves públicas/secretas y la configuración de tus cuentas Stripe/PayPal. No pongas claves secretas directamente en `app.js` ni en `index.html`; el cobro real debe usar un backend o funciones serverless.

## Merch oficial — actualización final
Se usan exactamente los PNG transparentes proporcionados por el usuario, sin borrar ni modificar las partes blancas de los productos.
- Gorra oficial: $350.00
- Delantal oficial: $349.00
- Pin oficial: $120.00
- Vaso oficial: $475.00


ACTUALIZACIÓN FINAL: Merch en columna con bolsa lateral en PC, bolsa visible arriba y sticky en celular. Arrastre optimizado con Pointer Events para mouse y pantallas táctiles. La música Vicio 2 guarda posición/estado al cambiar entre Inicio y Merch e intenta continuar automáticamente.
