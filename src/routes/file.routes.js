const { Router } = require("express");
const { uploadFile, deleteFile } = require("../controllers/file.controller");

const router = Router();

//api: url/file/__
router.post("/upload", uploadFile);
router.post("/delete", deleteFile);

module.exports = router;
