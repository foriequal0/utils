import { useCallback, useState } from "react";
import "./App.css";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { recognizer } from "./Recognizer";

export type ImageRecognizeWidgetProps = {
  file: File;
};

export function ImageRecognizeWidget(props: ImageRecognizeWidgetProps) {
  const [crop, setCrop] = useState<Crop>();
  const [result, setResult] = useState<string | undefined>();

  const onComplete = useCallback(async (crop: Crop) => {
    const result = await recognizer.recognize(props.file, {
      rectangle: {
        top: crop.y,
        left: crop.x,
        width: crop.width,
        height: crop.height,
      },
    });

    setResult(result.data.text);
  }, []);

  const onLoad = useCallback(async (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const image = event.currentTarget;
    let initialCrop: Crop;
    if (image.width * image.height < 300 * 300) {
      initialCrop = {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
        unit: "px",
      };
    } else {
      const width = Math.min(image.width / 2, 300);
      const height = Math.min(image.height / 2, 300);

      initialCrop = {
        x: (image.width - width) / 2,
        y: (image.height - height) / 2,
        width: width,
        height: height,
        unit: "px",
      };
    }

    setCrop(initialCrop);
  }, []);

  const url = URL.createObjectURL(props.file);
  let image;
  if (!crop) {
    image = <img src={url} alt="Unrecognized image" onLoad={onLoad} />;
  } else if (!result) {
    image = (
      <>
        <ReactCrop crop={crop} onChange={setCrop} onComplete={onComplete}>
          <img src={url} alt="Recognizing image" />
        </ReactCrop>
        <p>Recognizing</p>
      </>
    );
  } else {
    image = (
      <>
        <ReactCrop crop={crop} onChange={setCrop} onComplete={onComplete}>
          <img src={url} alt={`Recognized text: '${result}'`} />
        </ReactCrop>
        <p>Result: {result}</p>
      </>
    );
  }

  return <div>{image}</div>;
}
