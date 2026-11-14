# Ottavio — soporte conversacional real

Ottavio queda únicamente como asistente del soporte. No controla ni anima el refrigerador.

## Qué hace el soporte

Ottavio conversa de forma abierta y mantiene el contexto para ayudar con decisiones de sabores, compras, ciudades, entregas, bolsa, checkout, pagos fallidos o pendientes, posibles cargos duplicados, problemas de la web y casos de devolución/reembolso. No inventa políticas ni afirma haber hecho un reembolso, cancelación o cambio si la web no le proporciona una herramienta real para hacerlo. Cuando un caso necesita intervención humana, recopila solo los datos útiles y explica el siguiente paso.

## IA real

Con `OPENAI_API_KEY` configurada, el servidor usa la Responses API de OpenAI y conserva hasta 20 mensajes recientes de la conversación para mantener referencias y seguimiento. La clave permanece en el servidor y no se expone al navegador.

El proyecto usa por defecto `gpt-5.6-luna`, un modelo disponible para la Responses API y con capacidades multilingües.

## Activar

1. Instala Node.js.
2. Define `OPENAI_API_KEY` en el entorno del servidor.
3. Opcionalmente define `OPENAI_MODEL`.
4. Ejecuta `npm start`.
5. Abre `http://localhost:3000`.

Sin API configurada, el fallback local sigue respondiendo a los casos básicos de soporte para que el chat no quede en blanco.
