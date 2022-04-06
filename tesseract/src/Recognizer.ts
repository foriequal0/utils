import Tesseract from "tesseract.js";

export class Recognizer {
  private readonly getWorker: Promise<Tesseract.Worker>;

  public constructor() {
    const worker = Tesseract.createWorker({
      langPath: "https://foriequal0.github.io/utils/tesseract",
      logger: console.log,
    });

    this.getWorker = (async function () {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      return worker;
    })();
  }

  public async recognize(image: Tesseract.ImageLike) {
    const worker = await this.getWorker;
    return await worker.recognize(image);
  }
}

export const recognizer = new Recognizer();
