declare module "qrcodejs2" {
  export default class QRCode {
    constructor(
      element: HTMLElement,
      options: {
        text: string
        width?: number
        height?: number
        colorDark?: string
        colorLight?: string
        correctLevel?: number
      }
    )
    static CorrectLevel: {
      L: number
      M: number
      Q: number
      H: number
    }
  }
}
