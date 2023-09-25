const fs = require("fs/promises");
module.exports = () => {
  return fs
    .readFile(
      "__tests__/assets/Abies_alba_Mount_Auburn_Cemetery.jpg"
    )
    .then((image) => {
      const arrayBuffer = new Uint8Array(image).buffer;
      const toSend = new File([arrayBuffer], "image");
      const formData = new FormData();
      formData.append("image", toSend);
      return formData;
    });
};
