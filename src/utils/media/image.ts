import { TECH, LABELS, THEME } from '../../data/config';

/**
 * resolveVisualAssetUrl: Harmonizes raw storage paths into valid public URLs.
 */
export const resolveVisualAssetUrl = (assetPath: string | null | undefined): string | null => {
  if (!assetPath) return null;
  // Early exit if the path is already an absolute URL or data URI
  if (assetPath.startsWith('http') || assetPath.startsWith('data:')) return assetPath;
  
  const applicationBaseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
  const standardizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${applicationBaseUrl}${standardizedPath}`;
};

// Centralized placeholder for products without images
export const PLACEHOLDER_VISUAL_SYMBOL = TECH.storage.placeholderEmoji;

/**
 * sanitizeFileName: Prepares a safe string for storage paths.
 * Replaces Turkish characters and non-alphanumeric symbols.
 */
export const sanitizeFileName = (input: string): string => {
  const turkishMap: Record<string, string> = { 
    'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u',
    'Ç':'C','Ğ':'G','İ':'I','Ö':'O','Ş':'S','Ü':'U' 
  };
  
  return input
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m: string) => turkishMap[m])
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .substring(0, TECH.products.maxFileNameLength);
};

/**
 * transformFileToVisualElement: Asynchronously converts a raw File object to an HTML Image.
 */
const transformFileToVisualElement = (visualFile: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const visualElement = new Image();
      visualElement.onload = () => resolve(visualElement);
      visualElement.onerror = () => reject(new Error(LABELS.errors.imageLoad));
      visualElement.src = event.target?.result as string;
    };
    fileReader.onerror = () => reject(new Error(LABELS.errors.fileRead));
    fileReader.readAsDataURL(visualFile);
  });
};

/**
 * processDualQualityVisuals: Generates high-definition and preview-optimized copies from a single file.
 */
export async function processDualQualityVisuals(visualFile: File, hqMaxWidth?: number): Promise<{ hq: Blob, lq: Blob }> {
  const visualElement = await transformFileToVisualElement(visualFile);
  
  /**
   * generateOptimizedBlob: Resizes and compresses the image into a specific Blob tier.
   */
  const generateOptimizedBlob = (maximumDimension: number, compressionQuality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const drawingCanvas = document.createElement('canvas');
      let { width: originalWidth, height: originalHeight } = visualElement;

      // Aspect-Ratio Preserving Downscaling Logic
      if (originalWidth > originalHeight && originalWidth > maximumDimension) {
        originalHeight = Math.round((originalHeight * maximumDimension) / originalWidth);
        originalWidth = maximumDimension;
      } else if (originalHeight > maximumDimension) {
        originalWidth = Math.round((originalWidth * maximumDimension) / originalHeight);
        originalHeight = maximumDimension;
      }

      drawingCanvas.width = originalWidth;
      drawingCanvas.height = originalHeight;
      const drawingContext = drawingCanvas.getContext('2d');
      
      if (drawingContext) {
        // Fallback Background: Prevents transparency issues in JPEGs
        drawingContext.fillStyle = THEME.colors.visualFallback;
        drawingContext.fillRect(0, 0, originalWidth, originalHeight);
        drawingContext.drawImage(visualElement, 0, 0, originalWidth, originalHeight);
      }
      
      drawingCanvas.toBlob((optimizedBlob) => resolve(optimizedBlob!), 'image/jpeg', compressionQuality);
    });
  };

  // Tier 1: High-Definition Asset for Zoom/Detail views
  const hqLimit = hqMaxWidth || TECH.storage.productHqWidth;
  const highDefinitionAsset = await generateOptimizedBlob(hqLimit, TECH.storage.hqQuality);
  
  // Tier 2: Lightweight Preview Asset for Catalog/Grid views
  const previewLightweightAsset = await generateOptimizedBlob(TECH.storage.productLqWidth, TECH.storage.lqQuality);

  return { hq: highDefinitionAsset, lq: previewLightweightAsset };
}

/**
 * compressVisualToDataUri: Legacy-compatible compression for immediate Base64 feedback.
 */
export async function compressVisualToDataUri(visualFile: File, maximumDimension: number, compressionQuality: number): Promise<string> {
  const visualElement = await transformFileToVisualElement(visualFile);
  const drawingCanvas = document.createElement('canvas');
  let { width: originalWidth, height: originalHeight } = visualElement;

  if (originalWidth > originalHeight && originalWidth > maximumDimension) {
    originalHeight = Math.round((originalHeight * maximumDimension) / originalWidth);
    originalWidth = maximumDimension;
  } else if (originalHeight > maximumDimension) {
    originalWidth = Math.round((originalWidth * maximumDimension) / originalHeight);
    originalHeight = maximumDimension;
  }

  drawingCanvas.width = originalWidth;
  drawingCanvas.height = originalHeight;
  const drawingContext = drawingCanvas.getContext('2d');
  
  if (drawingContext) {
    drawingContext.fillStyle = THEME.colors.visualFallback;
    drawingContext.fillRect(0, 0, originalWidth, originalHeight);
    drawingContext.drawImage(visualElement, 0, 0, originalWidth, originalHeight);
  }
  
  return drawingCanvas.toDataURL('image/jpeg', compressionQuality);
}

/**
 * downloadHighQualityImage: Fetches a high-definition version of an asset and triggers a browser download.
 */
export async function downloadHighQualityImage(imageUrl: string, fileName: string) {
  try {
    const highQualityUrl = imageUrl.replace('/lq/', '/hq/').split('?')[0];
    const response = await fetch(highQualityUrl);
    const blob = await response.blob();
    const localUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = localUrl;
    downloadLink.download = `hq-${fileName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    window.URL.revokeObjectURL(localUrl);
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Resim indirilemedi.');
  }
}
