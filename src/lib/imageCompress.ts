const MAX_DIMENSION = 1200;
const QUALITY_MIN = 0.4;
const QUALITY_MAX = 0.95;
const SEARCH_ITERATIONS = 7;

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function toWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
      "image/webp",
      quality,
    );
  });
}

export async function compressToWebp(
  file: File,
  targetBytes = 100_000,
): Promise<File> {
  const img = await loadImage(file);

  let width = img.naturalWidth;
  let height = img.naturalHeight;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context недоступен");
  ctx.drawImage(img, 0, 0, width, height);

  let lo = QUALITY_MIN;
  let hi = QUALITY_MAX;
  let best: Blob | null = null;

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const q = (lo + hi) / 2;
    const blob = await toWebpBlob(canvas, q);
    if (blob.size <= targetBytes) {
      best = blob;
      lo = q;
    } else {
      hi = q;
    }
  }

  if (!best) {
    best = await toWebpBlob(canvas, QUALITY_MIN);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([best], `${baseName}.webp`, { type: "image/webp" });
}
