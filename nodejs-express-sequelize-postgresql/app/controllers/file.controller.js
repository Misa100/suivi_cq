const uploadFile = require("../middleware/upload");
const fs = require('fs');

const upload = async(req, res) => {
    try {
        await uploadFile(req,res);

        if(req.file == undefined){
            return res.status(400).send({message: "Please upload a file"});
        }

        res.status(200).send({
            message: "Uploaded the file successfully: "+req.file.originalname,
        });
    } catch (err){
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 2MB!",
          });
        }
        res.status(500).send({
            message: "Could not upload the file : "+err
        })
    }
}


const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    //const directoryPath = "//192.168.4.239/partage/DEV/assets/";
    
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: fullUrl + "/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
}


const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };


  module.exports = {
    upload,
    getListFiles,
    download,
  };