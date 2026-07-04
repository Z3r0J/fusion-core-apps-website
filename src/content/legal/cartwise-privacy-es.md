---
title: "Política de Privacidad de CartWise"
updatedAt: "2026-06-26"
---

## Política de Privacidad de CartWise

**Última actualización:** 26 de junio de 2026

Gracias por usar **CartWise**, desarrollado por **FusionCore Apps** ("nosotros", "nuestro", "nos").
Esta Política de Privacidad explica cómo manejamos tu información cuando usas CartWise — una app de listas de compras. CartWise está diseñada con la privacidad como prioridad: **no se requiere ni se recopila nombre, correo electrónico ni contraseña.** Sin embargo, para operar las listas compartidas y gestionar las suscripciones, la app genera un **identificador de cuenta anónimo** aleatorio (un ID de usuario anónimo a través de nuestro servicio de autenticación de backend, Supabase) que no está vinculado a tu identidad personal. Este identificador se procesa tal como se describe a continuación.

---

## 1. Introducción

CartWise es una app de listas de compras desarrollada por **FusionCore Apps**. Sus funciones principales — crear listas, agregar artículos, organizar por categoría y hacer seguimiento del presupuesto — funcionan completamente sin conexión y almacenan todos los datos localmente en tu dispositivo. Las funciones opcionales, como las listas compartidas y las notificaciones push, implican un procesamiento mínimo de datos en nuestro backend, tal como se describe a continuación. Nos comprometemos a recopilar únicamente lo necesario para operar estas funciones y nada más.

---

## 2. Información que Recopilamos

### Datos Almacenados Solo en tu Dispositivo

Los siguientes datos se crean y almacenan exclusivamente en tu dispositivo (mediante SQLite y almacenamiento local cifrado) y **nunca se transmiten a nuestros servidores**:

- Tus listas de compras, artículos, categorías y todo el contenido relacionado (cantidades, unidades, precios, notas, estado de marcado)
- Preferencias de la app: tema, fuente, idioma, configuración de notificaciones

### Datos de Listas Compartidas (Solo si Creas o te Unes a una Lista Compartida)

Si eliges crear o unirte a una lista compartida, la siguiente información se almacena en nuestro backend (Supabase) para mantener la lista sincronizada entre todos los miembros:

- El contenido de la lista y los artículos (nombres, cantidades, unidades, precios, notas, estado de marcado)
- Un **ID de miembro anónimo generado aleatoriamente** y un **avatar de emoji** asignado a ti — sin nombre, correo electrónico ni identidad personal asociada
- Un **identificador de cuenta anónimo** generado por la autenticación de nuestro backend (Supabase Auth) para identificar tu sesión de forma única sin vincularla a ninguna identidad personal
- Tu **token de notificación push de Expo** (si tienes las notificaciones activadas), utilizado para alertarte sobre la actividad de la lista compartida

Nunca se te solicita proporcionar nombre, dirección de correo electrónico ni ninguna información de identificación para usar las listas compartidas.

### Datos de Notificaciones Push (Solo si Otorgas tu Consentimiento)

Si otorgas permiso de notificaciones, almacenamos:

- Tu **token push de Expo** y el idioma del dispositivo (locale)
- Tus preferencias de notificación: frecuencia, hora preferida de notificación, zona horaria y configuración de horas de silencio

Estos datos se utilizan únicamente para enviar alertas de actividad de listas compartidas, recordatorios de listas y avisos de reenganche a los que te has suscrito. Tu token push se **elimina automáticamente** de nuestro sistema cuando la entrega de notificaciones falla (lo que generalmente indica que la app fue desinstalada) y se **elimina de forma lógica** cuando desactivas las notificaciones dentro de la app.

### Entrada por Voz

Con permiso de micrófono, CartWise te permite agregar artículos por voz. La conversión de voz a texto se realiza **completamente en tu dispositivo** mediante el motor de voz nativo del sistema operativo. **No se sube ningún audio a los servidores de CartWise** — solo el texto reconocido se utiliza para crear un artículo en la lista.

### Cámara

La cámara se usa **únicamente** para escanear códigos QR al unirse a una lista compartida. No se capturan, almacenan ni transmiten imágenes.

### Datos de Suscripción

Si adquieres **CartWise Pro**, la transacción es procesada por **RevenueCat** y la **Google Play Store**. Estos servicios utilizan un ID de usuario anónimo y estable, y el estado de tu compra/derecho, para conceder acceso Pro. **Nunca recibimos ni almacenamos los datos de tu tarjeta de pago**.

### Dirección IP y Solicitudes al Backend

Cuando la app se comunica con nuestro backend (funciones edge de Supabase) para la sincronización de listas compartidas, el registro de tokens push o la verificación de suscripciones, nuestros servidores pueden procesar de forma transitoria la **dirección IP** de tu dispositivo con fines de seguridad, prevención de abuso y limitación de solicitudes (rate limiting). Esta dirección IP no se almacena de forma permanente junto con los datos de tu lista y no se utiliza para publicidad. La infraestructura de Supabase gestiona este procesamiento; consulta la [Política de Privacidad de Supabase](https://supabase.com/privacy) para más detalles.

### Datos Publicitarios (Solo en el Nivel Gratuito)

La versión gratuita de CartWise puede mostrar anuncios servidos por **Google AdMob**. Con tu consentimiento (recopilado mediante un aviso de consentimiento de Google UMP), AdMob puede recopilar de forma independiente:

- Identificadores publicitarios (p. ej., Android Advertising ID)
- Ubicación aproximada (para segmentación de anuncios por región)
- Señales del dispositivo y de uso (p. ej., modelo del dispositivo, interacción con anuncios)

No controlamos lo que AdMob recopila directamente; revisa sus políticas (consulta la Sección 4).

### Análisis y Datos de Fallos

**Firebase Analytics** y **Firebase Crashlytics** recopilan datos de uso y diagnóstico limitados — que pueden incluir identificadores de dispositivo y de app, así como datos de eventos — para ayudarnos a comprender qué funciones se usan y a corregir fallos. Estos datos se recopilan a través de las plataformas Firebase Analytics y Crashlytics y no están vinculados a tu nombre ni correo electrónico, aunque pueden incluir identificadores seudónimos a nivel de dispositivo según lo determine la plataforma Firebase de Google.

---

## 3. Cómo Usamos tu Información

Usamos los datos descritos anteriormente únicamente para:

- **Sincronizar listas compartidas** entre miembros en tiempo real
- **Enviar notificaciones push** a las que te has suscrito
- **Gestionar los derechos Pro** y verificar el estado de tu suscripción
- **Mostrar anuncios** a los usuarios del nivel gratuito (sujeto a tu consentimiento)
- **Mejorar la estabilidad y las funciones de la app** mediante análisis agregados e informes de fallos

**No** vendemos ni alquilamos tus datos a ningún tercero.

---

## 4. Servicios de Terceros con los que Compartimos Datos

Compartimos el mínimo de datos necesarios con los siguientes proveedores de servicios, únicamente para que puedan desempeñar sus respectivas funciones:

- **Supabase** — infraestructura de backend para la sincronización, el almacenamiento de listas compartidas y la autenticación anónima. Supabase también puede procesar de forma transitoria tu dirección IP con fines de seguridad y limitación de solicitudes cuando la app contacta nuestras funciones edge. [Política de Privacidad de Supabase](https://supabase.com/privacy)
- **Expo Push Service y Firebase Cloud Messaging (FCM)** — infraestructura de entrega de notificaciones. [Privacidad y Seguridad de Firebase](https://firebase.google.com/support/privacy)
- **Google AdMob** — entrega y medición de anuncios (solo nivel gratuito, con tu consentimiento):
  - [Políticas del Programa Google AdMob](https://support.google.com/admob/answer/6128543)
  - [Política de Privacidad de Google](https://policies.google.com/privacy)
  - [Tecnologías Publicitarias de Google](https://policies.google.com/technologies/ads)
- **RevenueCat y Google Play Billing** — gestión de suscripciones y verificación de derechos:
  - [Política de Privacidad de RevenueCat](https://www.revenuecat.com/privacy)
  - [Política de Privacidad de Google](https://policies.google.com/privacy)
- **Firebase Analytics y Crashlytics** — recopilación de datos de uso y diagnóstico (puede incluir identificadores de dispositivo y de app). [Privacidad y Seguridad de Firebase](https://firebase.google.com/support/privacy)

Estos proveedores utilizan los datos **únicamente para prestar su servicio**. Ninguno de ellos recibe datos para publicidad ni venta en nuestro nombre, y no vendemos tus datos a ninguna parte.

---

## 5. Retención y Eliminación de Datos

- Los **datos locales** (listas, artículos, preferencias) se eliminan de tu dispositivo cuando desinstales la app.
- Los **tokens push** se eliminan automáticamente de nuestro sistema cuando falla la entrega (generalmente al desinstalar) y se eliminan de forma lógica cuando desactivas las notificaciones dentro de la app.
- Los **datos de listas compartidas** persisten en nuestro backend para mantener la lista disponible para los demás miembros. Si deseas que se eliminen tus datos de listas compartidas, contáctanos (consulta la Sección 11) y procesaremos la solicitud de eliminación.

---

## 6. Seguridad de los Datos

Protegemos tus datos mediante:

- **Almacenamiento cifrado en el dispositivo** para listas y preferencias locales
- **Cifrado en tránsito** (TLS) para todas las comunicaciones con nuestro backend
- **Seguridad a nivel de fila (RLS) de Supabase** para garantizar que solo los miembros autorizados puedan acceder a una lista compartida

Ningún método de transmisión o almacenamiento es 100% seguro. Aplicamos salvaguardas razonables y notificaremos a los usuarios afectados sobre cualquier brecha de seguridad según lo exija la ley aplicable.

---

## 7. Tus Derechos y Opciones

Puedes ejercer los siguientes controles en cualquier momento:

- **Micrófono y cámara**: Revoca estos permisos en la configuración del sistema de tu dispositivo.
- **Notificaciones**: Desactiva las notificaciones dentro de la app o revoca el permiso de notificaciones en la configuración del sistema. Tu token push se eliminará de nuestro sistema.
- **Personalización de anuncios**: Desactívala a través de la configuración de "Anuncios" / "Personalización de anuncios" de tu dispositivo y de la Configuración de Anuncios de tu cuenta de Google.
- **Eliminación de datos**: Escríbenos a **support@fusioncoreapps.com** para solicitar la eliminación de cualquier dato que tengamos (p. ej., datos de listas compartidas, tokens push).

Si te encuentras en el **Espacio Económico Europeo (EEE) o el Reino Unido**, también puedes tener derecho a acceder, corregir, objetar o restringir el procesamiento de tus datos personales bajo el RGPD o el RGPD del Reino Unido. Si eres **residente de California**, puedes tener derechos adicionales bajo la CCPA/CPRA, incluido el derecho a conocer, eliminar y optar por no participar en la venta de información personal (no vendemos información personal). Contáctanos para ejercer cualquiera de estos derechos.

---

## 8. Privacidad de los Menores

CartWise está destinado a usuarios de **13 años en adelante**. No recopilamos conscientemente datos personales de menores de 13 años. Si crees que un menor de 13 años ha proporcionado datos a través de nuestra app, contáctanos y los eliminaremos de inmediato.

---

## 9. Transferencias Internacionales de Datos

CartWise se desarrolla y opera a nivel global. Los datos procesados en nuestro backend (Supabase) y por nuestros proveedores de servicios (Firebase, RevenueCat, AdMob) pueden almacenarse y procesarse en servidores ubicados fuera de tu país de residencia. Al usar CartWise, consientes dichas transferencias internacionales. Nos apoyamos en los marcos de cumplimiento de nuestros proveedores de servicios (incluidas las Cláusulas Contractuales Estándar cuando corresponda) para garantizar que existan las salvaguardas adecuadas.

---

## 10. Cambios en Esta Política

Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando lo hagamos, publicaremos la política revisada aquí con una nueva fecha de **Última actualización**. El uso continuado de CartWise después de que se publiquen los cambios constituye la aceptación de la política revisada. Te recomendamos revisar esta página periódicamente.

---

## 11. Contáctanos

Si tienes preguntas, inquietudes o una solicitud de eliminación de datos, contáctanos:

**FusionCore Apps**
Correo electrónico: **support@fusioncoreapps.com**
