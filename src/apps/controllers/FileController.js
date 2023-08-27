class FileController {
  async upload(req, res) {
    const { filename } = req.file;
    return res.status(200).json({ url: `upload/${filename}` });
  }
}

module.exports = new FileController();
