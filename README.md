# CamPaper

CamPaper is a mobile document scanner built with Expo and React Native. It uses the device camera with live edge detection to capture pages, then turns them into a shareable multi-page PDF stored locally on the device.

## Features

- **Scan to PDF** — full-screen native scanning flow with live edge detection, manual corner adjustment, and multi-page capture in one session.
- **Document library** — browse saved documents in list or grid view, switchable from the home screen header.
- **Document details** — open, share, rename, or delete a saved document; missing files (e.g. after external deletion) are flagged with a cleanup option.
- **Page editing** — replace individual pages, add new scanned pages, or delete pages from an existing document, then re-render the PDF.
- **Paper size** — choose the PDF page size (A4, Letter, Legal, F4) in Settings; applied whenever a PDF is generated.
- **Language** — Indonesian and English, either following the system locale or set manually in Settings.

## Tech stack

- [Expo](https://docs.expo.dev/versions/v57.0.0/) (SDK 57) with [expo-router](https://docs.expo.dev/versions/v57.0.0/sdk/router/) for file-based navigation
- React Native 0.86 / React 19
- [react-native-document-scanner-plugin](https://www.npmjs.com/package/react-native-document-scanner-plugin) for native document scanning
- [expo-print](https://docs.expo.dev/versions/v57.0.0/sdk/print/) to render scanned pages into a PDF
- [expo-file-system](https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/) and `@react-native-async-storage/async-storage` for on-device storage and preferences
- [expo-sharing](https://docs.expo.dev/versions/v57.0.0/sdk/sharing/) to share generated PDFs

## Project structure

```
app/                       # expo-router screens
  index.tsx                 # document library (list/grid)
  camera.tsx                 # scan flow, generates the initial PDF
  settings.tsx                # language and paper size settings
  document/[id]/index.tsx      # document detail (open/share/rename/delete)
  document/[id]/edit.tsx        # page-level editing
components/                # shared UI components
lib/                        # storage, PDF generation, i18n, settings providers
constants/                  # theme/colors
```

## Getting started

This project uses a custom dev client (native scanner module), so it does not run inside Expo Go.

```bash
npm install
npm run android   # builds and runs a dev client on Android
npm start         # starts the dev server for an already-installed dev client
```

For iOS, open the `ios/` project in Xcode or use `npx expo run:ios`.

> Expo SDK has changed significantly across versions — consult the versioned docs at https://docs.expo.dev/versions/v57.0.0/ rather than general Expo docs when working on this codebase.

## License

MIT — see [LICENSE](LICENSE).
