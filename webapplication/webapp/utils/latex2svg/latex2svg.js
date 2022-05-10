// a simple TeX-input example
var mjAPI = require("mathjax-node")
var fs = require("fs")


function checkError(err) {
	if (err) {
		console.error(err)
		process.exit(1)
	  }  
}

function convertLaTeX2Svg(input, callBack, errCallBack) {
	mjAPI.config({
		MathJax: {
			// traditional MathJax configuration
		}
	});
	mjAPI.start();
	
	return mjAPI.typeset({
		math: input,
		format: "TeX", 
		svg: true,    
	}, function (data) {
		if (!data.errors) { 
			console.log(data.svg) 
			callBack()
		} else {
			errCallBack()
		}
	})
}

if (process.argv.length != 3) {
	console.log("Please provide an input file name.")
	process.exit(1)
}

const filePath = process.argv[2]

fs.access(filePath, fs.F_OK, (err) => {
	checkError(err)
  
	//file exists
	fs.readFile(filePath, "utf8", function(err, data) {
		checkError(err)
		convertLaTeX2Svg(data, () => process.exit(0), () => process.exit(1))
	})
})

setTimeout(() => {
	process.exit(1)
}, 5000)


