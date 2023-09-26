const fs = require("fs/promises");
module.exports = () => {
  return fs
    .readFile(
      "__tests__/assets/not_a_plant.jpg"
    )
    .then((image) => {
      const arrayBuffer = new Uint8Array(image).buffer;
      const toSend = new File([arrayBuffer], "image");
      const formData = new FormData();
      formData.append("image", toSend);
      return formData;
    });
};
