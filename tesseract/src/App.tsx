import { useCallback, useEffect, useState } from "react";
import { ImageRecognizeWidget } from "./ImageRecognizeWidget";

export default function App() {
  const [files, setFiles] = useState<File[]>([]);

  const onFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    setFiles([...files]);
  }, []);

  useEffect(() => {
    function listener(event: ClipboardEvent) {
      const items = event.clipboardData?.items ?? [];
      const files: File[] = [];
      for (const item of items) {
        if (item.kind !== "file" || !item.type.startsWith("image/")) {
          continue;
        }

        const file = item.getAsFile()!;
        files.push(file);
      }
      setFiles(files);
    }

    document.addEventListener("paste", listener);
    return () => {
      document.removeEventListener("paste", listener);
    };
  }, []);

  return (
    <>
      <h1>OCR your image with Tesseract.js</h1>
      <label htmlFor="file">Select or paste an image.</label>
      <input id="img" type="file" name="img" accept="image/png, image/jpeg" multiple={true} onChange={onFileUpload} />
      {files.map((file) => (
        <ImageRecognizeWidget key={file.name} file={file} />
      ))}
    </>
  );
}
