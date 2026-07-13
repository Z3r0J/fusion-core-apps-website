---
title: "12 testers en Google Play: cómo superamos el test cerrado"
description: "Google Play exige 12 testers durante 14 días para pasar a producción. Cómo lo logramos con Claimly y por qué comprar testers es un riesgo real."
app: Claimly
category: Growth
translationKey: "google-play-12-testers-requirement"
publishedAt: "2026-07-13"
author: "FusionCore Apps"
tags: ["google play", "test cerrado", "aso", "lanzamiento", "android", "growth"]
ogImage: "/images/blog/es/google-play-12-testers-requirement.png"
featured: false
faq:
  - question: "¿Cuántos testers exige Google Play?"
    answer: "Al menos 12 testers deben unirse a una prueba cerrada y permanecer en ella de forma continua durante 14 días antes de poder solicitar el acceso a producción. El requisito original era de 20 testers y Google lo bajó a 12 el 11 de diciembre de 2024."
  - question: "¿A quién le aplica el requisito de 12 testers?"
    answer: "Solo a las cuentas de desarrollador personales creadas después del 13 de noviembre de 2023. Las cuentas de organización están exentas, y las cuentas personales anteriores a esa fecha tampoco están sujetas al requisito."
  - question: "¿La prueba interna cuenta para los 14 días?"
    answer: "No. El requisito exige específicamente una prueba cerrada. Un canal de internal testing no lo cumple, y es el malentendido más caro que existe sobre este tema."
  - question: "¿Se pueden comprar 12 testers para superar la prueba más rápido?"
    answer: "Existen servicios que los venden, pero el riesgo es real. Google espera actividad de testing genuina y continua, y pagar por cuentas que solo existen para mover un contador pone en juego la cuenta de desarrollador a cambio de ahorrar dos semanas."
  - question: "¿Qué pasa si un tester abandona la prueba durante los 14 días?"
    answer: "Bajar de 12 testers activos interrumpe la ventana continua. Por eso conviene reclutar un margen por encima de 12 y no exactamente 12."
---

Si la cuenta de desarrollador personal se creó después del 13 de noviembre de 2023, no se puede publicar en producción sin antes correr una **prueba cerrada con al menos 12 testers que permanezcan activos durante 14 días continuos**. Esa es la regla completa. No es una sugerencia, no hay forma de apelarla, y aplica antes de que la app llegue a un solo usuario real.

Pasamos por ahí con [Claimly](/es/apps/claimly-receipt-tracker), nuestro rastreador de garantías y recibos. Esto es lo que el requisito significa realmente desde adentro, qué hicimos mal, y por qué toda la primera página de resultados de búsqueda sobre este tema intenta venderte algo que no deberías comprar.

## Qué exige Google exactamente

La forma precisa de la regla importa, porque casi todo el dolor viene de malinterpretar alguna de estas cláusulas:

- **12 testers, no 12 instalaciones.** Tienen que *unirse* (opt-in) a la prueba cerrada. Agregar 12 correos en Play Console no hace nada por sí solo.
- **14 días continuos.** La ventana es consecutiva. Si el número de testers activos baja de 12 a mitad de camino, no queda guardado ningún progreso parcial.
- **Prueba cerrada, específicamente.** Un canal de internal testing no cuenta. Este es el malentendido más caro, porque se pueden quemar dos semanas en el canal equivocado y terminar sin nada.
- **Cuentas personales creadas después del 13 de noviembre de 2023.** Las cuentas de organización están exentas.
- **Antes eran 20.** Google lo bajó a 12 el 11 de diciembre de 2024, después de que suficientes desarrolladores pequeños señalaran que 20 era brutal para quien no tiene audiencia.

El requisito existe por una razón defendible: Play se estaba ahogando en apps de bajo esfuerzo y directamente fraudulentas publicadas desde cuentas desechables. Hacer que un lanzamiento cueste dos semanas y doce humanos reales es un filtro barato contra eso. Saber que es defendible no lo hace menos incómodo cuando uno es el que necesita conseguir doce humanos.

## Cómo lo hicimos con Claimly

No teníamos lista de correo, ni Discord, ni audiencia. Teníamos un grupo de Google, un post de blog y un hilo de Reddit que terminó haciendo casi todo el trabajo real.

El mecanismo es simple: la prueba cerrada permite gestionar testers mediante un grupo de Google, así que cualquiera que se una al grupo queda aprobado como tester sin tener que cargar su correo a mano en Play Console. Creamos `fusionapps-tester` como grupo público y escribimos el anuncio de la beta de Claimly: un post que explicaba qué hacía la app, por qué existía, y daba tres pasos literales para unirse.

Así fue el embudo en la práctica: **hicieron opt-in 14 testers**, cómodamente por encima de los 12 exigidos. Cinco eran amigos y familia. La mayoría del resto llegó desde un solo post en Reddit.

Ese reparto es la lección útil, y no es la que esperábamos. El post del blog era necesario pero no suficiente. Es el *destino*: la explicación canónica, los tres pasos, el enlace al grupo, el lugar al que se envía a la gente. No es lo que *alcanza* a nadie. Nadie encuentra un anuncio de beta buscándolo, porque el día uno ese post no tiene audiencia, y el día uno es justamente cuando hacen falta doce humanos. Reddit ya tenía la audiencia. El post era la landing; Reddit era la distribución.

**El contador de 14 días nunca se reinició y obtuvimos el acceso a producción en la primera solicitud.** Catorce testers activos, catorce días continuos, sin bajar nunca del mínimo. El margen de dos testers por encima del umbral explica buena parte de esa frase.

El anuncio de la beta de Claimly salió el **31 de marzo de 2026**. La app [llegó a producción en Google Play](/es/blog/claimly-ya-disponible-google-play) el **17 de abril de 2026**: unos diecisiete días después, aproximadamente el piso teórico de catorce días más la revisión. Ese calendario solo funciona si los testers ya están listos el día uno.

Compárese todo eso con pagarle a un servicio: se gasta dinero, se reciben doce cuentas y al final uno no es dueño de nada. Ni hilo, ni post, ni testers a los que la app les importara.

## Por qué los resultados de búsqueda de este tema son un campo minado

Basta buscar el requisito de los 12 testers y contar cuántos de los primeros resultados están vendiendo testers. Casi todos. Hay una industria entera —granjas de testers pagos, "supera el test cerrado en 14 días por 15 dólares"— construida sobre desarrolladores que quieren saltarse este paso.

No usamos ninguno, y recomendamos no hacerlo, por una razón que no tiene nada que ver con la pureza:

**El riesgo es asimétrico.** Lo que se gana comprando testers son dos semanas. Lo que se arriesga es la cuenta de desarrollador, de la que depende toda app que se publique en el futuro. Google busca explícitamente actividad de testing genuina durante esa ventana, y un grupo de cuentas que se unen, no hacen nada reconociblemente humano y existen solo para mover un contador es exactamente el patrón que la política fue escrita para detectar. Cambiar una cuenta difícil de reemplazar por catorce días que nadie va a recordar es un mal negocio.

Hay además un costo más silencioso. Una prueba cerrada real informa cosas. La nuestra sacó a la luz bugs concretos de gente usando la app en dispositivos que no teníamos y en condiciones que no habíamos previsto. Doce cuentas moviendo un contador no informan absolutamente nada: se paga por saltarse lo único que el proceso regala.

## El reloj de 14 días es más frágil de lo que parece

El modo de falla del que nadie advierte no es no llegar a doce. Es llegar a doce y después perder uno.

La ventana exige participación *continua*, así que un tester que se une, se aburre y desinstala en la segunda semana puede interrumpir la racha acumulada. Y eso no se controla: son voluntarios haciendo un favor.

La mitigación no es glamorosa: **reclutar un margen**. Conviene apuntar bastante por encima de doce para que la deserción normal no deje la prueba por debajo del mínimo. Reclutar exactamente doce es diseñar un proceso con tolerancia cero a que una sola persona pierda el interés.

## Qué haríamos distinto

- **Empezar a reclutar antes de que el build esté listo.** El reloj de dos semanas no arranca cuando la app está terminada: arranca cuando doce personas hicieron opt-in. Son fechas distintas, y el hueco entre ambas es tiempo muerto que se elimina reclutando en paralelo con el último sprint.
- **Ir donde la audiencia ya está, desde el día uno.** Nuestro post era el destino; Reddit era la distribución. Escribimos el post primero y buscamos la audiencia después, que es el orden invertido. Las comunidades existen se tenga o no seguidores: para eso sirven.
- **Tratarlo como ensayo del lanzamiento, no como impuesto.** La ficha de la tienda, las capturas, la descripción: todo eso hay que tenerlo igual para la prueba cerrada. Se puede hacer de mala gana el último día o aprovechar las dos semanas para hacerlo bien.

## Preguntas frecuentes

**¿Cuántos testers exige Google Play?**
Al menos 12 testers deben unirse a una prueba cerrada y permanecer en ella de forma continua durante 14 días antes de poder solicitar el acceso a producción. El requisito original era de 20 testers y Google lo bajó a 12 el 11 de diciembre de 2024.

**¿A quién le aplica el requisito de 12 testers?**
Solo a las cuentas de desarrollador personales creadas después del 13 de noviembre de 2023. Las cuentas de organización están exentas, y las cuentas personales anteriores a esa fecha tampoco están sujetas al requisito.

**¿La prueba interna cuenta para los 14 días?**
No. El requisito exige específicamente una prueba cerrada. Un canal de internal testing no lo cumple, y es el malentendido más caro que existe sobre este tema.

**¿Se pueden comprar 12 testers para superar la prueba más rápido?**
Existen servicios que los venden, pero el riesgo es real. Google espera actividad de testing genuina y continua, y pagar por cuentas que solo existen para mover un contador pone en juego la cuenta de desarrollador a cambio de ahorrar dos semanas.

**¿Qué pasa si un tester abandona la prueba durante los 14 días?**
Bajar de 12 testers activos interrumpe la ventana continua. Por eso conviene reclutar un margen por encima de 12 y no exactamente 12.

### Takeaways

- El requisito es de 12 testers activos durante 14 días *continuos*, en un canal *cerrado*, para cuentas personales creadas después del 13 de noviembre de 2023. Cada una de esas palabras carga peso.
- El reloj arranca cuando hay doce testers, no cuando la app está lista. Hay que reclutar en paralelo con el desarrollo o se le suman dos semanas al lanzamiento sin ningún motivo.
- Reclutar un margen por encima de doce. "Continuo" significa que un solo voluntario aburrido puede costar la racha. Nosotros corrimos con catorce, nunca bajamos del mínimo y pasamos en la primera solicitud.
- El post del blog es el destino, no la distribución. El nuestro convirtió porque un hilo de Reddit le mandó gente: el anuncio no tenía audiencia propia el día que la necesitábamos.
- Las granjas de testers que ofrecen el atajo están pidiendo arriesgar la cuenta de desarrollador para ahorrar catorce días. Doce testers reales se consiguen sin pagarle a nadie: los nuestros fueron catorce, cinco de ellos amigos y familia, y el resto llegó desde un post en una comunidad que ya existía.
