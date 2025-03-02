const express = require("express");
const router = express.Router();
const fs= require("fs");
const {db,genid } = require("../db/DbUtils");
router.post("/rich_editor_upload",async (req,res)=>{
    if(!req.files){
        res.send({
            "errno":1, // 只要不等于 0 就行
            "message":"失败信息"
        });
        return;
    }
    let files = req.files;
    let ret_files = [];

    for(let file of files){
        //get postfix
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".")+1);
        console.log(file_ext);
        //random file name
        let file_name = genid.NextId()+"."+file_ext;
        console.log(file_name);
        //Change & Move the name of file
        fs.renameSync
            (process.cwd()+"/public/upload/temp/"+file.filename,
            process.cwd()+"/public/upload/"+file_name
            /**Notation */
        );
        ret_files.push("/upload/"+file_name);
    }
    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，必须
            "alt": "yyy", // 图片描述文字，非必须
            "href": "zzz" // 图片的链接，非必须
        }
    });
});

module.exports = router;