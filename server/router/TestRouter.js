const express = require("express");
const router = express.Router();
const {db,genid} = require("../db/DbUtils");

router.get("/test",async (req,res)=>{
    let out = await db.async.all("select *  from `admin`",[]);
    res.send({
        id:genid.NextId(),
        out//=out:out
    });
})

module.exports = router;