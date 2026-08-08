import * as Print from 'expo-print';

function buildHtml(imageDataUris: string[]): string {
  const pages = imageDataUris
    .map(
      (src) => `
        <div class="page">
          <img src="${src}" />
        </div>`
    )
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          .page {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
          }
          .page img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>${pages}</body>
    </html>
  `;
}

/**
 * Renders a list of already-cropped page images (base64 JPEG, in order) into
 * a single multi-page PDF. Returns the PDF content as a base64 string; the
 * caller is responsible for persisting it (see lib/storage.ts#saveDocument).
 *
 * We deliberately avoid touching expo-print's returned file URI directly:
 * on Android, expo-print writes to the app's raw (unscoped) cache dir, which
 * falls outside the directory tree expo-file-system's Expo Go permission
 * check allows, causing "Missing 'READ' permission" errors on copy/read.
 * Requesting base64 sidesteps that cross-module file handoff entirely.
 */
export async function createPdfFromImages(imagesBase64: string[]): Promise<string> {
  if (imagesBase64.length === 0) {
    throw new Error('createPdfFromImages: at least one image is required');
  }

  const imageDataUris = imagesBase64.map((base64) => `data:image/jpeg;base64,${base64}`);

  const html = buildHtml(imageDataUris);
  const { base64 } = await Print.printToFileAsync({ html, base64: true });
  if (!base64) {
    throw new Error('Print.printToFileAsync did not return base64 PDF content');
  }
  return base64;
}
