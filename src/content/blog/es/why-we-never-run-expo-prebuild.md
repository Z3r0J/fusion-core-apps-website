---
title: "Por qué nunca corremos expo prebuild en nuestras apps"
description: "Nuestras apps usan Expo, pero la carpeta android/ está editada a mano. Esto es lo que se rompe con prebuild y por qué aceptamos ese trade-off."
app: Bible TPT
category: Engineering
translationKey: "why-we-never-run-expo-prebuild"
publishedAt: "2026-07-12"
author: "FusionCore Apps"
tags: ["expo", "react native", "android", "engineering", "build"]
ogImage: "/images/blog/es/why-we-never-run-expo-prebuild.png"
featured: false
faq:
  - question: "¿Qué hace exactamente expo prebuild?"
    answer: "Regenera las carpetas nativas android/ e ios/ desde cero, a partir de app.json y de los config plugins. Todo lo que se haya editado a mano en el proyecto nativo y no esté representado en un plugin se pierde en el proceso."
  - question: "¿Es seguro correr expo prebuild?"
    answer: "Solo si android/ e ios/ son artefactos generados de verdad. Si el proyecto nativo tiene ediciones a mano —módulos nativos, dependencias de Gradle, cambios en MainActivity— prebuild las borra sin aviso ni conflicto."
  - question: "¿Cómo compilo una app de Expo sin correr prebuild?"
    answer: "Con expo run:android para desarrollo local, que compila el proyecto nativo existente sin regenerarlo, y con EAS para los builds de release, que toma android/ del repositorio tal como está."
  - question: "¿Cuándo conviene usar config plugins en vez de editar android/ a mano?"
    answer: "Cuando la modificación es simple y declarativa, como agregar una dependencia de Gradle. Para módulos nativos completos, el costo de escribir y mantener el plugin suele superar al de portar las ediciones a mano en cada upgrade de SDK."
---

En el repositorio de Bible TPT hay una regla escrita en mayúsculas, la primera de la lista: **nunca correr `expo prebuild`**. No es una preferencia de estilo. Es una regla que existe porque el comando es destructivo para la forma en que construimos esta app, y porque la única vez que se cruza esa línea se pierden semanas de trabajo nativo sin ningún aviso previo.

Vale la pena explicar el razonamiento completo, porque la decisión no es obvia y va en contra de cómo se supone que se usa Expo.

## Qué hace prebuild y por qué eso es un problema

El modelo mental de Expo es que `android/` e `ios/` son **artefactos generados**. Uno describe lo que necesita en `app.json` y en config plugins, corre `expo prebuild`, y Expo regenera los proyectos nativos desde cero a partir de esa descripción. Si se borra `android/`, no pasa nada: se vuelve a generar. Esa es la promesa del managed workflow, y es una buena promesa.

El problema aparece cuando el proyecto nativo deja de ser un artefacto y pasa a ser **código fuente**.

En nuestro caso eso ya ocurrió. La carpeta `android/` de Bible TPT contiene:

- **Módulos nativos escritos a mano**, como `AlarmPermissionModule`, que existe porque los recordatorios de versículos necesitan exact alarms y el permiso correspondiente en Android 12+ no se resuelve desde JavaScript.
- **Dependencias de mediación en Gradle** para el stack de ads con bidding: Meta, Unity, ironSource, InMobi, Liftoff/Vungle. Cada adapter tiene su entrada y varios necesitan configuración adicional a nivel de Gradle.
- **Ediciones en `MainActivity` y `MainApplication`** que no son expresables como configuración declarativa.

`expo prebuild` no sabe nada de eso. Regenera el proyecto desde el template y desde los config plugins que encuentre. Todo lo que fue editado a mano y no está representado en un plugin **desaparece**. No hay merge, no hay conflicto, no hay advertencia útil: hay un `android/` nuevo y limpio que ya no compila lo que tenía que compilar o, peor, que compila y perdió una feature en silencio.

Ese "peor" es el escenario que realmente preocupa. Un build que falla es barato: uno se entera en dos minutos. Un build que pasa, sube a Play, y resulta que los recordatorios ya no piden el permiso correcto, es caro.

## Por qué no lo resolvemos con config plugins

La respuesta ortodoxa a este problema es: *escribe config plugins*. Y es correcta. Un config plugin toma esas modificaciones nativas y las expresa como código que corre durante el prebuild, con lo cual `android/` vuelve a ser desechable y se recupera el managed workflow completo.

No lo hicimos, por tres razones honestas:

**El costo no es lineal con el beneficio.** Escribir un plugin para agregar una dependencia de Gradle es trivial. Escribir uno que reproduzca fielmente un módulo nativo con su registro en `MainApplication`, sus permisos y su comportamiento en varias versiones de Android es un proyecto en sí mismo, y hay que mantenerlo cada vez que Expo cambia la forma del template.

**El proyecto nativo es estable.** No tocamos `android/` con frecuencia. Cambia cuando agregamos un adapter de mediación o un módulo nuevo, es decir, pocas veces al año. Un artefacto que casi no cambia gana poco por ser regenerable.

**El upgrade de SDK es el único momento donde duele.** Y ahí duele igual: con plugins habría que verificar que los plugins siguen aplicando bien; sin plugins hay que portar las ediciones a mano. Es trabajo distinto, no necesariamente menos trabajo.

Esto no es una defensa universal de editar `android/` a mano. Es una decisión de contexto: un estudio pequeño, un proyecto nativo que casi no se mueve, y una regla clara para que nadie —humano o agente— corra el comando equivocado.

## Cómo construimos entonces

La regla no significa "no usamos las herramientas de Expo". Significa que el flujo es otro:

- **Desarrollo local:** `expo run:android`. Compila el proyecto nativo que existe, sin regenerarlo. Es el reemplazo directo de `prebuild` + build, y es el comando que corre todo el equipo.
- **Releases:** EAS. El build remoto toma el `android/` del repositorio tal como está.
- **Todo lo que sí es declarativo** (permisos simples, íconos, splash, esquemas) sigue viviendo en la configuración de Expo, porque para eso el modelo funciona perfecto.

La diferencia práctica es una sola: `android/` está en git y se trata como código, con review, no como output.

## El trade-off que aceptamos

Hay que decirlo sin adornos, porque es real:

- Perdemos la capacidad de borrar `android/` y regenerarlo si algo se corrompe.
- Los upgrades de Expo SDK son más caros: hay que leer el diff del template y portar los cambios relevantes a mano.
- Un desarrollador nuevo que llega con el modelo mental de Expo va a asumir que `prebuild` es seguro. Por eso la regla está escrita en el archivo de instrucciones del repositorio, en mayúsculas, como primera línea.

A cambio: los módulos nativos existen, la mediación de ads funciona, y nadie tiene que mantener una capa de plugins que reproduzca todo eso.

## Lo mismo aplica al twin

Biblia TLA es el gemelo técnico de Bible TPT: mismo stack, mismas decisiones, el mismo `android/` editado a mano. La regla es idéntica en los dos repositorios, y cuando cambiamos un patrón compartido (RevenueCat, ads, theming) lo portamos al otro. Una regla que existe solo en uno de dos repositorios es una regla que alguien va a romper en el otro.

## Próximos pasos

Esto es lo que tenemos pendiente sobre esta decisión:

1. **Documentar el diff nativo.** Hoy la lista de qué está editado a mano en `android/` vive en la cabeza de quien lo editó y en el historial de git. Debería ser un archivo explícito, para que el próximo upgrade de SDK sea una checklist y no una excavación arqueológica.
2. **Reevaluar plugins para lo trivial.** Las dependencias de Gradle de mediación sí son buenas candidatas a config plugin: bajo costo, alto beneficio. Los módulos nativos, por ahora, no.
3. **Blindar el comando.** Una regla escrita se puede ignorar. Un script que falle si detecta un `prebuild` en el historial, no.

## Preguntas frecuentes

**¿Qué hace exactamente expo prebuild?**
Regenera las carpetas nativas `android/` e `ios/` desde cero, a partir de `app.json` y de los config plugins. Todo lo que se haya editado a mano en el proyecto nativo y no esté representado en un plugin se pierde en el proceso.

**¿Es seguro correr expo prebuild?**
Solo si `android/` e `ios/` son artefactos generados de verdad. Si el proyecto nativo tiene ediciones a mano —módulos nativos, dependencias de Gradle, cambios en `MainActivity`— prebuild las borra sin aviso ni conflicto.

**¿Cómo compilo una app de Expo sin correr prebuild?**
Con `expo run:android` para desarrollo local, que compila el proyecto nativo existente sin regenerarlo, y con EAS para los builds de release, que toma `android/` del repositorio tal como está.

**¿Cuándo conviene usar config plugins en vez de editar android/ a mano?**
Cuando la modificación es simple y declarativa, como agregar una dependencia de Gradle. Para módulos nativos completos, el costo de escribir y mantener el plugin suele superar al de portar las ediciones a mano en cada upgrade de SDK.

### Takeaways

- `expo prebuild` es seguro **solo si** `android/` es realmente un artefacto generado. En el momento en que se edita el proyecto nativo a mano, deja de serlo.
- La decisión correcta no es "prebuild sí" o "prebuild no": es decidir conscientemente si el proyecto nativo es output o es source, y ser coherente con esa elección en todo el flujo de build.
- Si se elige tratarlo como source, hay que escribirlo en el repositorio donde alguien lo vaya a leer antes de correr el comando, no en un mensaje de Slack de hace ocho meses.
