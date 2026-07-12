---
title: "Why we never run expo prebuild on our apps"
description: "Our apps use Expo, but the android/ folder is hand-edited. Here's what prebuild breaks, and why we accept that trade-off."
app: Bible TPT
category: Engineering
translationKey: "why-we-never-run-expo-prebuild"
publishedAt: "2026-07-12"
author: "FusionCore Apps"
tags: ["expo", "react native", "android", "engineering", "build"]
ogImage: "/images/blog/en/why-we-never-run-expo-prebuild.png"
featured: false
faq:
  - question: "What does expo prebuild actually do?"
    answer: "It regenerates the native android/ and ios/ folders from scratch, out of app.json and your config plugins. Anything hand-edited in the native project that isn't represented by a plugin is lost in the process."
  - question: "Is it safe to run expo prebuild?"
    answer: "Only if android/ and ios/ genuinely are generated artifacts. If the native project has hand edits — native modules, Gradle dependencies, MainActivity changes — prebuild wipes them with no warning and no merge conflict."
  - question: "How do I build an Expo app without running prebuild?"
    answer: "Use expo run:android for local development, which compiles the existing native project without regenerating it, and EAS for release builds, which takes android/ from the repo exactly as it is."
  - question: "When should I use config plugins instead of hand-editing android/?"
    answer: "When the change is simple and declarative, such as adding a Gradle dependency. For full native modules, the cost of writing and maintaining the plugin usually exceeds the cost of porting hand edits at each SDK upgrade."
---

There's a rule written in capitals at the top of the Bible TPT repo: **never run `expo prebuild`**. It isn't a style preference. It exists because the command is destructive to the way we build this app, and because the one time someone crosses that line, weeks of native work disappear without warning.

The reasoning is worth spelling out, because the decision isn't obvious and it runs against how Expo is meant to be used.

## What prebuild does, and why that's a problem

Expo's mental model is that `android/` and `ios/` are **generated artifacts**. You describe what you need in `app.json` and in config plugins, you run `expo prebuild`, and Expo regenerates the native projects from scratch out of that description. Delete `android/` and nothing is lost: it comes back. That's the promise of the managed workflow, and it's a good promise.

The problem shows up when the native project stops being an artifact and becomes **source code**.

That already happened to us. Bible TPT's `android/` folder contains:

- **Hand-written native modules**, such as `AlarmPermissionModule`, which exists because verse reminders need exact alarms, and the matching permission on Android 12+ can't be resolved from JavaScript.
- **Gradle mediation dependencies** for the bidding ad stack: Meta, Unity, ironSource, InMobi, Liftoff/Vungle. Each adapter has its entry, and several need extra Gradle-level configuration.
- **Edits to `MainActivity` and `MainApplication`** that can't be expressed as declarative configuration.

`expo prebuild` knows nothing about any of this. It regenerates the project from the template and from whatever config plugins it finds. Everything hand-edited that isn't represented by a plugin **is gone**. No merge, no conflict, no useful warning: just a fresh, clean `android/` that no longer compiles what it needed to compile — or worse, that compiles fine and silently lost a feature.

That "worse" is the scenario that actually keeps us honest. A failing build is cheap: you find out in two minutes. A build that passes, ships to Play, and turns out to no longer request the right permission for reminders is expensive.

## Why we don't solve this with config plugins

The orthodox answer here is: *write config plugins*. And it's the right answer. A config plugin takes those native modifications and expresses them as code that runs during prebuild, which makes `android/` disposable again and hands you back the full managed workflow.

We didn't, for three honest reasons:

**The cost doesn't scale with the benefit.** Writing a plugin to add a Gradle dependency is trivial. Writing one that faithfully reproduces a native module — its registration in `MainApplication`, its permissions, its behaviour across Android versions — is a project of its own, and it has to be maintained every time Expo changes the shape of the template.

**The native project is stable.** We don't touch `android/` often. It changes when we add a mediation adapter or a new module, which is a handful of times a year. An artifact that barely changes gains little from being regenerable.

**The SDK upgrade is the one moment it hurts.** And it hurts either way: with plugins you have to verify the plugins still apply cleanly; without them you port the hand edits yourself. Different work, not obviously less work.

None of this is a general defence of hand-editing `android/`. It's a contextual decision: a small studio, a native project that barely moves, and a clear rule so that nobody — human or agent — runs the wrong command.

## How we build instead

The rule doesn't mean "we don't use Expo's tooling". It means the flow is different:

- **Local development:** `expo run:android`. It compiles the native project that exists, without regenerating it. It's the direct replacement for `prebuild` + build, and it's what everyone on the team runs.
- **Releases:** EAS. The remote build takes `android/` from the repo exactly as it is.
- **Everything that genuinely is declarative** (simple permissions, icons, splash, schemes) still lives in Expo config, because the model works perfectly for that.

The practical difference is a single one: `android/` is in git and treated as code, with review — not as output.

## The trade-off we accept

Worth stating plainly, because it's real:

- We lose the ability to delete `android/` and regenerate it when something gets corrupted.
- Expo SDK upgrades cost more: you read the template diff and port the relevant changes by hand.
- A new developer arriving with the Expo mental model will assume `prebuild` is safe. That's why the rule sits in the repo's instructions file, in capitals, as the first line.

In exchange: the native modules exist, ad mediation works, and nobody has to maintain a plugin layer that reproduces all of it.

## The same applies to the twin

Biblia TLA is Bible TPT's technical twin: same stack, same decisions, the same hand-edited `android/`. The rule is identical in both repos, and when we change a shared pattern (RevenueCat, ads, theming) we port it to the other. A rule that only exists in one of two repos is a rule someone will break in the other.

## Next steps

What's still open on this decision:

1. **Document the native diff.** Right now, the list of what's hand-edited in `android/` lives in the head of whoever edited it and in git history. It should be an explicit file, so the next SDK upgrade is a checklist rather than an archaeology dig.
2. **Reconsider plugins for the trivial parts.** The Gradle mediation dependencies are a good config-plugin candidate: low cost, real benefit. The native modules, for now, are not.
3. **Harden the command.** A written rule can be ignored. A script that fails when it detects a `prebuild` cannot.

## Frequently asked questions

**What does expo prebuild actually do?**
It regenerates the native `android/` and `ios/` folders from scratch, out of `app.json` and your config plugins. Anything hand-edited in the native project that isn't represented by a plugin is lost in the process.

**Is it safe to run expo prebuild?**
Only if `android/` and `ios/` genuinely are generated artifacts. If the native project has hand edits — native modules, Gradle dependencies, `MainActivity` changes — prebuild wipes them with no warning and no merge conflict.

**How do I build an Expo app without running prebuild?**
Use `expo run:android` for local development, which compiles the existing native project without regenerating it, and EAS for release builds, which takes `android/` from the repo exactly as it is.

**When should I use config plugins instead of hand-editing android/?**
When the change is simple and declarative, such as adding a Gradle dependency. For full native modules, the cost of writing and maintaining the plugin usually exceeds the cost of porting hand edits at each SDK upgrade.

### Takeaways

- `expo prebuild` is safe **only if** `android/` really is a generated artifact. The moment you hand-edit the native project, it stops being one.
- The right call isn't "prebuild yes" or "prebuild no": it's deciding deliberately whether your native project is output or source, and being consistent with that choice across the whole build flow.
- If you choose to treat it as source, write it down where someone will read it before running the command — not in a Slack message from eight months ago.
