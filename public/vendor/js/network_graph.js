function createNetworkGraph(datasetUrl) {
	//	data stores
	var graph, store;
	var minLinkValue = 1;

	//	svg selection and sizing
	var svg = d3.select("#network-svg"),
		width = +svg.node().getBoundingClientRect().width - 50,
		height = +svg.node().getBoundingClientRect().height,
		//width = +svg.attr("width"),
		//width = +document.getElementById("network-svg").offsetWidth,
		//height = +document.getElementById("network-svg").offsetHeight,
		//height = +svg.attr("height"),
		radius = 10;
	console.log(document.getElementById("network-svg"));
	svg.selectAll("*").remove();
	console.log(svg);
	//Tooltip
	var div = d3.select("body").append("div")	
		.attr("class", "graphtooltip")				
		.style("opacity", 0);

	//	Scales
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var strokeScale = d3.scaleLinear()
		.domain([minLinkValue, 15])
		.range([0.5, 4]);	
	var opacityScale = d3.scaleLinear()
		.domain([minLinkValue, 15])
		.range([0.2, 0.7]);
	var radiusScale = d3.scaleLinear()
		.domain([0, 300])
		.range([4, 12]);
	var fontScale = d3.scaleLinear()
		.domain([20, 300])
		.range([8, 20]);
	var fontOpacityScale = d3.scaleLinear()
		.domain([40, 500])
		.range([0.3, 0.7]);

	var catColors = {
		"mp": "#4081ae",
		"I": "#00AF93",
		"II": "#449188",
		"III": "#52c993",
		"IV": "#28b99f",
		"V": "#026973",
		"VI": "#127983",
		"": "#ccc"
	}

	/*
	var nodeSizes = {
		'beneficial_owner': 5,
		'contracting': 10,
		'contractor': 10,
		'mainDoc': 20
	}
	*/

	var nodeSizes = {
		'beneficial_owner': 10,
		'contracting': 20,
		'contractor': 20,
		'mainDoc': 40,
		'donation_to_party': 20
	}

	var nodeIcons = {
		'beneficial_owner': "./images/graph/person1.png",
		'contracting': "./images/graph/company1.png",
		'contractor': "./images/graph/award1.png",
		'mainDoc': "./images/graph/document1.png",
		'donation_to_party': "./images/graph/donation1.png"
	}

	var nodeIconsSizes = {
		'beneficial_owner': 24,
		'contracting': 40,
		'contractor': 40,
		'mainDoc': 50,
		'donation_to_party': 30
	}

	var labelType = {
		'beneficial_owner': 'Tegelik kasusaaja',
		'contracting': 'Hankija',
		'contractor': 'Pakkuja',
		'mainDoc': 'Teade',
		'donation_to_party': 'Annetus erakonnale'
	}

	var link = svg.append("g").selectAll(".link"),
		node = svg.append("g").selectAll("g");

	//	force simulation initialization
	var simulation = d3.forceSimulation()
		//.force("link", d3.forceLink().distance(95).strength(1.5).id(function(d) { return d.id; }))
		.force("link", d3.forceLink().distance(function(d) {
			if(d.targetGroup == "beneficial_owner") {return 45;}
			if(d.targetGroup == "donation_to_party") {return 90;}
			return 120;
		}).strength(1.6).id(function(d) { return d.id; }))
		//.force('link', d3.forceLink().links(links))
		.force("charge", d3.forceManyBody().strength(-80))
		//.force("charge", function(d, i) { console.log(d); return d3.forceManyBody().strength(-20) })
		//.charge(function(d, i) { return i==0 ? -10000 : -500; })
		.force('collision', d3.forceCollide().radius(function(d) {
			return d.radius
		  }))
		//.force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
		.force("center", d3.forceCenter(width / 2, height / 2));

	//	data read and store
	datasetUrl = "./data/network_data/docs/" + datasetUrl;
	console.log(datasetUrl);
	fetch(datasetUrl)
    .then((response) => response.json())
    .then((g) => {
		console.log(g)
		// Load and prepare data
		var nodesFull = g.nodes;
		var linksFull = g.links1;

		var links = linksFull;
		var nodes = nodesFull;
		
		g = {"nodes": nodes, "links1": links}
		
		//Prepare nodes and links for filtering
		var nodeByID = {};

		g.nodes.forEach(function(n) {
			nodeByID[n.id] = n;
		});

		var linkId = 0;
		g.links1.forEach(function(l) {
			l.id = 
			linkId ++;
			l.sourceGroup = nodeByID[l.source].type.toString();
			l.targetGroup = nodeByID[l.target].type.toString();
		});

		graph = g;
		store = $.extend(true, {}, g);

		update();
	});

	/*
	d3.json(datasetUrl, function(err, g) {
		console.log(err);
		console.log(g);
		// Load and prepare data
		var nodesFull = g.nodes;
		var linksFull = g.links1;

		var links = linksFull;
		var nodes = nodesFull;
		
		g = {"nodes": nodes, "links1": links}
		
		//Prepare nodes and links for filtering

		if (err) throw err;

		var nodeByID = {};

		g.nodes.forEach(function(n) {
			nodeByID[n.id] = n;
		});

		var linkId = 0;
		g.links1.forEach(function(l) {
			l.id = 
			linkId ++;
			l.sourceGroup = nodeByID[l.source].type.toString();
			l.targetGroup = nodeByID[l.target].type.toString();
		});

		graph = g;
		store = $.extend(true, {}, g);

		update();
	});
	*/

	//	general update pattern for updating the graph
	function update() {

		//	UPDATE
		//node = node.data(graph.nodes, function(d) { return d.id;});
		node = node.data(graph.nodes, function(d) { return d.id;});
		//	EXIT
		node.exit().remove();
		//	ENTER
		var newNode = node.enter().append("g");

		//Image
		newNode.append("image")
		.attr("xlink:href", function(d) { return nodeIcons[d.type]; })
		.attr("x", function(d) { return "-"+nodeIconsSizes[d.type]/2 + "px"})
		.attr("y", function(d) { return "-"+nodeIconsSizes[d.type]/2 + "px"})
		.attr("width", function(d) { return nodeIconsSizes[d.type] + "px"})
		.attr("height", function(d) { return nodeIconsSizes[d.type] + "px"})
		.on('mouseover', function(d) {
			d3.select(this)
			.transition()
			.duration(300);
		})
		.on('mouseout', function(d) {
			d3.select(this)
			.transition()
			.duration(300)	
		})

		newNode.append("circle")
			.attr("class", "node")
			.attr("fill", function(d) {return "#aaaaaa";})
			.attr("r", function(d) { return nodeSizes[d.type] })
			.attr("opacity", 0.1)
			.style("cursor", "pointer")
			.on('mouseover', function(d) {
				d3.select(this)
				.transition()
				.duration(300)
				.attr("r", function(d) { return nodeSizes[d.type] + 5 });	 
				div.transition()		
					.duration(200)		
					.style("opacity", .9);		
				div	.html("<b>" + d.name + "</b><br/>" + labelType[d.type])	
					.style("left", (d3.event.pageX) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on('mouseout', function(d) {
				d3.select(this)
				.transition()
				.duration(300)
				.attr("r", function(d) { return nodeSizes[d.type]  });
				div.transition()		
					.duration(500)		
					.style("opacity", 0);
			})
			.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended)
			)
		/*
		newNode.append("title")
		.text(function(d) { return d.id });
		*/

		//Labels
		newNode.append("text")
		.text(function(d) {
			return;
			if(d.type !== 'beneficial_owner' && d.type !== 'mainDoc') { return d.name; }
		})
		.style("font-size", function(d) { return 13; })
		.attr("opacity", function(d) { return 0})
		.attr('x', 20)
		.attr('y', 10);
		
		//	ENTER + UPDATE
		node = node.merge(newNode);

		//	UPDATE
		link = link.data(graph.links1, function(d) { return d.id;});
		//	EXIT
		link.exit().remove();
		//	ENTER
		newLink = link.enter().append("line")
			.attr("class", "link")
			.attr("stroke-width", function(d) { 
			return 2;
			})
			.attr("stroke", "#242728")
			.attr("stroke-opacity", function(d) { return 0.5} );

		newLink.append("title")
		.text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target; });
		//	ENTER + UPDATE
		link = link.merge(newLink);
		
		node.on("mouseover", function (d) {
			link
			.transition()
			.duration(300)
			.attr("stroke-opacity", function(l) { 
				if (d === l.source || d === l.target)
				return 1;
			else
				return 0.05;
			});
		});
		node.on("mouseout", function (d) {
			link
			.transition()
			.duration(300)
			.attr("stroke-opacity", function(l) { return opacityScale(l.value)} )
		});

		//	update simulation nodes, links, and alpha
		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(graph.links1);

		simulation.alpha(1).alphaTarget(0).restart();
	}

	//	drag event handlers
	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	//	tick event handler with bounded box
	function ticked() {
		link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		node
			.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
			})

	}
}