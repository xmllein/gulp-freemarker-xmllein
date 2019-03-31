var through = require('through2')
  , Freemarker = require('freemarker.js')
  , PluginError = require('gulp-util').PluginError
  , fs = require('fs')

let fileObj = {};

module.exports = function(options) {

  if (!arguments.length)
    throw new PluginError('gulp-freemarker', 'invoked with no arguments!')

  if (!options.viewRoot)
    throw new PluginError('gulp-freemarker', 'viewRoot option is mandatory!')

  var engine = new Freemarker(options)

  return through.obj(function(file, encoding, callback) {
    if (file.isNull()){
      this.push(file)
      return callback()
    }
    if (file.isBuffer()) {
      try{
        var config = JSON.parse(file.contents)
      }catch(err){
        callback(err)
      }
      //============================== start 主要解决 gulp freemarker  每次都是全局编译 =====
      // 解决删除文件时候 文件 不存在报错
      let _this = this;
      fs.exists(options.viewRoot +'/' + config.file,function(flag){
        if(flag){ // 文件存在
          let stat = fs.statSync(options.viewRoot +'/' + config.file);
          if(!fileObj[config.file]){ //=== 首次编译 和 新建文件编译
            console.log('init or create file', config.file);
            engine.render(config.file || config.tpl, config.data, function(err, html, output) {
              if (err) return callback(err + output)
              file.contents = new Buffer(html || output)
              file.path = file.path.replace('.json', '.html') // fixme: feels a bit hacky
              _this.push(file)
              return callback(null)
            }.bind(_this))
            //=== 赋值新时间戳
            fileObj[config.file||config.tpl] = stat.mtime.getTime();
            //console.log("init&newfile ==== fileObj",fileObj);

          }else{//====== 过滤出变化的文件
            if(fileObj[config.file] !== stat.mtime.getTime()){ //===== 只对发生变化文件编译
              console.log('changed file ====', config.file);
              fileObj[config.file||config.tpl] = stat.mtime.getTime();
              engine.render(config.file || config.tpl, config.data, function(err, html, output) {
                if (err) return callback(err + output)
                file.contents = new Buffer(html || output)
                file.path = file.path.replace('.json', '.html') // fixme: feels a bit hacky
                _this.push(file)
                return callback(null)
              }.bind(_this))
            }else{
              console.log("modify include file");
              return callback(null)
            }
            //console.log("change === fileObj",fileObj);
          }

        }else {
          // 文件不存在
          if(fileObj[config.file || config.tpl]) delete fileObj[config.file || config.tpl]
          console.log('del file or json file please ====',config.file);
          //console.log("del file====", fileObj);
          return callback(null)
        }
      })
      //============================= end 主要解决 gulp freemarker  每次都是全局编译 ===========
    }
    if (file.isStream()){
      console.log('isStream.....');
      var data = []
      file.contents.on('data', function(chunk) {
        data.push(chunk)
      })
      file.contents.on('end', function() {
        try{
          var config = JSON.parse(data.join(String()))
        }catch(err){
          callback(err)
        }
        engine.render(config.file || config.tpl, config.data, function(err, html, output) {
          if (err) return callback(err + output)
          var stream = through()
          stream.on('error', this.emit.bind(this, 'error'))
          stream.write(html || output)
          file.contents = stream
          stream.end()
          this.push(file)
          return callback(null)
        }.bind(this))
      }.bind(this))
      file.contents.on('error', function(err) {
        this.emit('error', new PluginError('gulp-freemarker', 'Read stream error!'))
      }.bind(this))
    }
  })
}
