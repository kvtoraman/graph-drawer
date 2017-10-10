
var MAXN = 100,N;
var mat = matrix(MAXN+5, MAXN+5,0),VERTEX_ID =0;
var g = matrix(MAXN+5, MAXN+5,0);// graph when loops constructed in one node
var drawMat = new matrix(MAXN+5, MAXN+5,0);
var visited = new Array(MAXN+5);
var hash = new Map(); //hash for node strings . ID's go from 0 to n-1
var revHash = []; //reverse hash
var depth = [];
var pos  = [];// keeps x and y position for each block
var parent = new Array(MAXN + 5);
var noOfParents = new Array(MAXN+5);
var scc = new Array(MAXN+5);//gives the component index of node i
var cycleSize = new Array(MAXN+5);//gives the cycle size of the cycle having node i

var Time = 0,cycleCount = 0;
var JSONdebug;
const HEIGHT_DIFF = 200;
const DEPTH_DIFF = 200;
const BLOCK_HEIGHT = 100;
const TOP_MARGIN = 12;
const LINE_HEIGHT = 10;
function matrix( rows, cols, defaultValue){

	var arr = [];
	// Creates all lines:
	for(var i=0; i < rows; i++){

	// Creates an empty line
		arr.push([]);

	// Adds cols to the empty line:
		arr[i].push( new Array(cols));

		for(var j=0; j < cols; j++){
		// Initializes:
			arr[i][j] = defaultValue;
		}
	}

	return arr;
}

function retrieveCFGData()
{
    //return '{"nodes":{"11":{"disasm":"11\\nadd eax, 1\\n...","ir":"EAX := EAX - EBX\\n"},"12":{"disasm":"12\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"13":{"disasm":"13\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"14":{"disasm":"14\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"0x4022e0":{"disasm":"0x4022e0\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"}},"root":"0x4022e0","edges":[{"from":"0x4022e0","to":"11","type":"jmp"},{"from":"11","to":"12","type":"jmp"},{"from":"12","to":"13","type":"jmp"},{"from":"0x4022e0","to":"14","type":"jmp"},{"from":"14","to":"13","type":"jmp"}]}';
    //return "{ \"nodes\" : { \"0x4022e0\": { \"disasm\": \"mov eax, ebx\\nadd eax, 1\\n...\", \"ir\": \"EAX := E    BX\\n\" }, \"0x4022f0\": { \"disasm\": \"sub eax, ebx\\nadd eax, 1\\n...\", \"ir\": \"EAX := EAX - EBX\\n\"     }, \"0x402300\": { \"disasm\": \"inc ebx\\nadd eax, 1\\n...\", \"ir\": \"EAX := EAX + EBX\\n\" }, \"0x402320\": { \"disasm\": \"dec ecx\\nadd eax, 1\\n...\", \"ir\": \"EAX := EAX + EBX\\n\" } }, \"root\" : \"0x4022e0\", \"edges\" : [ { \"from\": \"0x4022e0\", \"to\": \"0x4022f0\", \"type\": \"jmp\" }, { \"from\": \"0x4022e0\", \"to\": \"0x402300\", \"type\": \"jmp\" }, { \"from\": \"0x4022f0\", \"to\": \"0x402320\", \"type\": \"    jmp\" }, { \"from\": \"0x402300\", \"to\": \"0x402320\", \"type\": \"jmp\" }, { \"from\": \"0x402320\", \"to\": \"0x402300\", \"type\": \"jmp\" } ] }";
/*ex1*/
//return '{"nodes":{"10":{"disasm":"10-0x4022e0\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"},"11":{"disasm":"11\\nadd eax, 1\\n...","ir":"EAX := EAX - EBX\\n"},"12":{"disasm":"12\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"13":{"disasm":"13\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"14":{"disasm":"14\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"15":{"disasm":"15\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"}},"root":"10","edges":[{"from":"10","to":"11","type":"jmp"},{"from":"11","to":"12","type":"jmp"},{"from":"12","to":"13","type":"jmp"},{"from":"10","to":"14","type":"jmp"},{"from":"14","to":"13","type":"jmp"},{"from":"13","to":"15","type":"jmp"}]}';
/*ex2*/
//return '{"nodes":{"10":{"disasm":"10-0x4022e0\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"},"11":{"disasm":"11\\nadd eax, 1\\n...","ir":"EAX := EAX - EBX\\n"},"12":{"disasm":"12\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"13":{"disasm":"13\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"14":{"disasm":"14\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"}},"root":"10","edges":[{"from":"10","to":"11","type":"jmp"},{"from":"11","to":"13","type":"jmp"},{"from":"10","to":"12","type":"jmp"},{"from":"12","to":"13","type":"jmp"},{"from":"13","to":"12","type":"jmp"},{"from":"13","to":"14","type":"jmp"}]}'
/*ex3*/
	return '{"nodes":{"10":{"disasm":"10-0x4022e0\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"},"11":{"disasm":"11\\nadd eax, 1\\n...","ir":"EAX := EAX - EBX\\n"},"12":{"disasm":"12\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"13":{"disasm":"13\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"14":{"disasm":"14\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"15":{"disasm":"15\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"16":{"disasm":"16\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"}},"root":"10","edges":[{"from":"10","to":"11","type":"jmp"},{"from":"11","to":"15","type":"jmp"},{"from":"15","to":"16","type":"jmp"},{"from":"16","to":"13","type":"jmp"},{"from":"10","to":"12","type":"jmp"},{"from":"12","to":"13","type":"jmp"},{"from":"13","to":"12","type":"jmp"},{"from":"13","to":"14","type":"jmp"}]}';
/*ex3 without lopp*/
//	return '{"nodes":{"10":{"disasm":"10-0x4022e0\\nadd eax, 1\\n...","ir":"EAX := EBX\\n"},"11":{"disasm":"11\\nadd eax, 1\\n...","ir":"EAX := EAX - EBX\\n"},"12":{"disasm":"12\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"13":{"disasm":"13\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"14":{"disasm":"14\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"15":{"disasm":"15\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"},"16":{"disasm":"16\\nadd eax, 1\\n...","ir":"EAX := EAX + EBX\\n"}},"root":"10","edges":[{"from":"10","to":"11","type":"jmp"},{"from":"11","to":"15","type":"jmp"},{"from":"15","to":"16","type":"jmp"},{"from":"16","to":"13","type":"jmp"},{"from":"10","to":"12","type":"jmp"},{"from":"12","to":"13","type":"jmp"},{"from":"13","to":"14","type":"jmp"}]}';
}

function canvas_arrow(context, fromx, fromy, tox, toy){
		var headlen = 10;	// length of head in pixels
		var dx = tox-fromx;
		var dy = toy-fromy;
		var angle = Math.atan2(dy,dx);
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

function fillTextMultiLine(ctx, text, x, y) {
  var lineHeight = ctx.measureText("M").width * 1.2;
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

function processEdges(json){
	//node ids are from 0 to N-1
	N = 0;
	for (var key in json.nodes){
		revHash[VERTEX_ID] = key;
    	pos.push({x:0,y:0})
		hash.set(key, VERTEX_ID++);
    	//console.log(key +" = "+ (VERTEX_ID-1));
    	N++;
  }
    console.log("N " + N);
	//put edges wrt 'hash' values.
	for(var i=0;i<N;i++)
		noOfParents[i] = 0;
    for (var key of json.edges){

		//console.log(hash.get(key.from) + " " + hash.get(key.to));
		mat[hash.get(key.from)][hash.get(key.to)]=1;
		noOfParents[hash.get(key.to)]++;
    }
    

}
//using scc array, fill graph g 
function normalizeEdges(json){
    for (var i =0;i<N;i++)
    	for(var j=0;j<N;j++)
    		if(mat[i][j]){
    			g[scc[i]][scc[j]] = 1;
			}

	//decrease 'fake parents' from graph		
	for(var i =0;i<N;i++)
    	for(var j=0;j<N;j++)
    		//if they are in the same group and there is an edge, decrease 1
    		if(scc[i] == scc[j] & mat[i][j]){
    			noOfParents[j]--;
    		}		
}

//bfs computes depth values
function bfs(json){

    var depthCount = [];
	var q = [];
	for (var i =0;i<N;i++)
    	for(var j=0;j<N;j++)
    		drawMat[i][j] = mat[i][j];
	var current = hash.get(json.root);

	for(var i=0;i<N;i++){
		depth[i] = 0;
		depthCount[i] = 0;
		parent[i] = 0;
	}
	//depth[current] = 1;
	noOfParents[current] = 0;
	q.push(current);
	//dummy parent for the root
	parent[current] = N+5
	depth[N+5] = 0;
	while(q.length){
		current = q.shift();
		console.log(json.nodes[revHash[current]].disasm +"has " +noOfParents[current]);
		//if all parents of this is visited
		if(noOfParents[current] > 0 || depth[current] !=0)
			continue;
		depth[current] = depth[parent[current]]+1;
		console.log(current +"has depth" + depth[current] +" "+ json.nodes[revHash[current]].disasm);
		depthCount[depth[current]]++;

		x = 50+DEPTH_DIFF*(depthCount[depth[current]]-1);
		y =  HEIGHT_DIFF*depth[current];
	  	pos[current].x = x+ Math.random()*100;
    	pos[current].y = y;
	  	//fillTextMultiLine(ctx,json.nodes[revHash[current]].disasm, x, y);
	
		for(var i = 0;i < N; i++){
			//console.log(i + " " + mat[current][i] + " " + depth[i]);
			if(mat[current][i] && depth[i] == 0){
				
		//		depth[i] = depth[current] + 1;
		//		console.log(i +"has depth" + depth[i]);
				if(mat[i][current])
					mat[i][current] = 0;
				else
					noOfParents[i]--;
				if(!parent[i] || depth[current]>depth[parent[i]])
					parent[i] = current;
				q.push(i);
			
			}
		}
	}	
}
	
function drawBlocks(svg,json){
	var rects = svg.selectAll("rect")
				.data(pos)
				.enter().append("rect")
				.attr("x",function(d){return d.x})
				.attr("y",function(d){return d.y-TOP_MARGIN})
				.attr("height",BLOCK_HEIGHT)
				.attr("width",BLOCK_HEIGHT)
				.attr("stroke","black")
				.attr("fill","transparent")
				.attr("stroke-width",3)

	for(var i =0;i < N; i++){
		text = json.nodes[revHash[i]].disasm;
		x=pos[i].x;
		y=pos[i].y;
		var lineHeight = LINE_HEIGHT;
		var lines = text.split("\n");
		for (var j = 0; j < lines.length; j++) {
			svg.append("text")	
				.attr("x",x)
				.attr("y",y)
				.text(lines[j])
			y += lineHeight;
		}
	}
	//old code		
}
//add nodes to the stack according to their  finish time
function dfs1(x){
	visited[x]=1
	for(var i =0;i<N;i++)
		if(!visited[i] && mat[x][i])
			dfs1(i)
	stack[Time++] = x;	
}

function dfs2(x){
	scc[x] = cycleCount;
	cycleSize[cycleCount]++;
	visited[x] = 1;
	//note that the edges are reversed
	for(var i =0;i<N;i++)
		if(!visited[i] && mat[i][x])
			dfs2(i)
}
//find all scc's using Kosaraju's algorithm
function findCycles(json){
	stack = new Array(MAXN+5)
	for(var i=0;i<N;i++){
		visited[i] = 0
		stack[i] = 0;
		scc[i] = 0;
		cycleSize[i] = 0;
	}
	for(var i=0;i<N;i++)
		if(!visited[i])
			dfs1(i);
	for(var i=0;i<N;i++)
		visited[i] = 0
		
	for(var i=Time-1;i>=0;i--)
		if(!visited[stack[i]]){
			dfs2(stack[i]);
			cycleCount++;
		}
	for(var i=0;i<N;i++)
		console.log(json.nodes[revHash[i]].disasm +" scc " +scc[i]);	
}

function drawEdges(svg,json){
	console.log("edges..")
	var forwardEdgeFunction = d3.line().curve(d3.curveStep)
								.x(function(d){return d.x;})
								.y(function(d){return d.y;})
	
	var backEdgeFunction = d3.line().curve(d3.curveStep)
								.x(function(d){return d.x;})
								.y(function(d){return d.y;})
									
	for (var i = 0;i<N;i++){
		for(var j=0;j<N;j++){
			if(drawMat[i][j] > 0){
				
				//forward edge
				if(depth[i] < depth[j]){
					lineData = [{"x": pos[i].x+ BLOCK_HEIGHT/2,"y": pos[i].y + BLOCK_HEIGHT - TOP_MARGIN},
								{"x": pos[i].x+ BLOCK_HEIGHT/2,"y": pos[i].y + BLOCK_HEIGHT},
								{"x": pos[j].x+ BLOCK_HEIGHT/2,"y": pos[j].y - TOP_MARGIN*2},
								{"x": pos[j].x+ BLOCK_HEIGHT/2,"y": pos[j].y - TOP_MARGIN}];
					svg.append("path")
						.attr("class","line")
						.attr("d",forwardEdgeFunction(lineData))
						.attr("fill","none")
						.attr("stroke","black")
				}
				//back-edge
				else{
					lineData = [{"x": pos[i].x+ BLOCK_HEIGHT/2,"y": pos[i].y + BLOCK_HEIGHT - TOP_MARGIN},
								{"x": pos[i].x+ BLOCK_HEIGHT/2,"y": pos[i].y + BLOCK_HEIGHT},
								{"x": pos[j].x+ BLOCK_HEIGHT+TOP_MARGIN,"y": pos[i].y + BLOCK_HEIGHT},
								{"x": pos[j].x+ BLOCK_HEIGHT+TOP_MARGIN,"y": pos[j].y - TOP_MARGIN*2 },
								{"x": pos[j].x+ BLOCK_HEIGHT/2,"y": pos[j].y - TOP_MARGIN*2 },
								{"x": pos[j].x+ BLOCK_HEIGHT/2,"y": pos[j].y - TOP_MARGIN }
								];
					svg.append("path")
						.attr("class","line")
						.attr("d",backEdgeFunction(lineData))
						.attr("stroke", "blue")
						.attr("fill","none");
				}
			}

		}
    }
}

function drawCanvas(){
    var c;
    //c = document.getElementById("mainCFG");
    var json = retrieveCFGData();
    //alert("ready to parse!");
    var cfg = JSON.parse(json);
    JSONdebug = cfg;
    var svg = d3.select("body").append("svg")
    							.attr("width","600")
    							.attr("height","600")
    							.call(d3.zoom().on("zoom",function(){
    								svg.attr("transform",d3.event.transform)
    							}))
    							.append("g");
    /*svg.append("circle")
    	.attr("cx",document.body.clientWidth/2)
    	.attr("cy",document.body.clientHeight/2)
    	.attr("r",50)
    	.style("fill","005500")		*/	
    console.log(cfg.nodes);
    console.log(cfg.nodes[cfg.root].disasm);
    for (var key in cfg.nodes){
    	console.log(key );
    }
    for (var key of cfg.edges){
    	console.log(key.from + '->'+key.to);
    }
    processEdges(cfg);
    findCycles(cfg);
    normalizeEdges(cfg);
   	bfs(cfg);
   	//bfsOnDag(cfg);
   	drawBlocks(svg, cfg);
  	drawEdges(svg, cfg);
  	
}
