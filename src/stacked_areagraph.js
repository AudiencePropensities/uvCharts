r3.stacked_areagraph = function () {
	r3.graph.apply(this, [graphdef]);
	graphdef.stepup = false;
	this.init(graphdef);

	this.areagroups = [];
	this.dataset = r3.util.getDataArray(this.graphdef);

	var areagroup, areapath, areafunc,
		domainData = this.graphdef.dataset[this.graphdef.categories[0]];

	this.axes[this.graphdef.orientation === 'hor'?'ver':'hor'].scale.domain(domainData.map(function(d){ return d.name;}));

	for(var idx=0, len=this.dataset.length; idx<len; idx++){		
		areapath = this.panel.append('g').attr('class','area_' + idx).datum(this.dataset[idx]);
		areagroup = { path: areapath, linefunc: undefined, areafunc: undefined ,line: undefined, area: undefined };
		this['draw' + r3.util.getPascalCasedName(this.graphdef.orientation) + 'Area'](areapath, idx, areagroup);
		this.areagroups.push(areagroup);
	}

	this.finalize();
};

r3.stacked_areagraph.prototype = r3.util.extend(r3.graph);

r3.stacked_areagraph.prototype.drawHorArea = function (areapath, idx, areagroup) {
	var axes = this.axes;

	areagroup.linefunc = d3.svg.line()
				.x(function(d) { return axes.hor.scale(d.value); })
				.y(function(d) { return axes.ver.scale(d.name) + axes.ver.scale.rangeBand()/2; })
				.interpolate('linear');

	areagroup.areafunc = d3.svg.area()
				.x0(axes.hor.scale(0))
				.x1(areagroup.linefunc.x())
				.y(areagroup.linefunc.y());

	areagroup.area = areapath.append('svg:path')
				.attr('class', 'linepath_' + idx)
				.attr('d', areagroup.areafunc);

	areagroup.line = areapath.append('svg:path')
				.attr('class', 'linepath_' + idx)
				.attr('d', areagroup.linefunc);

	areapath.selectAll('.dot')
				.data(this.dataset[idx])
				.enter()
				.append('circle')
				.attr('class', 'dot')
				.attr('cx', areagroup.linefunc.x())
				.attr('cy', areagroup.linefunc.y())
				.attr('r', 3.5).style('fill','white');
};

r3.stacked_areagraph.prototype.drawVerArea = function (areapath, idx, areagroup) {
	var axes = this.axes, height = this.dimension.height;

	areagroup.linefunc = d3.svg.line()
				.x(function(d) { return axes.hor.scale(d.name) + axes.hor.scale.rangeBand()/2; })
				.y(function(d) { return axes.ver.scale(d.value); })
				.interpolate('linear');

	areagroup.areafunc = d3.svg.area()
				.x(areagroup.linefunc.x())
				.y0(areagroup.linefunc.y())
				.y1(axes.ver.scale(0));

	areagroup.area = areapath.append('svg:path')
				.attr('class', 'linepath_' + idx)
				.attr('d', areagroup.areafunc);

	areagroup.line = areapath.append('svg:path')
				.attr('class', 'linepath_' + idx)
				.attr('d', areagroup.linefunc);

	areapath.selectAll('.dot')
				.data(this.dataset[idx])
				.enter()
				.append('circle')
				.attr('class', 'dot')
				.attr('cx', areagroup.linefunc.x())
				.attr('cy', areagroup.linefunc.y())
				.attr('r', 3.5).style('fill','white');
};