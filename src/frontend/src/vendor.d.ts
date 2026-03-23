declare module "html2canvas" {
  function html2canvas(
    element: HTMLElement,
    options?: Record<string, unknown>,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module "jspdf" {
  interface jsPDFOptions {
    orientation?: string;
    unit?: string;
    format?: string;
  }
  class jsPDF {
    constructor(options?: jsPDFOptions);
    internal: { pageSize: { getWidth(): number; getHeight(): number } };
    addImage(
      data: string,
      format: string,
      x: number,
      y: number,
      w: number,
      h: number,
    ): void;
    addPage(): void;
    save(filename: string): void;
  }
  export default jsPDF;
}
