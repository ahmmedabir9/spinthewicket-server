const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

const blobString =
  "DefaultEndpointsProtocol=https;AccountName=demoprojects;AccountKey=9cFlWASPsYoITwPOW+l1pW9L4vrNkg0z7fLvY5QHZ4DJTv2kDK+wYBVA/ewmbInGegTbBzvImdxeiRJxltfKrQ==;EndpointSuffix=core.windows.net";

//upload file
const uploadFile = async (req, res) => {
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
    await blockBlobClient.upload(file.data, file.data.length);

    let data = { url: blockBlobClient.url, fileName: blobName };
    return response(res, StatusCodes.ACCEPTED, true, data, null);
  } catch (err) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      err,
      err.message
    );
  }
};

//delete file
const deleteFile = async (req, res) => {
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
    const deleted = await blockBlobClient.deleteIfExists();

    return response(
      res,
      StatusCodes.OK,
      true,
      {
        fileName: fileName,
        deleted: deleted ? true : false,
      },
      null
    );
  } catch (err) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      err,
      err.message
    );
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
