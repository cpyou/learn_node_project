
var express = require('express');
var router = express.Router();
//引入数据库Message模块
var Message = require('../models/message');
const logger = require('../log-config').getLogger(__filename)//根据需要获取logger

//查找所有留言
router.get('/', function(req, res, next) {
    logger.info('访问根目录', req.body);
    Message.findAll().then(function(msgs) {
        res.render('index', { messages: msgs });
    });
});

//删除一个留言
router.get('/del_msg', function(req, res, next) {
    logger.info('删除一个留言', req.body)
    //如果没有id字段,返回404
    if (req.query.id == undefined ||req.query.id == '') {
        res.render('404', {});
        return;
    }
    //先查找,再调用删除,最后返回首页
    Message.findOne({
        where:{
            id:req.query.id
        }
    }).then(function(msg){
        msg.destroy().then(function(){
            console.log('delete success !!');
            res.redirect('/');
        });
    });
});

//添加一条留言
router.post('/add_msg', function(req, res, next) {
    logger.info('添加一条留言', req.body)
    //如果没有post数据或者数据为空,直接返回
    if (req.body.username == undefined ||req.body.username == ''
        || req.body.content == undefined || req.body.content == '') {
        res.render('404', {});
        return;
    }
    var message = {
        username: req.body.username,
        content: req.body.content
    };
    //创建一条记录,创建成功后跳转回首页
    Message.create(message).then(function(msg){
        console.log(msg);
        res.redirect('/');
    });
});

module.exports = router;