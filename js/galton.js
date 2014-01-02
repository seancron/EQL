$(document).ready( function() {

	function Peg(x, y, i, j, ratio) {
		this.x = x;
		this.y = y;
		this.i = i;
		this.j = j;
		this.shape = new Kinetic.Circle({
						x: x,
						y: y,
						radius: 8,
						fill: 'black',
						stroke: 'black',
						strokeWidth: 2
		});
		this.ratio = ratio;
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
	var marble_layer = new Kinetic.Layer();

	var xCoor = (stage.getWidth()/2);
	var yCoor = 70;
	var xInt = 60;
	var yInt = 65;

	var pegList = new Array();
	//TODO: Change to individual ratios
	var ratio = .5; //ratio will be a percentage of leftward movement

	function addPeg(x, y, i, j) {
		pegList[i][j] = new Peg(x, y, i, j, ratio);
		peg_layer.add(pegList[i][j].shape);
	}

	//add first peg (aka base peg)
	pegList[0] = new Array();
	addPeg(xCoor, yCoor, 0, 0);

	console.log('*** Debugging Information ***');
	for (var m=1; m<8; m++) {
		pegList[m] = new Array();
		var y = pegList[m-1][0].y;
		console.log('m: ' +m);
		var x;
		var n;
		for (n=0; n<pegList[m-1].length; n++) {
			console.log('	n: ' +n);
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
		console.log('Row Added Successfully');
	}

	stage.add(peg_layer);

	//Speed of the simulation
	var execSpeed = 350;

	function Marble(xPos, yPos) {
		var colorIndex = Math.floor(Math.random()*17);

		this.xPos = xPos;
		this.yPos = yPos;
		this.color = colorArray[colorIndex];
		this.currPeg = pegList[0][0];
		this.shape = new Kinetic.Circle({
						x: this.xPos,
						y: this.yPos,
						radius: 25,
						fill: this.color,
						stroke: 'black',
						strokeWidth: 1
		});
	}

	Marble.prototype.move = function() {
		console.log('***Initiate Move Sequence***');
		var i = this.currPeg.i;
		var j = this.currPeg.j;
		var dir = this.getDirection();
		console.log('Direction: ' +dir);
		var tarPeg = (dir == 'left') ? pegList[i+1][j] : pegList[i+1][j+1];
		var offset = (dir == 'left') ? -1 : 1;
		var first_pos_x = this.xPos + (25*offset);
		var first_pos_y = this.yPos + (-10);
		var second_pos_x = first_pos_x + (10*offset);
		var second_pos_y = first_pos_y + 10;
		var third_pos_x = second_pos_x + (15*offset);
		var third_pos_y = (((tarPeg.y - second_pos_y) / 2) -10 )+second_pos_y;
		var fourth_pos_x = tarPeg.x;
		var fourth_pos_y = tarPeg.y-35;

		var that = this;
		setTimeout( function() {
			//create arc animation

			that.xPos = first_pos_x;
			that.yPos = first_pos_y;
			that.shape.setAttr('x', first_pos_x);
			that.shape.setAttr('y', first_pos_y);
			marble_layer.draw();
			console.log('First Position Reached');
		}, (execSpeed/4)*1 );

		setTimeout( function() {
			that.xPos = second_pos_x;
			that.yPos = second_pos_y;
			that.shape.setAttr('x', second_pos_x);
			that.shape.setAttr('y', second_pos_y);
			marble_layer.draw();
			console.log('Second Position Reached');
		}, (execSpeed/4)*2 );

		setTimeout( function() {
			that.xPos = third_pos_x;
			that.yPos = third_pos_y;
			that.shape.setAttr('x', third_pos_x);
			that.shape.setAttr('y', third_pos_y);
			marble_layer.draw();
			console.log('Third Position Reached');
		}, (execSpeed/4)*3 );

		setTimeout( function() {
			that.xPos = fourth_pos_x;
			that.yPos = fourth_pos_y;
			that.shape.setAttr('x', fourth_pos_x);
			that.shape.setAttr('y', fourth_pos_y);
			marble_layer.draw();
			console.log('Fourth Position Reached');
		}, (execSpeed/4)*4 );

		setTimeout( function() {
			//post-animation code
			that.currPeg = tarPeg;
		}, (execSpeed/4)+100 );
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
		delete this;
	}

	var currMar = new Marble(xCoor, yCoor-35);
	marble_layer.add(currMar.shape);

	stage.add(marble_layer);


	var simId;
	var runSimulation = function() {
		if ( pegList[currMar.currPeg.i+1] != undefined ) {
			currMar.move();
		}
		else {
			currMar.destroy();
			currMar = new Marble(xCoor, yCoor-35);
			marble_layer.add(currMar.shape);
		}
	}

	$('#start').on('click', function() {
		console.log('***Simulation Initiated***');
		simId = setInterval(runSimulation, (execSpeed/4)+execSpeed);
		$("#pause").removeAttr("disabled");
		$(this).attr('disabled', 'true');
	});

	$('#pause').on('click', function() {
		console.log('***Simulation Paused***');
		clearInterval(simId);
		$("#start").removeAttr("disabled");
		$(this).attr('disabled', 'true');
	});

	$("#reset_btn").on("click", function() {
        $(this).unbind("click");
        $("#start").removeAttr("disabled");
		$("#pause").attr('disabled', 'true');
        window.location.reload();
    });

});