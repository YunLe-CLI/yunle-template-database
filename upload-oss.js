/* 设置声明周期规则，自动回收七天之外的数据库备份 */
const co = require('co');
const OSS = require('ali-oss');
const schedule = require('node-schedule');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const moment = require('moment');

const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'xxxx',
    accessKeySecret: 'xxxx',
    bucket: 'xxxx',
});

const backupPathMongo = path.join(__dirname, './backup/mongodb');
const backupPathRedis = path.join(__dirname, './backup/redis');

const mongodbPath = path.join(__dirname, './mongodb/data');
const redisPath = path.join(__dirname, './redis/data');



const zip = (targetPath, backupPath, name) => {
    console.log('start')
    const backupName = `${name}_bak_${moment().format('YYYY_MM_DD_HH_mm')}.zip`;
    const backupFilePath = path.join(backupPath, backupName);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    const output = fs.createWriteStream(backupFilePath);
    output.on('close', function() {
        co(function* () {
            var result = yield client.multipartUpload(name+'/'+backupName, backupFilePath, {
                timeout: 1000 * 60 * 60 * 3
            });
        }).catch(function (err) {
            console.log(err);
        })
    });
    output.on('end', function() {
        console.log('end');
    });
    archive.on('error', function(err){
       throw err;
    });
    archive.pipe(output);
    archive.directory(targetPath, false);
    archive.finalize();
}

const backupFun = () => {
    shell.mkdir('-p', [
        backupPathMongo,
        backupPathRedis,
    ]);
    zip(mongodbPath, backupPathMongo, 'mongo');
    zip(redisPath, backupPathRedis, 'redis');
}

const scheduleCronstyle = ()=>{
    backupFun();
    schedule.scheduleJob('30 1 3 * * *',()=>{
        backupFun();
    }); 
}

scheduleCronstyle();


