import { useCallback, useEffect, useMemo, useReducer } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { recognizer } from "./Recognizer";
import { adjustImage, loadImage, useImageUrl } from "./imageUtils";
import { css } from "@emotion/react";

type WidgetState =
  | { state: "Init" }
  | { state: "Selecting"; crop: Crop }
  | { state: "Selected"; crop: Crop }
  | { state: "Recognized"; crop: Crop; result: string }
  | { state: "Unselected" };

type WidgetAction =
  | { action: "Change"; crop: Crop }
  | { action: "Complete"; crop: Crop }
  | { action: "SetResult"; result: string }
  | { action: "Unselect" };

function stateReducer(prev: WidgetState, action: WidgetAction): WidgetState {
  switch (action.action) {
    case "Unselect":
      return { state: "Unselected" };
    case "Change":
      return { state: "Selecting", crop: action.crop };
    case "Complete":
      return { state: "Selected", crop: action.crop };
    case "SetResult":
      if (prev.state === "Selected") {
        return { state: "Recognized", crop: prev.crop, result: action.result };
      }
      return prev;
    default:
      throw new Error("invalid action");
  }
}

export type ImageRecognizeWidgetProps = {
  file: File;
};

export function ImageRecognizeWidget(props: ImageRecognizeWidgetProps) {
  const url = useImageUrl(props.file);
  const imagePromise = useMemo(() => loadImage(url), [url]);

  const [state, setState] = useReducer(stateReducer, { state: "Init" });

  const onChange = useCallback((crop: Crop) => {
    setState({ action: "Change", crop });
  }, []);

  const setSelection = useCallback(
    async (crop: Crop) => {
      if (!crop || crop.width == 0 || crop.height == 0) {
        setState({ action: "Unselect" });
        return;
      }

      setState({ action: "Complete", crop });
      const image = await imagePromise;
      const adjusted = adjustImage(image, {
        top: crop.y,
        left: crop.x,
        width: crop.width,
        height: crop.height,
      });
      const result = await recognizer.recognize(adjusted);
      setState({ action: "SetResult", result: result.data.text });
    },
    [imagePromise]
  );

  useEffect(() => {
    async function run() {
      const image = await imagePromise;
      const initialCrop = getInitialCrop(image);
      await setSelection(initialCrop);
    }

    run().catch(console.error);
  }, [imagePromise]);

  const crop = getCrop(state);
  const alt = getAltText(state);
  const status = getStatusText(state);
  return (
    <ContentBox>
      <ReactCrop crop={crop} onChange={onChange} onComplete={setSelection}>
        {/* div 로 감싸지 않으면 ReactCrop_child-wrapper 이 이미지를 맘대로 width:100% 한다.*/}
        <img src={url} alt={alt} />
      </ReactCrop>
      {status ? <p>{status}</p> : undefined}
    </ContentBox>
  );
}

function getInitialCrop(box: { width: number; height: number }): Crop {
  if (box.width * box.height < 500 * 500) {
    return {
      x: 0,
      y: 0,
      width: box.width,
      height: box.height,
      unit: "px",
    };
  } else {
    const width = Math.min(box.width / 2, 300);
    const height = Math.min(box.height / 2, 300);

    return {
      x: (box.width - width) / 2,
      y: (box.height - height) / 2,
      width: width,
      height: height,
      unit: "px",
    };
  }
}

function getCrop(state: WidgetState): Crop {
  switch (state.state) {
    case "Init":
    case "Unselected":
      return { x: 0, y: 0, height: 0, width: 0, unit: "px" };
    default:
      return state.crop;
  }
}

function getAltText(state: WidgetState) {
  switch (state.state) {
    case "Selected":
      return "Recognizing image";
    case "Recognized":
      return `Recognized text: ${state.result}`;
    default:
      return "Unrecognized image";
  }
}

function getStatusText(state: WidgetState) {
  switch (state.state) {
    case "Selected":
      return "Recognizing image";
    case "Recognized":
      return `Recognized text: ${state.result}`;
  }
}

const contentBoxStyle = css({
  width: "max-content",
  height: "max-content",
});

function ContentBox(props: React.ComponentProps<any>) {
  return <div css={contentBoxStyle} {...props} />;
}
