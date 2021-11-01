'use strict';

const kexpress = require('kexpress');
const path = require('path');
const util = require('util');
const fs = require("fs");
const marked = require( "marked" );
const Action = kexpress.core.action.Action;
const {
    exec_python,
    exec_R
} = require('../../../tool/exeu');
const {exec_mv} = require('../../../tool/execmv');
const prehandlers = require('./task.pspec');
const {
    Model,
    Task, 
    RawData,
    ProcessedData
} = require('../models/index');
const rawdata = require('../models/rawdata');
const { type } = require('unique-model');
const { stringify } = require('querystring');

const actionCreateTask = Action.Create({

    name: 'CreateTask',
    summary: '',
    description: '',
    prehandlers: prehandlers.actionCreateTask,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const {taskDao, modelDao, rawDataDao, processedDataDao} = ctx.store.default;
      const rawurl = req.body.rawurl;
      const rawtype = req.body.rawtype;
      const inputparams = req.body.inputparams;
      const outparams =  req.body.outparams;
      const model = await modelDao.findOne({
        name: req.body.modelname
      });
      if (!model) {
        throw new ctx.errors.ModelNotExist();
      }
      const count = await taskDao.count();
      const tmpname = req.body.taskname;
      let t1 = await taskDao.findOne({
        name: tmpname
      });
      if(t1){
        throw new ctx.errors.TaskExist();
      }
    
      const taskname=req.body.taskname+'_'+count;
      const home =path.join( path.dirname(require.main.filename),'upload/'+taskname+'/');
      if (!fs.existsSync(home)){
        fs.mkdirSync(home);
      }
      let inputlist=inputparams;
      if(!inputlist){
        inputlist='[]';
      }
      inputlist=JSON.parse(inputlist);
      for(var i=0;i<inputlist.length;i++)
        {
            if (inputlist[i]['type'] == 'file'){
              if(String(inputlist[i]['default']).trim()==''){
                throw new ctx.errors.FileEmpty();
              }
              inputlist[i]['value'] = path.join(path.join(path.dirname(require.main.filename), 'upload/'), String(inputlist[i]['default']));
              console.log(inputlist[i]['value']);
              const stat = util.promisify(fs.stat);
              async function readStats(dir) {
                  try {
                       let stats = await stat(dir);
                  } catch (err) { // Handle the error.
                       throw new ctx.errors.FileNotFound();
                    }
              }
              await readStats(inputlist[i]['value']);
            }
        }

      const description=model.description; 
      const task = new Task({
//          username: req.session.User.loginName,
          name: taskname,
          description: description,
          model: model,  
          status: 'ready',
          inputparams: inputparams,
          outparams: outparams,
          createdAt: new Date().getTime()
      })
    let rawdata = await rawDataDao.findOne({
        url: rawurl,
        type: rawtype
    })
    if (!rawdata){
        rawdata = new RawData({
            url: rawurl,
            type: model.name
        });
        rawdata = await rawDataDao.create(rawdata)
        task['rawdata'] = rawdata
    }
      
      let t = await taskDao.create(task);

      let callback = function (err,exeu) {
        t['status'] = 'initialize failed'
        t['stdout'] = exeu+ err;
        t['finishedAt'] = new Date(); 
        t['outparams'] =  JSON.stringify(outparams);
        taskDao.updateOne(t); 
      }
     exec_mv(home, callback,inputlist);

     
      res.json({
        msg: 'success',
        id: t.id,
        name: t.name
      });
    }
  });

  const actionUpdateStatus = Action.Create({

    name: 'UpdateStatus',
    summary: '',
    description: '',
    prehandlers: prehandlers.actionUpdateStatus,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      
      
      const { taskDao } = ctx.store.default;
      const id= req.body.id;
      const status =req.body.status;

      let t = await taskDao.findOne({
        id: id
      });
      if (!t) {
        throw new ctx.errors.TaskNotExist();
      }
      const taskname = t['name']

      const home =path.join( path.dirname(require.main.filename),'upload/'+taskname+'/');


      t['status'] = status
      if (status == 'executing'){
        let task = await t.$extract({
            includes: {
//                username: true,
                name: true,
                rawdata : {
                    url: true,
                    type: true
                },
                processeddata : {
                    url: true,
                    type: true
                },
                model: {
                type:true,
                url: true
                },
                inputparams:true,
                outparams:true,
                description: true,
                status: true
            }
            });
            let callback1 = function (err,exeu, log) {

                t['status'] = 'failed'
                t['stdout'] = exeu+ err;
                t['log'] = log
                t['finishedAt'] = new Date();
                t['outparams'] =  JSON.stringify(outparams);
                taskDao.updateOne(t);
            }
            let callback2 = function(stdout,exeu, log) {
                t['status'] = 'success';
                t['stdout'] = exeu+stdout;
                //console.log('mmmmm')
                //console.log(exeu+stdout)
                t['log'] = log
                t['finishedAt'] = new Date();
                t['outparams'] = JSON.stringify(outparams);
                taskDao.updateOne(t);
            }
            let inputparams = task.inputparams;
            let outparams = task.outparams;
          if (!inputparams) {
              inputparams = '[]'
          }
          if (!outparams) {
            outparams = '[]'
        } 
        inputparams=JSON.parse(inputparams);
        outparams=JSON.parse(outparams);
        for(var i=0;i<inputparams.length;i++)
        {
            if (inputparams[i]['type'] == 'file'){
              inputparams[i]['value'] = path.join(home, inputparams[i]['default']);
            }
            if (inputparams[i]['type'] == 'number'){
              inputparams[i]['value'] = inputparams[i]['default'];
            }
        }
        for(var i=0;i<outparams.length;i++)
        {
            if (outparams[i]['type'] == 'file'){
              outparams[i]['value'] = path.join(home, outparams[i]['default']);
            }
            if (outparams[i]['type'] == 'number'){
              outparams[i]['value'] = outparams[i]['default'];
            }
        }
          const args = {
            inputparams: inputparams,
            outparams: outparams,
            log : home+taskname+'.log'
          }

          if (task.model.type == 'R'){
              console.log('run R');
              exec_R(task.model.url,args,callback1,callback2);
          }
          if (task.model.type == 'python'){
            console.log('run python');
            exec_python(task.model.url,args,callback1,callback2);
        }
      }

      await taskDao.updateOne(t);
      res.json({
        msg: 'success',
      });
    }
  });

  const actionGetTasks = Action.Create({
    name: 'actionGetTasks',
    summary: '',
    description: '获取任务',
    prehandlers: prehandlers.actionGetTasks,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const  { taskDao } = ctx.store.default;
      let where = {}
      if (req.query.status) {
          where['status'] = req.query.status
      }
//      if (req.query.username) {
//        where['username'] = req.query.username
//      }

      const {
        skip,
        limit
      } = req.query;
      let tasks = await taskDao.query(where)
      .skip(skip)
      .limit(limit)
      .execute();
     
      let result = await   Task.$extractArray(tasks, {
        includes: {
            name: true,
//            username: true,
            description: true,
            model: {
                name: true,
                url: true
            },
            rawdata: {
                url: true,
                type: true
            },
            processeddata:{
                url: true,
                type: true
            },
            status: true,
            stdout:true,
            createdAt: true,
            updatedAt: true,
            finishedAt: true,
            inputparams: true,
            outparams: true
        }
    });
    const count = await taskDao.count();
      res.json({
        result: result,
        count: count
      });
    }
  });
  
  const actionGetTask = Action.Create({
    name: 'actionGetTask',
    summary: '',
    description: '获取任务',
    prehandlers: prehandlers.actionGetTask,
    /**
    * Action handler
    * @param {express.core.Request} req - The HTTP request of express.
    * @param {express.core.Response} res - The HTTP response of express.
    * @param {kexpress.HandleContext} ctx - The context data of kexpress.
    */
    async handler(req, res, ctx) {
      const  { taskDao } = ctx.store.default;
      let where = {}
      if (req.query.id) {
          where['id'] = req.query.id;
      }
//      if (req.query.name) {
//        where['name'] = req.query.name;
//      }
      //console.log(req.query.name)


      let task = await taskDao.findOne(where);
     
      let result = await  task.$extract({
        includes: {
            name: true,
            description: true,
            model: {
                name: true,
                url: true
            },
            rawdata: {
                url: true,
                type: true
            },
            processeddata:{
                url: true,
                type: true
            },
            log: true,
            status: true,
            stdout:true,
            createdAt: true,
            updatedAt: true,
            finishedAt: true,
            inputparams: true,
            outparams: true
        }
    });
    let str;
    if(task.log){
      fs.readFile(task.log, function(err, data){
        if(err){
            console.log(err);
            res.send("log not found！");
        }else{
             str = marked(data.toString());
            console.log(str);
            res.json({
              result: result,
              log: str
            });
            
        } 
    });

    }else {
      res.json({
        result: result
      });
    }


    }
  });

  module.exports = {
    actionCreateTask,
    actionUpdateStatus,
    actionGetTasks,
    actionGetTask
  };
  