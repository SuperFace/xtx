var fs = require('fs-extra'),
    path = require('path'),
    extend = require('extend')

module.exports = {

    getConfig: function() {

        var config = require('./config'),
            configPath = path.join(process.cwd(), config.configFile),
            devPath = path.join(process.cwd(), config.devConfig)

        if (fs.existsSync(configPath)) {
            extend(config, require(configPath))
        }

        if (fs.existsSync(devPath)) {
            extend(config, fs.readJsonSync(devPath))
        }

        // root => source
        config.jsRoot = config.jsRoot || config.jsSource
        config.cssRoot = config.cssRoot || config.cssSource

        return config
    },

    /**
     * 格式化参数
     * @param  {Array} args
     * @return {Object} 格式化的参数对象
     */
    args: function() {

        var rtag = /^--/,
            opts = process.argv.slice(3),
            res = {
                param: [],
                ctrl: []
            }


        opts.forEach(function(value) {
            if (rtag.test(value)) {
                res.ctrl.push(value.replace(rtag, ''))
            } else {
                res.param.push(value)
            }
        })

        return res
    },

    /**
     * 是否是二进制内容
     * @param  {String}  content
     * @return {Boolean}
     */
    isBinary: function(content) {
        var encoding = 'utf8'

        // Detect encoding
        for (var i = 0; i < 24; i++) {
            var charCode = content.charCodeAt(i)
                // 65533 is the unknown char
                // 8 and below are control chars (e.g. backspace, null, eof, etc)
            if (charCode === 65533 || charCode <= 8) {
                encoding = 'binary'
                break
            }
        }

        return (encoding === 'binary')
    }
}
