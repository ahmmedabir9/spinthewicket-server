var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");
const blobString = "DefaultEndpointsProtocol=https;AccountName=demoprojects;AccountKey=9cFlWASPsYoITwPOW+l1pW9L4vrNkg0z7fLvY5QHZ4DJTv2kDK+wYBVA/ewmbInGegTbBzvImdxeiRJxltfKrQ==;EndpointSuffix=core.windows.net";
//upload file
const uploadFile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (req.files === undefined || !req.files.image) {
        let msg = "No file found !";
        return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }
    const file = req.files.image;
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobString);
    const containerName = "clientprojects";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${uuidv4()}.` + file.name.split(".").pop();
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        yield blockBlobClient.upload(file.data, file.data.length);
        let data = { url: blockBlobClient.url, fileName: blobName };
        return response(res, StatusCodes.ACCEPTED, true, data, null);
    }
    catch (err) {
        return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, err, err.message);
    }
});
//delete file
const deleteFile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { fileName } = req.body;
    if (!fileName) {
        let msg = "please provide all information to delete any file";
        return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobString);
    const containerName = "clientprojects";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const deleted = yield blockBlobClient.deleteIfExists();
        return response(res, StatusCodes.OK, true, {
            fileName: fileName,
            deleted: deleted ? true : false,
        }, null);
    }
    catch (err) {
        return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, err, err.message);
    }
});
module.exports = {
    uploadFile,
    deleteFile,
};
