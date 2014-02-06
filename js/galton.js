//galton.js - Galton Board Simulation with Programmable Pin Probabilities
//Created by Jared Perreault

//TODO - Last Updated 2/3/2014:
//Change color of bin ball to that of most recent ball [Done - 2/3/2014]
//Fix 'floating ball' bug within the bins [Temp Fix - haven't found absolute cause]
//Add lines to distinguish bins [Done - 1/23/2014]
//Add 'residual' lines of the paths of the balls
//Add a 'View Probabilities' button [Done - 2/5/2014]


$(document).ready( function() {
	$("#start").removeAttr("disabled");
	$("#pause").attr('disabled', 'true');
	$("#modal-pause").removeAttr("disabled");

/**************************************** Peg and 'Board' Setup Functions *************************************************/

	function Peg(x, y, i, j, ratio) {
		this.x = x;
		this.y = y;
		this.i = i;
		this.j = j;
		this.shape = new Kinetic.Circle({
						x: x,
						y: y,
						radius: 7,
						fill: 'black',
						stroke: 'black',
						strokeWidth: 2
		});
		this.ratio = ratio;
		this.tooltip = new Kinetic.Label({
						x: x,
						y: y+10
		});
		this.tooltipCreated = false;
	}

	var colorArray = ['green', 'red', 'blue', 'seagreen', 'purple', 'steelblue', 'navy', 'indigo', 
						'limegreen', 'aqua', 'maroon', 'olive', 'pink', 'royalblue', 'yellow', 'teal', 'orange'];

	var div_width = $("#display-wrapper").width();
	var div_height = $("#display-wrapper").height();
	var stage = new Kinetic.Stage({
		container: 'display-wrapper',
		width: div_width,
		height: div_height
	});

	var pegList = new Array();
	var peg_layer = new Kinetic.Layer();
	var tooltip_layer = new Kinetic.Layer();
	var marble_layer = new Kinetic.Layer();
	var odometer_layer = new Kinetic.Layer();
	var text_layer = new Kinetic.Layer();
	var bin_layer = new Kinetic.Layer();


	var xCoor = (stage.getWidth()/2);
	var yCoor = 65;
	var xInt = 58;
	var yInt = 55;

	//Array(s) of Probability disturbutions
	var conway = [ 0.6, 0.7, 0.3, 0.8, 0.5, 0.3, 0.8, 0.6, 0.4, 0.2, 0.9, 0.7, 
    				0.5, 0.3, 0.2, 0.9, 0.7, 0.6, 0.4, 0.3, 0.1, 0.9, 0.8, 0.7,
    				0.4, 0.4, 0.3, 0.1, 0.9, 0.8, 0.8, 0.4, 0.4, 0.4, 0.2, 0.1, 
    				0.9, 0.7, 0.9, 0.5, 0.4, 0.5, 0.3, 0.2, 0.1, 1.0, 0.7, 0.8, 
    				1.0, 0.0, 0.6, 0.4, 0.3, 0.2, 0.1 ];

	var pegList = new Array();
	//TODO: Change to individual ratios
	var ratio = .5; //ratio will be a percentage of leftward movement

	function addPeg(x, y, i, j) {
		pegList[i][j] = new Peg(x, y, i, j, ratio);
		peg_layer.add(pegList[i][j].shape);
		tooltip_layer.add(pegList[i][j].tooltip);
	}

	function addLastRow() {
		var index = pegList.length;
		var row = pegList[index-1];
		for (var i=0; i<row.length; i++) {
			var peg = row[i];
			peg.shape.hide();
			peg.odometer = 0;
			peg.odoMarble = null;
		}
		peg_layer.draw();
	}

	function createBins() {
		var index = pegList.length;
		var row = pegList[index-2];
		for ( var i=0; i<row.length; i++) {
			var x = row[i].shape.getX();
			var y = row[i].shape.getY();
			var bin = new Kinetic.Line({
				points: [x, y, x, y+yInt+7],
				fill: 'black',
				stroke: 'black',
				strokeWidth: 4,
				lineCap: 'square',
			});
			bin_layer.add(bin);
		}
		bin_layer.draw();
	}

	//add first peg (aka base peg)
	pegList[0] = new Array();
	addPeg(xCoor, yCoor, 0, 0);

	console.log('*** Debugging Information ***');
	for (var m=1; m<11; m++) {
		pegList[m] = new Array();
		var y = pegList[m-1][0].y;
		//console.log('m: ' +m);
		var x;
		var n;
		for (n=0; n<pegList[m-1].length; n++) {
			//console.log('	n: ' +n);
			x = pegList[m-1][n].x;
			addPeg(x - xInt, y + yInt, m, n);
			//this adds a peg to the left and down a row of all
			//pegs in the pervious row
		}
		//add final right peg

		//NOTE: the for loop increments n BEFORE it checks the
		//continue boolean, therefore the n below is n+1 of the
		//last n used inside the loop
		addPeg(x + xInt, y + yInt, m, n);
		//console.log('Row Added Successfully');
	}
	addLastRow();
	createBins();
	assignPinProb(conway);
	createGraph();

	stage.add(peg_layer);
	stage.add(bin_layer);
	stage.add(tooltip_layer);

/****************************************************** Marble and Simulation Functions **************************************************/

	//Speed of the simulation (ms)
	var execSpeed = 250;

	function Marble(xPos, yPos) {
		var colorIndex = Math.floor(Math.random()*colorArray.length);

		this.xPos = xPos;
		this.yPos = yPos;
		this.color = colorArray[colorIndex];
		this.currPeg = pegList[0][0];
		this.shape = new Kinetic.Circle({
						x: this.xPos,
						y: this.yPos,
						radius: 22,
						fill: this.color,
						stroke: 'black',
						strokeWidth: 1
		});
	}

	Marble.prototype.move = function() {
		//console.log('***Initiate Move Sequence***');
		var i = this.currPeg.i;
		var j = this.currPeg.j;
		var dir = this.getDirection();
		//console.log('Direction: ' +dir);
		var tarPeg = (dir == 'left') ? pegList[i+1][j] : pegList[i+1][j+1];
		var offset = (dir == 'left') ? -1 : 1;
		var first_pos_x = this.xPos + (25*offset);
		var first_pos_y = this.yPos + (-5);
		var second_pos_x = first_pos_x + (10*offset);
		var second_pos_y = first_pos_y + 10;
		var third_pos_x = second_pos_x + (15*offset);
		var third_pos_y = (((tarPeg.y - second_pos_y) / 2) -10 )+second_pos_y;
		var fourth_pos_x = tarPeg.x;
		var fourth_pos_y = tarPeg.y-31;

		var that = this;
		setTimeout( function() {
			//create arc animation

			that.xPos = first_pos_x;
			that.yPos = first_pos_y;
			that.shape.setAttr('x', first_pos_x);
			that.shape.setAttr('y', first_pos_y);
			marble_layer.draw();
			//console.log('First Position Reached');
		}, (execSpeed/4)*1 );

		setTimeout( function() {
			that.xPos = second_pos_x;
			that.yPos = second_pos_y;
			that.shape.setAttr('x', second_pos_x);
			that.shape.setAttr('y', second_pos_y);
			marble_layer.draw();
			//console.log('Second Position Reached');
		}, (execSpeed/4)*2 );

		setTimeout( function() {
			that.xPos = third_pos_x;
			that.yPos = third_pos_y;
			that.shape.setAttr('x', third_pos_x);
			that.shape.setAttr('y', third_pos_y);
			marble_layer.draw();
			//console.log('Third Position Reached');
		}, (execSpeed/4)*3 );

		setTimeout( function() {
			that.xPos = fourth_pos_x;
			that.yPos = fourth_pos_y;
			that.shape.setAttr('x', fourth_pos_x);
			that.shape.setAttr('y', fourth_pos_y);
			marble_layer.draw();
			//console.log('Fourth Position Reached');
		}, (execSpeed/4)*4 );

		setTimeout( function() {
			//post-animation code
			that.currPeg = tarPeg;
		}, (execSpeed/4)+1 );
	}

	Marble.prototype.setPeg = function(peg) {
		this.currPeg = peg;
	}

	Marble.prototype.getDirection = function() {
		var ratio = this.currPeg.ratio;
		ratio = ratio * 100;
		var rand = Math.floor(Math.random()*100) + 1;
		return (rand <= ratio) ? 'left' : 'right';
	}

	Marble.prototype.destroy = function() {
		this.shape.destroy();
		delete this;
	}

	var currMar = new Marble(xCoor, yCoor-35);
	marble_layer.add(currMar.shape);

	stage.add(marble_layer);
	stage.add(odometer_layer);
	stage.add(text_layer);

	var simId;
	var runSimulation = function() {
		if ( pegList[currMar.currPeg.i+1] != undefined ) {
			currMar.move();
		}
		else {
			console.log('***End Reached***');
			var lastPeg = currMar.currPeg
			console.log('lastPeg.odometer: ' +lastPeg.odometer);
			if (lastPeg.odometer == undefined ) {
				alert('Error with odometer function');
			}
			else if (lastPeg.odometer == 0 ) {
				console.log('***Setting Odometer Function***');
				lastPeg.odometer++;
				lastPeg.odoMarble = currMar.shape.clone();
				lastPeg.odoMarble.moveTo(odometer_layer);
				lastPeg.odoMarble.move(0, 20);
				lastPeg.odoText = new Kinetic.Text({
								x: lastPeg.x-5,
								y: lastPeg.y-15,
								text: lastPeg.odometer,
								fontSize: 24,
								fontFamily: 'Arial',
								fill: 'white',
								visible: true
				});
				lastPeg.odoText.setX( lastPeg.odoMarble.getX() - lastPeg.odoText.getWidth()/2 );
				lastPeg.odoText.setY( lastPeg.odoMarble.getY() - lastPeg.odoText.getHeight()/2 );

				lastPeg.outLineText = new Kinetic.Text({
								x: lastPeg.x-5,
								y: lastPeg.y-15,
								text: lastPeg.odometer,
								fontSize: 24,
								fontFamily: 'Arial',
								fill: 'black',
								stroke: 'black',
								strokeWidth: 1.85,
								visible: true
				});
				lastPeg.outLineText.setX( lastPeg.odoMarble.getX() - lastPeg.outLineText.getWidth()/2 );
				lastPeg.outLineText.setY( lastPeg.odoMarble.getY() - lastPeg.outLineText.getHeight()/2 );

				text_layer.add(lastPeg.outLineText);
				text_layer.add(lastPeg.odoText);
			}
			else if (lastPeg.odometer > 0) {
				console.log('***Incrementing Odormeter Function***');
				if ( lastPeg.odoMarble.getY() != 604 ) {lastPeg.odoMarble.setY(604);} //an attempt to solve the floating bug
				lastPeg.odoMarble.setFill(currMar.shape.getFill());
				lastPeg.odometer++;
				lastPeg.odoText.setText(lastPeg.odometer);
				lastPeg.odoText.setX( lastPeg.odoMarble.getX() - lastPeg.odoText.getWidth()/2 );
				lastPeg.odoText.setY( lastPeg.odoMarble.getY() - lastPeg.odoText.getHeight()/2 );
				lastPeg.outLineText.setText(lastPeg.odometer);
				lastPeg.outLineText.setX( lastPeg.odoMarble.getX() - lastPeg.outLineText.getWidth()/2 );
				lastPeg.outLineText.setY( lastPeg.odoMarble.getY() - lastPeg.outLineText.getHeight()/2 );
			}
			updateGraph(lastPeg.j, lastPeg.odometer);
			currMar.destroy();
			currMar = new Marble(xCoor, yCoor-35);
			marble_layer.add(currMar.shape);
			marble_layer.draw();
			odometer_layer.draw();
			text_layer.draw();
		}
	}

/***************************************************** Graph Functions *******************************************************************/

	function extractData() {
		var histoData = new Array();
		var index = pegList.length;
		for (var i=0; i<pegList[index-1].length; i++) {
			histoData[i] = pegList[index-1][i].odometer;
		}
		console.log('**Data Extraction Successful**');
		return histoData;
	}

	function updateGraph(index, value) {
		var graph = $("#histo").highcharts();
		graph.series[0].data[index].update(value);
	}

    function createGraph() {
    	var container =  $("#graph");
    	var ht = container.height()+(div_height*0.75);
    	container.attr('height', ht);
    	container.append('<div id="histo" style="width:725; height:'+ht+';"></div>');
    	var histo = container.find("#histo");
    	var histoData = extractData();
    	histo.highcharts({
    		chart: {
    			type: 'column',
    			width: 700
    		},
    		title: {
    			text: 'Simulation Results'
    		},
    		legend: {
    			enabled: false
    		},
    		xAxis: {
    			categories: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5',
    				'Position 6', 'Position 7', 'Position 8', 'Position 9']
    		},
    		yAxis: {
    			min: 0,
    			allowDecimals: false,
    			title: {
    				text: 'Number of Marbles at Position'
    			}
    		},
    		plotOptions: {
    			column: {
    				dataLabels: {
    					enabled: true,
    					color: 'black'
    				}
    			}
    		},
    		series: [{
    			data: histoData
    		}]
    	});
    }

    /***********************************************************************************************************************/
    /*													Proppability Functions											   */

    function assignPinProb( probArray_ ) {
    	var count = 0;
    	var probArray = probArray_;
    	$.each(pegList, function( index1, arr ) {
    		$.each(arr, function( index2, peg) {
    			if ( index1 < pegList.length-1) {
					peg.ratio = probArray[count];
	    			count++;
	    			peg.shape.on('mouseenter', function(e) {
	    				if ( !peg.tooltipCreated ) {
		    				peg.tooltip.add(new Kinetic.Tag( {
		    						fill: 'black',
		    						pointerDirection: 'up',
		    						pointerWidth: 10,
		    						pointerHeight: 4,
		    						lineJoin: 'round',
		    						cornerRadius: 50
		    				}));
		    				peg.tooltip.add(new Kinetic.Text( {
		    						text: peg.ratio,
		    						fontFamily: 'Arial',
		    						fontSize: 22,
		    						padding: 5,
		    						fill: 'white',
		    						cornerRadius: 50
		    				}));
		    				peg.tooltipCreated = true;
    					}
    					else if ( peg.tooltipCreated ) {
    						peg.tooltip.show();
    					}
	    				tooltip_layer.draw();
	    			});
	    			peg.shape.on('mouseleave', function(e) {
	    				peg.tooltip.hide();
	    				tooltip_layer.draw();
	    			});
    			}
    		});
    	});
    }

    var tooltip_status = false; //false = off (or individual), true = on
    function toggleAllTooltips() {
    	$.each(pegList, function( index1, arr ) {
    		$.each(arr, function( index2, peg ) {

    			//if the tooltips are not being shown, turn them on
    			if (!tooltip_status) {
    				peg.shape.fire('mouseenter');
    			}
    			//if the tooltips are being shown, turn them off
    			else if (tooltip_status) {
    				peg.shape.fire('mouseleave');
    			}
    			//else - Error
    			else {
    				console.log('Error with toggleAllTooltips');
    				alert('Error with toggling tooltips - tooltip_status reached unknown state');
    			}

    		});
    	});
    	tooltip_status = (!tooltip_status) ? true : false;
    }

/******************************************************* Button and UI Functions ******************************************************/

	$('#start').on('click', function() {
		console.log('***Simulation Initiated***');
		simId = setInterval(runSimulation, (execSpeed/4)+execSpeed);
		$("#pause").removeAttr("disabled");
		$(this).attr('disabled', 'true');
	});

	$('#pause').on('click', function() {
		console.log('***Simulation Paused***');
		clearInterval(simId);
		simId = undefined;
		$("#start").removeAttr("disabled");
		$(this).attr('disabled', 'true');
	});

	$("#reset_btn").on("click", function() {
        $(this).unbind("click");
        $("#start").removeAttr("disabled");
		$("#pause").attr('disabled', 'true');
        window.location.reload();
    });

    $("#tooltip_btn").on("click", function() {
    	toggleAllTooltips();
    });


}); // End of jQuery doc.ready()