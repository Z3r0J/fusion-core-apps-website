---
title: "Por que nunca rodamos expo prebuild nos nossos apps"
description: "Nossos apps usam Expo, mas a pasta android/ é editada à mão. Isto é o que o prebuild quebra e por que aceitamos esse trade-off."
app: Bible TPT
category: Engineering
translationKey: "why-we-never-run-expo-prebuild"
publishedAt: "2026-07-12"
author: "FusionCore Apps"
tags: ["expo", "react native", "android", "engineering", "build"]
ogImage: "/images/blog/pt/why-we-never-run-expo-prebuild.png"
featured: false
faq:
  - question: "O que o expo prebuild faz exatamente?"
    answer: "Ele regenera as pastas nativas android/ e ios/ do zero, a partir do app.json e dos config plugins. Tudo o que foi editado à mão no projeto nativo e não está representado num plugin se perde no processo."
  - question: "É seguro rodar o expo prebuild?"
    answer: "Apenas se android/ e ios/ forem de fato artefatos gerados. Se o projeto nativo tem edições à mão — módulos nativos, dependências do Gradle, mudanças no MainActivity — o prebuild as apaga sem aviso e sem conflito de merge."
  - question: "Como fazer o build de um app Expo sem rodar prebuild?"
    answer: "Use expo run:android no desenvolvimento local, que compila o projeto nativo existente sem regenerá-lo, e EAS para os builds de release, que pega o android/ do repositório exatamente como está."
  - question: "Quando usar config plugins em vez de editar o android/ à mão?"
    answer: "Quando a mudança é simples e declarativa, como adicionar uma dependência do Gradle. Para módulos nativos completos, o custo de escrever e manter o plugin costuma superar o de portar as edições à mão a cada upgrade de SDK."
---

No repositório do Bible TPT existe uma regra escrita em maiúsculas, a primeira da lista: **nunca rodar `expo prebuild`**. Não é uma preferência de estilo. É uma regra que existe porque o comando é destrutivo para a forma como construímos este app, e porque na única vez em que essa linha é cruzada se perdem semanas de trabalho nativo sem nenhum aviso.

Vale a pena explicar o raciocínio completo, porque a decisão não é óbvia e vai contra a forma como o Expo deveria ser usado.

## O que o prebuild faz e por que isso é um problema

O modelo mental do Expo é que `android/` e `ios/` são **artefatos gerados**. Você descreve o que precisa no `app.json` e em config plugins, roda `expo prebuild`, e o Expo regenera os projetos nativos do zero a partir dessa descrição. Se apagar `android/`, nada se perde: ele volta. Essa é a promessa do managed workflow, e é uma boa promessa.

O problema aparece quando o projeto nativo deixa de ser um artefato e passa a ser **código-fonte**.

No nosso caso isso já aconteceu. A pasta `android/` do Bible TPT contém:

- **Módulos nativos escritos à mão**, como o `AlarmPermissionModule`, que existe porque os lembretes de versículos precisam de exact alarms e a permissão correspondente no Android 12+ não se resolve pelo JavaScript.
- **Dependências de mediação no Gradle** para o stack de ads com bidding: Meta, Unity, ironSource, InMobi, Liftoff/Vungle. Cada adapter tem sua entrada e vários precisam de configuração adicional no nível do Gradle.
- **Edições em `MainActivity` e `MainApplication`** que não são expressáveis como configuração declarativa.

O `expo prebuild` não sabe nada disso. Ele regenera o projeto a partir do template e dos config plugins que encontrar. Tudo o que foi editado à mão e não está representado num plugin **desaparece**. Não há merge, não há conflito, não há aviso útil: há um `android/` novo e limpo que já não compila o que precisava compilar — ou pior, que compila e perdeu uma feature em silêncio.

Esse "pior" é o cenário que realmente preocupa. Um build que falha é barato: você descobre em dois minutos. Um build que passa, sobe para a Play e depois se revela que os lembretes já não pedem a permissão correta é caro.

## Por que não resolvemos isso com config plugins

A resposta ortodoxa para este problema é: *escreva config plugins*. E ela está certa. Um config plugin pega essas modificações nativas e as expressa como código que roda durante o prebuild, o que torna `android/` descartável de novo e devolve o managed workflow completo.

Não fizemos isso, por três razões honestas:

**O custo não é proporcional ao benefício.** Escrever um plugin para adicionar uma dependência do Gradle é trivial. Escrever um que reproduza fielmente um módulo nativo — o registro no `MainApplication`, as permissões, o comportamento em várias versões do Android — é um projeto por si só, e precisa ser mantido sempre que o Expo muda o formato do template.

**O projeto nativo é estável.** Não mexemos em `android/` com frequência. Ele muda quando adicionamos um adapter de mediação ou um módulo novo, ou seja, poucas vezes por ano. Um artefato que quase não muda ganha pouco por ser regenerável.

**O upgrade de SDK é o único momento em que dói.** E dói de qualquer jeito: com plugins é preciso verificar se os plugins continuam aplicando bem; sem plugins é preciso portar as edições à mão. É trabalho diferente, não necessariamente menos trabalho.

Isto não é uma defesa universal de editar `android/` à mão. É uma decisão de contexto: um estúdio pequeno, um projeto nativo que quase não se move, e uma regra clara para que ninguém — humano ou agente — rode o comando errado.

## Como construímos, então

A regra não significa "não usamos as ferramentas do Expo". Significa que o fluxo é outro:

- **Desenvolvimento local:** `expo run:android`. Compila o projeto nativo que existe, sem regenerá-lo. É o substituto direto de `prebuild` + build, e é o comando que todo o time roda.
- **Releases:** EAS. O build remoto pega o `android/` do repositório exatamente como está.
- **Tudo o que é de fato declarativo** (permissões simples, ícones, splash, schemes) continua vivendo na configuração do Expo, porque para isso o modelo funciona perfeitamente.

A diferença prática é uma só: `android/` está no git e é tratado como código, com review — não como output.

## O trade-off que aceitamos

Vale dizer sem enfeites, porque é real:

- Perdemos a capacidade de apagar `android/` e regenerá-lo quando algo se corrompe.
- Os upgrades de Expo SDK custam mais: é preciso ler o diff do template e portar as mudanças relevantes à mão.
- Um desenvolvedor novo que chega com o modelo mental do Expo vai assumir que `prebuild` é seguro. Por isso a regra está no arquivo de instruções do repositório, em maiúsculas, como primeira linha.

Em troca: os módulos nativos existem, a mediação de ads funciona, e ninguém precisa manter uma camada de plugins que reproduza tudo isso.

## O mesmo vale para o twin

O Biblia TLA é o gêmeo técnico do Bible TPT: mesmo stack, mesmas decisões, o mesmo `android/` editado à mão. A regra é idêntica nos dois repositórios, e quando mudamos um padrão compartilhado (RevenueCat, ads, theming) nós o portamos para o outro. Uma regra que existe em apenas um de dois repositórios é uma regra que alguém vai quebrar no outro.

## Próximos passos

O que ainda está em aberto sobre esta decisão:

1. **Documentar o diff nativo.** Hoje a lista do que está editado à mão em `android/` vive na cabeça de quem editou e no histórico do git. Deveria ser um arquivo explícito, para que o próximo upgrade de SDK seja um checklist e não uma escavação arqueológica.
2. **Reavaliar plugins para o trivial.** As dependências de mediação no Gradle são boas candidatas a config plugin: baixo custo, benefício real. Os módulos nativos, por enquanto, não.
3. **Blindar o comando.** Uma regra escrita pode ser ignorada. Um script que falha ao detectar um `prebuild`, não.

## Perguntas frequentes

**O que o expo prebuild faz exatamente?**
Ele regenera as pastas nativas `android/` e `ios/` do zero, a partir do `app.json` e dos config plugins. Tudo o que foi editado à mão no projeto nativo e não está representado num plugin se perde no processo.

**É seguro rodar o expo prebuild?**
Apenas se `android/` e `ios/` forem de fato artefatos gerados. Se o projeto nativo tem edições à mão — módulos nativos, dependências do Gradle, mudanças no `MainActivity` — o prebuild as apaga sem aviso e sem conflito de merge.

**Como fazer o build de um app Expo sem rodar prebuild?**
Use `expo run:android` no desenvolvimento local, que compila o projeto nativo existente sem regenerá-lo, e EAS para os builds de release, que pega o `android/` do repositório exatamente como está.

**Quando usar config plugins em vez de editar o android/ à mão?**
Quando a mudança é simples e declarativa, como adicionar uma dependência do Gradle. Para módulos nativos completos, o custo de escrever e manter o plugin costuma superar o de portar as edições à mão a cada upgrade de SDK.

### Takeaways

- `expo prebuild` é seguro **apenas se** `android/` for de fato um artefato gerado. No momento em que o projeto nativo é editado à mão, ele deixa de ser.
- A decisão certa não é "prebuild sim" ou "prebuild não": é decidir conscientemente se o seu projeto nativo é output ou é source, e ser coerente com essa escolha em todo o fluxo de build.
- Se optar por tratá-lo como source, escreva isso no repositório onde alguém vá ler antes de rodar o comando — não numa mensagem de Slack de oito meses atrás.
