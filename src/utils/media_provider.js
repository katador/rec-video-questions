
export default class MediaProvider {
  static msnError = "";
  static async init() {
    const constraints = {
      audio: {
        echoCancellation: { exact: false },
      },
      video: {
        width: 1280,
        height: 720,
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      await this.handleSuccess(stream);
    } catch (e) {
      this.msnError = `navigator.getUserMedia error:${e.toString()}`;
      console.log(this.msnError);
    }
  }

  static async handleSuccess(stream) {
    console.log("getUserMedia() got stream:", stream);
    window.stream = stream;
    const gumVideo = document.querySelector("video#gum");
    gumVideo.srcObject = stream;
  }

}
