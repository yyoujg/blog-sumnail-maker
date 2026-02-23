interface Window {
  html2canvas?: (
    element: HTMLElement,
    options?: { scale?: number; useCORS?: boolean; backgroundColor?: string | null }
  ) => Promise<HTMLCanvasElement>;
}
