const express = require("express");
const router = express.Router();
const {db,genid} = require("../db/DbUtils");

router.get("/detail",async(req,res)=>{
    let {id} = req.query;
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ? ";
    let {err,rows} = await db.async.all(detail_sql,[id]);
    if(err==null){
        res.send({
            code:200,
            msg:"success",
            rows
        });
    }else{
        res.send({
            code:404,
            msg:"获取失败"
        });
    }
});

//Add Blog
router.post("/_token/add",async (req,res)=>{
    const { title,category_id,content } = req.body;
    let id =genid.NextId();
    let create_time = new Date().getTime();
    const insert_sql = "INSERT INTO `blog` (`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)";
    let params = [id,title,category_id,content,create_time];
    let {err,rows} = await db.async.run(insert_sql,params);
    if(err==null){
        res.send({
            code:200,
            msg:"添加成功"
        });
    }else{
        res.send({
            code:404,
            msg:"添加失败"
        });
    };
});

//Change Blog
router.put("/_token/update",async (req,res)=>{
    const { id,title,category_id,content } = req.body;
    const update_time = new Date().getTime();
    //let id =genid.NextId();
    const update_sql = "UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ?,`update_time` = ? WHERE `id` = ?";
    let params = [title,content,category_id,update_time,id];
    let {err,rows} = await db.async.run(update_sql,params);
    if(err==null){
        res.send({
            code:200,
            msg:"更新成功"
        });
    }else{
        res.send({
            code:404,
            msg:"更新失败"
        });
    };
});
//Delete Blog /blog/delete?id=xxx
router.delete("/_token/delete",async (req,res)=>{
    let id = req.query.id;
    //let create_time = new Date().getTime();
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ? ";

    //let params = [title,content,category_id,create_time,id];
    let {err,rows} = await db.async.run(delete_sql,[id]);
    if(err==null){
        res.send({
            code:200,
            msg:"删除成功"
        });
    }else{
        res.send({
            code:404,
            msg:"删除失败"
        });
    };
});
//Search Blog
router.get("/search",async(req,res)=>{
    /**
     * keyword query
     * category_id query
     * 
     * page change:
     * 1.page number
     * 2.page size
     */

    /**Here:传入的参数为"category_id=xxx"时返回500error,"categoryId=xxx"时返回200正常
     * 需注意此处转换情况
     */
    /**Here Answer:
     * 实为Sql bug导致忽略部分参数
     */
    let {keyword,category_id,page,pageSize} = req.query;
    page = page == null ? 1 : page;
    pageSize = pageSize ==null ? 10 : pageSize;
    category_id = category_id == null ? 0 : category_id;
    keyword = keyword ==null ? "" : keyword;

    let params = [];
    let whereSqls = [];
    if(category_id != 0){
        whereSqls.push(" `category_id` = ?");
        params.push(category_id);
    }

    if(keyword != ""){
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?)");
        params.push("%"+keyword+"%");
        params.push("%"+keyword+"%");
    }

    let whereSqlStr = "";
    if(whereSqls.length!=0){
        whereSqlStr = " WHERE"+whereSqls.join(" AND ");
    }

    let searchSql = "SELECT * FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? ";
    let searchSqlParams = params.concat([(page-1)*pageSize,pageSize]);
    
    let searchCountSql = " SELECT count(*) FROM `blog` " +whereSqlStr;
    /**Here:可增加params数组大小，尝试js的sqlite中是否忽略多余参数 */
    let searchCountParams = params;

    let searchResult = await db.async.all(searchSql,searchSqlParams);
    let countResult = await db.async.all(searchCountSql,searchCountParams);

    if(searchResult.err == null && countResult.err == null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,category_id,page,pageSize,
                rows:searchResult.rows,
                count:countResult.rows[0]["count(*)"]

            }
        });
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        });

    }
});


router.get("/test",async (req,res)=>{
    let out = await db.async.all("select *  from `admin`",[]);
    res.send({
        id:genid.NextId(),
        out//=out:out
    });
})

module.exports = router;