
# gulp-freemarker-xmllein
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

- （只修改了按需编译，不是每次都全局编译）freemarker plugin for [gulp](https://github.com/wearefractal/gulp)
- 注意：在修改include 进来的公共文件不会编译，所以只能修改非公共页面来达到公共文件修改查看（有点绕口）
## Usage

First, install `gulp-freemarker-xmllein` as a development dependency:

```shell
npm install --save-dev gulp-freemarker-xmllein
```

Then, add it to your `gulpfile.js`:

```javascript
var freemarker = require("gulp-freemarker-xmllein");

gulp.src("./mock/*.json")
	.pipe(freemarker({
		viewRoot: "WEB-INF/views/",
		options: {}
	}))
	.pipe(gulp.dest("./www"));
```

You should provide mock files, which type is json:

```json
{
	"file": "hello.ftl",
	"data": {
		"name": "World"
	}
}
```


* `file` is relative to `viewRoot`, gulp-freemarker-xmllein will read and process `${viewRoot}/${file}` file.

* `data` is the data model the template required.


## API

### freemarker(options)

#### options.viewRoot
Type: `String`
Required: true

The directory where all templates files in.

#### options.options
Type: `Object`
Default: {}

Options for [Freemarker.js](http://github.com/ijse/freemarker.js). see also [https://github.com/ijse/freemarker.js#configurations](https://github.com/ijse/freemarker.js#configurations).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-freemarker-xmllein
[npm-image]: https://badge.fury.io/js/gulp-freemarker-xmllein.png

[travis-url]: http://travis-ci.org/ijse/gulp-freemarker-xmllein
[travis-image]: https://secure.travis-ci.org/ijse/gulp-freemarker-xmllein.png?branch=master

[coveralls-url]: https://coveralls.io/r/ijse/gulp-freemarker-xmllein
[coveralls-image]: https://coveralls.io/repos/ijse/gulp-freemarker-xmllein/badge.png

[depstat-url]: https://david-dm.org/ijse/gulp-freemarker-xmllein
[depstat-image]: https://david-dm.org/ijse/gulp-freemarker-xmllein.png
