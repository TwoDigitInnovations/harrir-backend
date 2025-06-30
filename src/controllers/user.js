const User = require("@models/User");
const response = require("../../responses");

module.exports = {
  fileUpload: async (req, res) => {
    try {
      if (!req.file) {
       
        return response.badRequest(res, { message: "No file uploaded." });
      }
      return response.ok(res, {
        message: "File uploaded successfully.",
        fileUrl: req.file.path, 
        fileName: req.file.filename,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
