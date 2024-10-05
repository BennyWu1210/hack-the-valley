declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: { scale?: number };
      jsPDF?: { unit?: string; format?: string; orientation?: string };
    }
  
    interface Html2Pdf {
      from(element: HTMLElement): this;
      set(opt: Html2PdfOptions): this;
      save(): void;
    }
  
    function html2pdf(): Html2Pdf;
  
    export default html2pdf;
  }
  