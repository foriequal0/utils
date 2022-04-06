import { useEffect, useMemo } from "react";
import assert from "assert";

export function useImageUrl(file: Blob | MediaSource): string {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = url;
  });
}

export type Rectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function adjustImage(image: HTMLImageElement, rect: Rectangle): HTMLCanvasElement {
  let multiplier: number;
  if (rect.width * rect.height < 100 * 100) {
    multiplier = 4.0;
  } else if (rect.width * rect.height < 200 * 200) {
    multiplier = 2.0;
  } else {
    multiplier = 1.0;
  }

  const padding = 50;

  const canvas = document.createElement("canvas");
  canvas.width = rect.width * multiplier + padding * 2;
  canvas.height = rect.height * multiplier + padding * 2;

  const ctx = canvas.getContext("2d");
  assert(ctx);
  ctx.drawImage(
    image,
    rect.left,
    rect.top,
    rect.width,
    rect.height,
    padding,
    padding,
    rect.width * multiplier,
    rect.height * multiplier
  );

  return canvas;
}
