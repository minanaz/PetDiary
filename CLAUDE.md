@AGENTS.md

# PetDiary — project notes

A small, offline-first pet care journal. Add pets, log their care (meals, walks,
meds, vet visits) with photos and notes, get reminders, and see local weather to
plan walks. Single-user, all data stored locally on the device.

## Target

Grade 5.0 = all 15 base criteria + 2 extended criteria:

- C: external API (OpenWeatherMap, on the Today screen)
- D: advanced UX (animations + haptics)

## Stack

Expo (SDK 54) · TypeScript · Expo Router · Context API · AsyncStorage ·
expo-image-picker · expo-notifications · expo-haptics · reanimated +
gesture-handler · Jest + RN Testing Library · ESLint + Prettier.

## Architecture rules

- Two data shapes only: Pet and Activity.
- Screens never touch storage/APIs directly — they go through `services/`,
  so a future cloud backend + auth can be added without rewriting screens.
- All styling reads tokens from `constants/theme.ts`. No hardcoded hex/px.
- Install packages with `npx expo install` (SDK-correct versions).

## Structure

app/ routes · components/ UI · constants/ tokens+types ·
context/ state · services/ storage+API · hooks/ custom hooks
