---
title: "Autocompletado con IA: por qué mantenemos el paso de confirmación"
description: "El escáner de Claimly rellena todo con IA y aun así pide confirmar. La regla que usamos para decidir cuándo una función con IA necesita revisión."
app: Claimly
category: Product
translationKey: "ai-autofill-confirmation-step"
publishedAt: "2026-07-12"
author: "FusionCore Apps"
tags: ["ux con ia", "producto", "claimly", "ocr", "human in the loop"]
ogImage: "/images/blog/es/ai-autofill-confirmation-step.png"
featured: false
faq:
  - question: "¿Una función de autocompletado con IA debería guardar sola?"
    answer: "Depende de cuándo se vuelve visible el error. Si la persona nota el valor equivocado al instante y lo corrige con un toque, guardar automáticamente está bien. Si el error queda oculto hasta que cuesta algo —un plazo vencido, un pago mal hecho—, conviene mantener el paso de confirmación."
  - question: "¿Qué significa human-in-the-loop en una app móvil?"
    answer: "Que la IA propone y la persona confirma. El modelo extrae o genera los valores, la interfaz los muestra como borrador, y no se escribe nada en el almacenamiento hasta que el usuario aprueba. La última decisión sigue siendo humana."
  - question: "¿Qué tan preciso es el escaneo de recibos con IA?"
    answer: "Lo bastante preciso para evitar casi toda la escritura manual, no lo bastante para confiar a ciegas. Los fallos que se repiten son estructurales: un total que en realidad es un subtotal, un formato de fecha ambiguo, un encabezado con la razón social en vez de la marca, y tinta térmica ya borrada."
  - question: "¿Cómo se muestra qué campos rellenó la IA?"
    answer: "Marcando de forma visible los valores que vienen del modelo, permitiendo editar cada campo en el mismo lugar y sin ocultar nunca el documento original. En Claimly el recibo escaneado queda en pantalla junto a los campos, para comparar en vez de confiar."
  - question: "¿El paso de confirmación no perjudica la conversión?"
    answer: "Agrega una pantalla, así que cuesta algo. Ese costo se acepta solo cuando el error es caro y silencioso. Para salidas de IA de bajo riesgo, como una lista de compras generada, no ponemos ninguna barrera."
---

Claimly escanea un recibo, lo manda a un modelo y vuelve con el nombre del producto, la tienda, la fecha de compra y el total ya rellenados. El paso obvio sería guardarlo: escanear existe justamente para no escribir. No lo guardamos. La app muestra los valores extraídos en una pantalla de revisión y espera la confirmación de la persona.

Parece un toque desperdiciado, y la pregunta aparece seguido. La respuesta corta: el paso de confirmación no está ahí por desconfianza en el modelo. Está ahí por **cuándo** se vuelve visible un error en esta función concreta.

## La regla: la confirmación se paga según cuándo aparece el error

Casi todo el consejo sobre funciones con IA empieza por la confianza del modelo: mostrar un score, aceptar automáticamente por encima de un umbral, preguntar por debajo. Es tentador y, según nuestra experiencia, es la pregunta equivocada para empezar. La confianza del modelo dice qué tan seguro está el modelo. No dice nada sobre lo que cuesta un valor incorrecto.

La pregunta que hacemos en su lugar es: **si este valor está mal, ¿cuándo se entera el usuario?**

- **Al instante, y corregirlo es un toque.** Sin barrera. La propia interfaz es la corrección de errores.
- **Más tarde, y con un costo real.** Con barrera. Un error silencioso que aparece dentro de seis meses no es una molestia de UX: es el fracaso completo de la función.

Una garantía es el segundo caso, y una versión especialmente cruel de él. Una fecha de compra desplazada un mes produce una app que se ve perfectamente correcta: el producto está listado, la cuenta regresiva corre, la alerta se dispara. Se dispara el día equivocado. La persona se entera cuando llega a la tienda con el plazo de reclamo vencido, es decir, exactamente el escenario que la app venía a evitar. La app no falló con ruido. Falló con buenos modales, meses después, y muy segura de sí misma.

Esa asimetría es todo el argumento. La confirmación cuesta un toque ahora. Saltarla cuesta la única promesa del producto, después, de una forma que ya no se puede depurar.

## Qué se rompe de verdad en el OCR de recibos

Extraer ya no es la parte difícil. Los fallos que vemos son estructurales, y son justo los que un modelo puede equivocar sonando completamente seguro:

- **El total que no es el total.** Los recibos imprimen subtotales, impuestos, descuentos, ajustes de fidelidad y el efectivo entregado. Varios de esos números son "totales" plausibles, y el más grande de la hoja suele ser el equivocado.
- **Fechas sin locale.** `03/04/2026` es un día distinto según el país que lo imprimió. El recibo casi nunca aclara cuál.
- **El nombre de tienda que es una razón social.** El encabezado suele traer la empresa registrada, no la marca que la persona reconoce. No está mal, pero no es lo que va a buscar después.
- **Papel térmico ya borrado.** Muchos recibos se escanean semanas después de la compra, desde un papel que estuvo en la billetera. Hay líneas que directamente desaparecieron.
- **Recibos con varios artículos.** Un recibo, varios productos, y solo uno merece seguimiento de garantía. Eso es una decisión, no una extracción.

Ninguno se arregla con un prompt mejor, porque el último ni siquiera es un problema de extracción: es la intención del usuario. Solo la persona sabe cuál de los once artículos del ticket es el taladro que le importa.

## Cómo está construida la pantalla de revisión

El diseño sale de la regla, no de una librería de patrones:

- **El recibo se queda en pantalla.** La imagen escaneada acompaña a los campos, para comparar en vez de confiar. Verificar sin el documento original es teatro.
- **Todos los campos se editan en el sitio.** Sin modal, sin un segundo flujo. Corregir una fecha mal leída tiene que ser más barato que volver a escanear.
- **Los valores de la IA se ven como valores de la IA.** La persona necesita saber qué vino del modelo y qué puso ella.
- **Solo confirmar escribe.** No hay guardado parcial a espaldas del usuario. Hasta que no confirma, no existe nada en su inventario.

El objetivo no es que la persona audite el recibo. Es que una sola mirada honesta alcance. Si la pantalla de revisión está bien hecha, confirmar es un reflejo y corregir es posible: esa es toda la diferencia entre un rastreador de garantías que funciona y uno que miente.

[DATO: porcentaje de escaneos en los que el usuario edita al menos un campo en la pantalla de revisión — vale la pena medirlo; si es casi cero, la barrera está sobredimensionada y debería encogerse a una microconfirmación]

## Dónde sí quitamos la barrera: CartWise

El mismo estudio publica la decisión contraria. En el [generador de listas con IA de CartWise](/es/blog/ai-grocery-list-generator), la persona describe una ocasión y la IA escribe la lista completa. No hay pantalla de revisión. La lista aparece, ya usable, dentro del carrito.

Misma empresa, mismo instinto sobre la IA, resultado opuesto, porque la economía del error se invierte. Un artículo equivocado en una lista de compras se ve en el segundo en que aparece, está al lado de un botón de borrar, y no cuesta nada si sobrevive hasta el supermercado. No hay costo diferido, así que una barrera de confirmación sería fricción pura sin nada del otro lado del intercambio.

Eso es la regla funcionando bien. El patrón no es "confirmar siempre" ni "no confirmar nunca". El patrón es: **la barrera va donde el error es caro y callado.**

## Para llevarse

- El paso de confirmación se decide por el costo y la demora del error, no por la confianza del modelo.
- Los fallos silenciosos y diferidos son los que matan una app de utilidad: destruyen la única razón por la que existe.
- Si se mantiene la barrera, hay que ganársela: mostrar la fuente, permitir edición en el sitio y lograr que confirmar sea un reflejo.
- Si el error es inmediato y barato de arreglar, la interfaz *es* la revisión. No agregar una pantalla para eso.

El escáner de [Claimly](/es/apps/claimly-receipt-tracker) hace el trabajo de escribir. La decisión sigue siendo de la persona, y para una función cuyo único trabajo es tener razón sobre una fecha dentro de seis meses, esa no es fricción que convenga eliminar. La versión para usuarios, con el escáner y el seguimiento de garantías en conjunto, está en el [anuncio de Claimly en Google Play](/es/blog/claimly-ya-disponible-google-play).

## Preguntas frecuentes

### ¿Una función de autocompletado con IA debería guardar sola?

Depende de cuándo se vuelve visible el error. Si la persona nota el valor equivocado al instante y lo corrige con un toque, guardar automáticamente está bien. Si el error queda oculto hasta que cuesta algo —un plazo vencido, un pago mal hecho—, conviene mantener el paso de confirmación.

### ¿Qué significa human-in-the-loop en una app móvil?

Que la IA propone y la persona confirma. El modelo extrae o genera los valores, la interfaz los muestra como borrador, y no se escribe nada en el almacenamiento hasta que el usuario aprueba. La última decisión sigue siendo humana.

### ¿Qué tan preciso es el escaneo de recibos con IA?

Lo bastante preciso para evitar casi toda la escritura manual, no lo bastante para confiar a ciegas. Los fallos que se repiten son estructurales: un total que en realidad es un subtotal, un formato de fecha ambiguo, un encabezado con la razón social en vez de la marca, y tinta térmica ya borrada.

### ¿Cómo se muestra qué campos rellenó la IA?

Marcando de forma visible los valores que vienen del modelo, permitiendo editar cada campo en el mismo lugar y sin ocultar nunca el documento original. En Claimly el recibo escaneado queda en pantalla junto a los campos, para comparar en vez de confiar.

### ¿El paso de confirmación no perjudica la conversión?

Agrega una pantalla, así que cuesta algo. Ese costo se acepta solo cuando el error es caro y silencioso. Para salidas de IA de bajo riesgo, como una lista de compras generada, no ponemos ninguna barrera.
