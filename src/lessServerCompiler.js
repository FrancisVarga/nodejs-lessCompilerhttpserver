/**
 * Created by JetBrains PhpStorm.
 * User: LittleBuddha87
 * Date: 1/11/11
 * Time: 8:21 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created by JetBrains PhpStorm.
 * User: LittleBuddha87
 * Date: 1/11/11
 * Time: 12:56 AM
 * To change this template use File | Settings | File Templates.
 */
var less = require('less');
var sys=require('sys');
var httpServer=require('http');
var couchdb  = require('cradle');
var couchdbClient = new (couchdb.Connection)().database('dev_less');

var var_dump = function(obj)
{
	return JSON.stringify(obj);
}

var serverCreatedHandler = function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  createLess({resp:response, requ:request});
};

httpServer.createServer(serverCreatedHandler).listen(10437);

var createLess = function(httpData){

	var httpResponse = httpData.resp;
	var httpRequest = httpData.requ;

	var fileSystem = require('fs');
	var urlParser = require('url');

	var urlObj = urlParser.parse(httpRequest.url);
	var lessFileName = urlObj.pathname.replace("/", "");

	try{

		if(lessFileName != 'favicon.ico')
		{
				//ATTENTION DON'T FORGET UTF-8
				// fileSystem.readFileSync('style.less', 'utf-8');

				var tempLessFile = lessFileName + ".less"
				var lessFile = fileSystem.readFileSync(tempLessFile, 'utf-8');

				//Render the less file
				less.render(lessFile, function (error, css) {

				if(!error)
				{
	    			httpResponse.end(css);
	    			couchdbClient.save(css);
                    fs.writeSync(lessFileName + ".css");
				}else
				{
					httpResponse.end(JSON.stringify({error: error}));
				}
			});
		} else if(lessFileName === "")
		{
			var lessFile = fileSystem.readFileSync('style.less');
		}
	}catch(error){
		httpResponse.end(JSON.stringify({error:error}));
	}
}