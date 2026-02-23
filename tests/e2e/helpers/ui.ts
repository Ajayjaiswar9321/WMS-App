import type { Page, TestInfo } from '@playwright/test';
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';

const ERROR_REPORT_FILE = path.resolve(process.cwd(), 'test-results', 'error-images.md');

export async function pause(page: Page, ms = 500) {
  await page.waitForTimeout(ms);
}

export async function capture(page: Page, testInfo: TestInfo, name: string) {
  try {
    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
    });
  } catch {
    // Ignore capture failures when the page is no longer available.
  }
}

export async function stepWithCapture(page: Page, testInfo: TestInfo, name: string, pauseMs = 450) {
  await pause(page, pauseMs);
  await capture(page, testInfo, name);
}

export async function recordFailureImage(page: Page, testInfo: TestInfo) {
  if (testInfo.status === testInfo.expectedStatus) return;

  const imageName = 'error-captured.png';
  const imagePath = testInfo.outputPath(imageName);

  try {
    await page.screenshot({
      path: imagePath,
      fullPage: true,
    });
  } catch {
    // Ignore if page is already closed; Playwright still keeps default failure assets.
  }

  await mkdir(path.dirname(ERROR_REPORT_FILE), { recursive: true });

  let hasHeader = false;
  try {
    const existing = await readFile(ERROR_REPORT_FILE, 'utf8');
    hasHeader = existing.includes('# Playwright Error Images');
  } catch {
    hasHeader = false;
  }

  if (!hasHeader) {
    await writeFile(
      ERROR_REPORT_FILE,
      `# Playwright Error Images\n\nGenerated automatically from failed tests.\n\n`,
      'utf8'
    );
  }

  const relativeImagePath = path
    .relative(path.dirname(ERROR_REPORT_FILE), imagePath)
    .replaceAll('\\', '/');
  const testPath = testInfo.titlePath.join(' > ');
  const entry = [
    `## ${testPath}`,
    `- Browser: ${testInfo.project.name}`,
    `- Status: ${testInfo.status}`,
    `- Screenshot: \`${relativeImagePath}\``,
    `![${testInfo.title}](./${relativeImagePath})`,
    '',
  ].join('\n');

  await appendFile(ERROR_REPORT_FILE, entry, 'utf8');
}
