---
title: "Política de Privacidad de Buena Tierra"
updatedAt: "2026-11-01"
---

## Política de Privacidad de Buena Tierra

**Última actualización:** 1 de noviembre de 2026

**Buena Tierra** es una app de Android desarrollada por **FusionCore Apps** ("nosotros", "nuestro", "nos"). Sirve para grabar prédicas y crear resúmenes con inteligencia artificial (IA). Esta política explica qué datos usamos y por qué. **No se te pide ni guardamos nombre, correo electrónico ni contraseña.**

---

## 1. Qué funciona sin conexión

Grabar, tus notas y la Biblia funcionan sin conexión. Solo necesitamos internet cuando pides un resumen, compras Premium, ves anuncios o envías un reporte.

---

## 2. Lo que se queda en tu teléfono

Estos datos se guardan en tu teléfono. Nuestros servidores no guardan copia:

- Tus grabaciones de audio
- Los resúmenes, las notas, el plan de la semana y las reflexiones
- Tus preferencias (por ejemplo, la iglesia que escribes en Ajustes)

**No enviamos a nuestros servidores el nombre de tu iglesia ni el del predicador.**

Si tienes activada la copia de seguridad de Android, el sistema puede respaldar la base de datos y los ajustes de la app (no los archivos de audio) en tu cuenta de Google. Eso lo gestiona Android, no nosotros.

---

## 3. Identificadores que usamos

No hay cuentas. Para que la app funcione usamos estos identificadores:

- **ID anónimo de Firebase**: un identificador aleatorio que no está ligado a tu identidad.
- **ID de Android con hash**: una versión irreversible del ID de tu dispositivo. Sirve solo para evitar que se abuse de los **2 resúmenes gratis**: reinstalar la app no los restaura.
- **Token de notificaciones (FCM)**: para avisarte cuando tu resumen está listo. El texto de ese aviso incluye el título del resumen (lo genera la IA a partir de la prédica y puedes editarlo después) y se entrega mediante Firebase Cloud Messaging, de Google.
- **ID de usuario de RevenueCat**: para reconocer tu compra de Premium.
- **ID de publicidad de Android**: lo usa Google AdMob, solo en el nivel gratuito (sección 6).

Para proteger el servicio de uso no autorizado, la app también usa **Firebase App Check** (Play Integrity).

---

## 4. Resúmenes con IA: qué se envía y cuánto tiempo se guarda

Solo cuando pides un resumen:

1. El audio se sube desde tu teléfono en segmentos, cifrado en tránsito (TLS).
2. Lo juntamos y lo enviamos a nuestro proveedor de transcripción (**AssemblyAI**; si no está disponible, un proveedor de respaldo, **Google Speech-to-Text**). Convierte el audio en texto.
3. El texto se envía a nuestro proveedor de resúmenes con IA (**Anthropic**; si no está disponible, un proveedor de respaldo, **OpenAI**) para crear el resumen. El mismo proveedor revisa el resultado antes de entregártelo.

Cuánto tiempo se guarda en el servidor:

- **Audio**: se borra justo después de la transcripción. Una regla automática lo elimina como máximo a las 24 horas, por si algo falla.
- **Transcripción y resumen**: se borran cuando tu teléfono confirma que los descargó, o como máximo a los **7 días**.
- **Copia del proveedor de transcripción**: pedimos al proveedor que borre su copia una vez que recibimos el texto, y reintentamos si falla.
- Los registros técnicos del servidor contienen solo identificadores y cifras (por ejemplo, minutos de audio). **Nunca** incluyen texto de transcripciones ni nombres de iglesias o predicadores.

Elegimos proveedores de IA cuyos términos de API excluyen entrenar con los datos de los clientes. Cada proveedor trata los datos según sus propios términos y política de privacidad (sección 7).

---

## 5. Reportes de IA dentro de la app

Si reportas un resultado de IA, guardamos el motivo, tu comentario opcional y el texto de IA reportado, junto con tu ID anónimo. Se eliminan automáticamente a los **90 días**. Solo se usan para revisar y mejorar la calidad de los resultados.

---

## 6. Compras y anuncios

### Compras (Premium)

Las compras pasan por **Google Play** y **RevenueCat**. RevenueCat recibe tu ID de usuario, el historial de compras y el estado de tu suscripción para darte acceso a Premium. **Los datos de pago los maneja Google; la app nunca los ve.**

### Anuncios (solo nivel gratuito)

Los usuarios gratuitos ven banners de **Google AdMob** únicamente en **Biblioteca, Biblia y Nota manual**. AdMob puede recopilar el ID de publicidad, tu ubicación aproximada (a partir de la dirección IP), tus interacciones con los anuncios y datos de diagnóstico.

- Los anuncios personalizados dependen de tu consentimiento. Si estás en el Espacio Económico Europeo, el Reino Unido o Suiza, verás un formulario de consentimiento de Google (UMP).
- Cuando la ley lo exige, en **Ajustes** aparece **Opciones de privacidad de anuncios** para cambiar tu elección.
- Puedes restablecer o eliminar el ID de publicidad en los ajustes de Android (en Google > Anuncios, o en Privacidad > Anuncios, según tu dispositivo).
- **Nunca enviamos a los anuncios el nombre de tu iglesia o del predicador, ni contenido de prédicas.**

Más información: [Cómo usa Google la información de sitios o apps que usan sus servicios](https://policies.google.com/technologies/partner-sites).

---

## 7. Servicios de terceros

Compartimos solo lo necesario para que cada servicio cumpla su función. No vendemos tus datos.

- **Firebase / Google** (autenticación anónima, App Check, notificaciones): [Privacidad en Firebase](https://firebase.google.com/support/privacy)
- **Google Cloud** (nuestro servidor y almacenamiento temporal): [Política de Privacidad de Google](https://policies.google.com/privacy)
- **AssemblyAI** (transcripción): [Política de Privacidad](https://www.assemblyai.com/legal/privacy-policy)
- **Google Speech-to-Text** (transcripción de respaldo): [Política de Privacidad de Google](https://policies.google.com/privacy)
- **Anthropic** (resúmenes con IA): [Política de Privacidad](https://www.anthropic.com/legal/privacy)
- **OpenAI** (resúmenes con IA de respaldo): [Política de Privacidad](https://openai.com/policies/privacy-policy/)
- **RevenueCat y Google Play** (compras): [RevenueCat](https://www.revenuecat.com/privacy)
- **Google AdMob** (anuncios): [Políticas de publicidad de Google](https://policies.google.com/technologies/ads)

---

## 8. Cómo borrar tus datos

- **Dentro de la app**: **Ajustes > Borrar mis datos**. Los datos del teléfono se borran de inmediato. Los datos del servidor (ID del dispositivo, trabajos de resumen, reportes y contadores) se eliminan en un máximo de **24 horas**: un proceso automático revisa las solicitudes cada hora.
- **Si ya desinstalaste la app**: en Ajustes puedes ver un **código de dispositivo**. Anótalo antes de desinstalar. Con ese código puedes pedir el borrado de tus datos del servidor en nuestro formulario web de borrado, o escribirnos a **support@fusioncoreapps.com** indicando el código.

Qué conservamos aunque borres tus datos:

- Un registro mínimo contra el abuso: el ID de Android con hash y cuántos resúmenes gratis se han usado (máximo 2). Sin él, borrar los datos restauraría los resúmenes gratis.
- Los registros de compras que mantienen Google y RevenueCat por obligaciones legales y contables.

---

## 9. Seguridad

- Cifrado en tránsito (TLS) para las comunicaciones con nuestro servidor.
- Verificación de la app (App Check) y de la sesión anónima en cada solicitud.
- El almacenamiento del servidor no es público y las reglas de la base de datos impiden el acceso directo desde las apps.

Ningún método es 100% seguro. Si ocurre una brecha que te afecte, te avisaremos como lo exija la ley.

---

## 10. Datos sensibles y menores

- Las prédicas pueden revelar creencias religiosas. Por eso el contenido de tus prédicas vive en tu teléfono (salvo el audio que decides enviar para un resumen) y no se usa para anuncios.
- Buena Tierra no está dirigida a menores de **13 años** y no recopilamos datos de ellos a sabiendas. Si crees que un menor nos dio datos, escríbenos y los eliminaremos.
- Si estás en el EEE o el Reino Unido, o eres residente de California, puedes tener derechos de acceso, corrección y eliminación. Escríbenos para ejercerlos. No vendemos información personal.

---

## 11. Cambios y contacto

Si actualizamos esta política, publicaremos la nueva versión aquí con una nueva fecha de **Última actualización**. **Fecha de entrada en vigor: 1 de noviembre de 2026.**

**FusionCore Apps**
Correo electrónico: **support@fusioncoreapps.com**
