---
title: "Política de Privacidad de Claimly"
updatedAt: "2026-11-14"
---

## Política de Privacidad de Claimly

**Última actualización:** 14 de noviembre de 2026

Gracias por usar **Claimly**, desarrollado por **FusionCore Apps** ("nosotros", "nuestro", "nos").
Esta Política de Privacidad explica cómo manejamos tu información cuando usas Claimly — una app de Android (paquete `com.fusioncoreapps.claimly`) para llevar el control de garantías y recibos. **Claimly no tiene cuentas de usuario: nunca te pedimos nombre, correo electrónico ni contraseña.** Tus productos, garantías y recibos se guardan en tu dispositivo, no en nuestros servidores.

---

## 1. Lo que se Queda en tu Dispositivo

Los siguientes datos se crean y se guardan **solo en tu dispositivo** (en la base de datos local y el almacenamiento de la app). No recibimos ninguna copia:

- Tus productos, garantías, categorías, notas, precios y fechas de compra
- Las fotos de recibos y los adjuntos que agregas (fotos y documentos)
- La configuración de la app (tema, moneda, preferencias de recordatorios)

**Copias de seguridad:** Claimly te permite exportar una copia de seguridad como un **archivo .zip** local. Tú lo creas y tú decides dónde guardarlo o compartirlo. Nunca recibimos tus copias de seguridad. Si guardas una en un servicio en la nube o se la envías a alguien, aplican los términos de ese servicio o de esa persona.

---

## 2. Escaneo de Recibos (OCR): Qué se Envía y Cuánto Tiempo se Conserva

El escaneo de recibos es **opcional** — siempre puedes agregar productos manualmente. Solo cuando escaneas un recibo:

1. Una copia reducida de la foto (un JPEG de unos 800 píxeles) y los nombres de tus categorías se envían por una conexión cifrada (**HTTPS**) a nuestro propio endpoint de API, alojado en **Expo (EAS Hosting)**.
2. Nuestro endpoint los reenvía a **OpenAI** (API, modelo `gpt-4.1-mini`) para extraer la tienda, la fecha, el producto y el precio, y sugerir una categoría.
3. Los campos extraídos regresan a tu dispositivo, donde los revisas y editas antes de guardar.

Cuánto tiempo se conserva:

- **Nuestro servidor no almacena la imagen.** Solo pasa la solicitud a OpenAI y devuelve el resultado a tu dispositivo.
- **OpenAI** actúa como nuestro proveedor de servicios (encargado del tratamiento). Según la política de datos de la API de OpenAI, **no usa los datos de la API para entrenar sus modelos** y puede conservar las entradas hasta **30 días** para monitorear abusos; después se eliminan.
- La foto del recibo que guardas en la app permanece en tu dispositivo (consulta la Sección 1).

Todo lo que está impreso en el recibo forma parte de la foto que se envía, así que puede incluir otros datos que aparezcan en él (por ejemplo, un número de cliente frecuente de la tienda). Solo se extraen la tienda, la fecha, el producto y el precio.

---

## 3. Compras (Claimly Premium)

Las compras las procesan **Google Play** y **RevenueCat**. RevenueCat recibe un ID de usuario anónimo de la app, tu historial de compras y el estado de tu suscripción para desbloquear Premium en tu dispositivo. **Los pagos los gestiona Google Play — nunca vemos ni guardamos los datos de tu tarjeta.**

---

## 4. Datos Publicitarios (Solo en el Nivel Gratuito)

La versión gratuita de Claimly muestra anuncios de **Google AdMob**. Los usuarios Premium no ven anuncios. AdMob puede recopilar:

- Identificadores del dispositivo y publicitarios (por ejemplo, el ID de publicidad de Android)
- Ubicación aproximada obtenida a partir de tu dirección IP
- Interacciones con la app (incluidas las interacciones con anuncios) y diagnósticos

Estos datos se comparten con **Google** con fines de publicidad, análisis y prevención de fraude.

- Cuando la ley lo exige (por ejemplo, en el Espacio Económico Europeo, el Reino Unido o Suiza), verás un formulario de consentimiento de Google (UMP) antes de que se muestren anuncios personalizados.
- Puedes restablecer o eliminar tu ID de publicidad, o desactivar los anuncios personalizados, en la configuración de Android (en Google > Anuncios, o Privacidad > Anuncios, según tu dispositivo).
- Nunca enviamos tus productos, garantías ni recibos a las redes publicitarias.

Más información: [Cómo usa Google la información de los sitios o apps que utilizan sus servicios](https://policies.google.com/technologies/partner-sites).

---

## 5. Análisis y Reportes de Fallos

- **Firebase Analytics (Google)** recopila eventos de interacción con la app (por ejemplo, qué pantallas y funciones se usan), información del dispositivo (como el modelo, la versión del sistema operativo y un identificador de instancia de la app) y eventos de compra (como `in_app_purchase`). Lo usamos para entender cómo se usa la app y mejorarla.
- **Sentry** recopila registros de fallos y diagnósticos (detalles del error, información del dispositivo y del sistema operativo, versión de la app y datos de rendimiento) para encontrar y corregir errores.

Estos datos no están vinculados a tu nombre ni a tu correo electrónico — Claimly no los recopila.

---

## 6. Notificaciones

Los recordatorios de vencimiento de garantías son **notificaciones locales**, programadas en tu dispositivo. Claimly no usa notificaciones push: **no se crea ni se envía ningún token push a ningún servidor**, y tus datos de garantías no se envían a ninguna parte para programar los recordatorios.

---

## 7. Permisos de la App

- **Cámara** — solo para tomar fotos de recibos y productos.
- **Notificaciones** — para mostrar los recordatorios de vencimiento de garantías. Claimly también usa los permisos de alarmas y de "ejecutar al iniciar" de Android solo para entregar esos recordatorios a tiempo y reprogramarlos cuando reinicias el dispositivo.
- **Fotos y archivos** — Claimly usa los selectores de fotos y archivos de Android, así que solo accede a las fotos o documentos específicos que eliges adjuntar.

Claimly **no** solicita acceso a tu micrófono, ubicación ni contactos.

---

## 8. Cómo Usamos tu Información

Usamos los datos descritos arriba únicamente para:

- **Extraer los datos del recibo** cuando decides escanear uno
- **Desbloquear y verificar** las compras de Premium
- **Mostrar anuncios** a los usuarios del nivel gratuito (sujeto a tu consentimiento cuando se requiera)
- **Entender el uso de la app y corregir fallos** mediante análisis y reportes de fallos

**No** vendemos ni alquilamos tus datos a ningún tercero.

---

## 9. Servicios de Terceros con los que Compartimos Datos

Compartimos solo los datos que cada servicio necesita para hacer su trabajo:

- **Expo (EAS Hosting)** — aloja nuestro endpoint de API para escanear recibos. [Política de Privacidad de Expo](https://expo.dev/privacy)
- **OpenAI** — extrae los datos de los recibos escaneados (API). [Política de Privacidad de OpenAI](https://openai.com/policies/privacy-policy/) · [Uso de datos de la API de OpenAI](https://platform.openai.com/docs/guides/your-data)
- **Google AdMob** — anuncios para usuarios del nivel gratuito:
  - [Política de Privacidad de Google](https://policies.google.com/privacy)
  - [Tecnologías Publicitarias de Google](https://policies.google.com/technologies/ads)
  - [Políticas del Programa Google AdMob](https://support.google.com/admob/answer/6128543)
- **Firebase Analytics (Google)** — análisis de la app. [Privacidad y Seguridad de Firebase](https://firebase.google.com/support/privacy)
- **RevenueCat y Google Play Billing** — compras y estado de la suscripción:
  - [Política de Privacidad de RevenueCat](https://www.revenuecat.com/privacy)
  - [Política de Privacidad de Google](https://policies.google.com/privacy)
- **Sentry** — reportes de fallos y diagnósticos. [Política de Privacidad de Sentry](https://sentry.io/privacy/)

También podemos divulgar información si así lo exige la ley (por ejemplo, citación, orden judicial).

---

## 10. Retención y Eliminación de Datos

- **Datos en tu dispositivo**: elimina cualquier producto en la app para borrarlo junto con sus garantías, fotos de recibos y adjuntos. Para borrar todo de una vez, borra los datos de la app (Ajustes de Android > Aplicaciones > Claimly > Almacenamiento > Borrar datos) o desinstala Claimly. Los archivos .zip de copia de seguridad que exportaste no se eliminan automáticamente — bórralos donde los hayas guardado.
- **Escaneos de recibos**: nuestro servidor no guarda ninguna copia de la imagen. Las entradas enviadas a OpenAI se eliminan automáticamente en un plazo de **30 días**.
- **Datos de análisis, fallos y suscripción** que guardan nuestros proveedores de servicios (Firebase, Sentry, RevenueCat): escríbenos a **support@fusioncoreapps.com** para solicitar su eliminación. Como Claimly no tiene cuentas, incluye las fechas aproximadas en que usaste la app y, si compraste Premium, tu ID de pedido de Google Play para que podamos ubicar tus registros. Procesaremos tu solicitud en un plazo de **30 días**. Es posible que se conserven los registros de compra que Google y RevenueCat deben mantener por obligaciones legales y contables.
- **ID de publicidad**: puedes restablecerlo o eliminarlo en cualquier momento en la configuración de Android (consulta la Sección 4).

---

## 11. Seguridad de los Datos

- Toda la comunicación entre la app, nuestro servidor y nuestros proveedores de servicios está **cifrada en tránsito** (HTTPS/TLS).
- Tus productos, garantías y recibos permanecen en tu dispositivo, protegidos por la configuración de seguridad de tu dispositivo.

Ningún método de transmisión o almacenamiento es 100% seguro. Aplicamos medidas razonables y notificaremos a los usuarios afectados de cualquier brecha según lo exija la ley aplicable.

---

## 12. Tus Derechos y Opciones

- **Cámara y Notificaciones**: revoca estos permisos en cualquier momento en la configuración del sistema de tu dispositivo.
- **Escaneo de recibos**: puedes omitir el escaneo y agregar productos manualmente.
- **Personalización de anuncios**: desactívala o restablece tu ID de publicidad en la configuración de Android, y en la Configuración de Anuncios de tu cuenta de Google.
- **Eliminación de datos**: consulta la Sección 10.

Si te encuentras en el **Espacio Económico Europeo (EEE) o el Reino Unido**, también puedes tener derecho a acceder, corregir, objetar o restringir el procesamiento de tus datos personales bajo el RGPD o el RGPD del Reino Unido. Si estás en **Brasil**, tienes derechos similares bajo la LGPD (Ley n.º 13.709/2018). Si eres **residente de California**, puedes tener derechos adicionales bajo la CCPA/CPRA, incluido el derecho a conocer, eliminar y optar por no participar en la venta de información personal (no vendemos información personal). Contáctanos para ejercer cualquiera de estos derechos.

---

## 13. Privacidad de los Menores

Claimly **no está dirigida a menores de 13 años** y no recopilamos conscientemente datos personales de ellos. Si crees que un menor de 13 años ha proporcionado datos a través de nuestra app, contáctanos y los eliminaremos de inmediato.

---

## 14. Transferencias Internacionales de Datos

Nuestros proveedores de servicios (Expo, OpenAI, Google, RevenueCat y Sentry) pueden almacenar y procesar datos en servidores ubicados fuera de tu país de residencia. Nos apoyamos en sus marcos de cumplimiento (incluidas las Cláusulas Contractuales Tipo cuando corresponda) para garantizar que existan las salvaguardas adecuadas.

---

## 15. Cambios en Esta Política

Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando lo hagamos, publicaremos aquí la versión revisada con una nueva fecha de **Última actualización**. El uso continuado de Claimly después de publicados los cambios implica la aceptación de la política revisada. **Fecha de entrada en vigor: 14 de noviembre de 2026.**

---

## 16. Contáctanos

Si tienes preguntas, inquietudes o una solicitud de eliminación de datos, contáctanos:

**FusionCore Apps**
Correo electrónico: **support@fusioncoreapps.com**
