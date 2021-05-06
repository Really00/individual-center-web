var exec = require('child_process').exec;
function exec_mv(dstpath,callback,inputlist){
    // let exec_l = 'nohup mv ' + srcpath + 'Tumor.csv '+dstpath; 
    for(var i=0;i<inputlist.length;i++){
        if (inputlist[i]['type'] == 'file'){
            const dst=dstpath;
             //let exec_1='nohup mv '+inputlist[i]['value']+' '+dst;
            let exec_1=' move '+inputlist[i]['value']+' '+dst;
            console.log(exec_1)
            exec(exec_1,function(error,stdout,stderr){
                if(error) {
                    callback(stderr,exec_1);
                }
            });
        }
    }
    


    

}
module.exports = {
    exec_mv
  };