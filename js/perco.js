$(document).ready( function() {

	var shape_list = new Array();

	function Shape_Obj(x, y, radius, i, j) {
		this.x = x;
		this.y = y;
		this.i = i;
		this.j = j;
		this.radius = radius;
		this.shape = new Kinetic.RegularPolygon({
						x: x,
						y: y,
						radius: 60,
						sides: 6,
						fill: 'yellow',
						stroke: 'black',
						strokeWidth: 2
					});
		this.charge = 'negative';
		this.border = false;
	}

	var div_width = $("#display-wrapper").width();
	var div_height = $("#display-wrapper").height();
	var stage = new Kinetic.Stage({
		container: 'display-wrapper',
		width: div_width,
		height: div_height
	});

	var shape_layer = new Kinetic.Layer();
	var path_layer = new Kinetic.Layer();

	var xCoor = stage.getWidth()/2;
	var yCoor = 80;
	var xInt = 70;
	var yInt = 121;

	for (var i=0; i<5; i++) {
		var y = yCoor + (yInt*i);
		shape_list[i] = new Array();
		switch(i) {
			case 0:
				addShape(xCoor-70, y, i);
				addShape(xCoor+70, y, i);
				break;
			case 1:
				addShape(xCoor-140, y, i);
				addShape(xCoor, y, i);
				addShape(xCoor+140, y, i);
				break;
			case 2:
				addShape(xCoor-210, y, i);
				addShape(xCoor-70, y, i);
				addShape(xCoor+70, y, i);
				addShape(xCoor+210, y, i);
				break;
			case 3:
				addShape(xCoor-280, y, i);
				addShape(xCoor-140, y, i);
				addShape(xCoor, y, i);
				addShape(xCoor+140, y, i);
				addShape(xCoor+280, y, i);
				break;
			case 4:
				addShape(xCoor-350, y, i);
				addShape(xCoor-210, y, i);
				addShape(xCoor-70, y, i);
				addShape(xCoor+70, y, i);
				addShape(xCoor+210, y, i);
				addShape(xCoor+350, y, i);
				break;
			default:
				alert("Error with Switch");
		}
	}

	stage.add(shape_layer);
	stage.add(path_layer);

	function addShape(x, y, i) {
		var temp = shape_list[i].length;
		shape_list[i].push( new Shape_Obj(x, y, 35, i, temp) );
		var j = shape_list[i].length - 1;
		shape_layer.add(shape_list[i][j].shape);
		if ( j == 0 ) {
			shape_list[i][j].border = true;
			shape_list[i][j].shape.setStrokeWidth(6);
		}
		else if (j == i+1) {
			toggleSign(shape_list[i][j]);
			shape_list[i][j].border = true;
			shape_list[i][j].shape.setStrokeWidth(6);
		}
		shape_layer.draw();
	}

	function toggleSign(obj) {
		var shape = obj.shape;
		if ( !obj.border ) {
			if (obj.charge == 'positive') {
				obj.charge = 'negative';
				shape.setFill('yellow');
			}
			else {
				obj.charge = 'positive';
				shape.setFill('#0033FF');
			}
			shape_layer.draw();
		}
	}

	function Line_Obj() {
		this.line = new Kinetic.Line({
					points: [xCoor, 20, xCoor, yInt],
					fill: 'red',
					stroke: 'red',
					strokeWidth: 16,
					lineCap: 'round',
					lineJoin: 'round'
		});
		this.type = 'straight';
		this.ptr1 = shape_list[0][0];
		this.ptr2 = shape_list[0][1];
		this.ptr3 = shape_list[1][1];
		this.toFlip = new Array();
		this.toFlip.push(this.ptr3);
	}

	function getNextDirection(obj) {
		var ptr = obj.ptr3;
		return (ptr.charge == 'positive') ? -1 : 1;
	}

	function contLine(obj, direction) {
		var line = obj.line;
		var arr = line.getPoints();
		var lastX = arr[arr.length-1].x;
		var lastY = arr[arr.length-1].y;
		var newX;
		var newY;
		if (obj.type == 'straight') {
			//next -> draw a angled
			if ( direction == -1 ) {
				//if left
				var i = obj.ptr1.i;
				var j = obj.ptr1.j;
				obj.ptr2 = shape_list[i+1][j];
				obj.toFlip.push(obj.ptr2);
			}
			else if ( direction == 1 ) {
				//if right
				var i = obj.ptr3.i;
				var j = obj.ptr3.j;
				var temp = shape_list[i][j+1];
				obj.ptr1 = obj.ptr2;
				obj.ptr2 = obj.ptr3;
				obj.ptr3 = temp;
				obj.toFlip.push(temp);
			}
			newX = (direction * 70) + lastX;
			newY = lastY + 40;
			obj.type = 'angled';
		}
		else if (obj.type == 'angled') {
			if ( shape_list[obj.ptr3.i+1] == undefined ) {
				//if end of stage
				newX = lastX;
				newY = yInt * direction;
				obj.type = 'done';
				arr.push( ({x: newX, y: newY}) );
				obj.line.setPoints(arr);
				path_layer.draw();
				return;
			}
			//next -> draw a straight
			var i = obj.ptr3.i;
			var j = obj.ptr3.j;
			var temp = shape_list[i+1][j];
			obj.ptr1 = obj.ptr2;
			obj.ptr2 = obj.ptr3;
			obj.ptr3 = temp;
			obj.toFlip.push(temp);
			newX = lastX;
			newY = yInt * direction;
			obj.type = 'straight';
		}
		else {
			alert("Error with Line Path");
			return;
		}
		arr.push( ({x: newX, y: newY}) );
		obj.line.setPoints(arr);
		path_layer.draw();
	}

	var linePtr = null;
	var count = 1;
	var btnNext = "flip";
	var btnClicks = 0;
	var stageSwitch = 1;
	function runButton() {
		if ( linePtr == null ) {
			linePtr = new Line_Obj();
			path_layer.add(linePtr.line);
			path_layer.draw();
			count = count+1;
			return;
		}
		if ( count == 6 ) {
			linePtr.line.remove();	
			path_layer.draw();
			linePtr = null;
			count = 1;
			btnClicks = 0;
			return;
		}
		if ( btnNext == 'flip' ) {
			var temp = linePtr.toFlip;
			for ( var i=0; i<temp.length; i++ ) {
					toggleSign(temp[i]);
				}
			btnNext = 'move';
			temp.length = 0;
			return;
		}
		if ( linePtr.type == 'straight') {
			if ( btnNext == 'move' ) {
				var nextDir = getNextDirection(linePtr);
				contLine(linePtr, nextDir);
				btnNext = 'flip';
			}
			else {
				alert("Error inside Move Particle: Error 1");
			}
		}
		else if ( linePtr.type == 'angled' ) {
			if ( btnNext == 'move' ) {
				contLine(linePtr, count, btnNext);
				count = count+1;
				btnNext = 'flip';
			}
			else {
				alert("Error inside Move Particle: Error 2");
			}
		}
		else {
			alert("Error inside Move Particle: Error 3");
		}
		path_layer.draw();
	}

	$("#movepart").on("click", function() {
		stageSwitch = 1;
		btnClicks = btnClicks+1;
		runButton();
	});

	$("#reset_btn").on("click", function() {
        $(this).unbind("click");
        window.location.reload();
    });

    $("#stage").on("click", function() {
    	if ( stageSwitch == 1 ) {
    		while ( btnClicks < 17 ) {
	    		runButton();
	    		btnClicks = btnClicks+1;
	    	}
	    	btnClicks = 0;
	    	stageSwitch = 0;
    	}
    	else if ( stageSwitch == 0 ) {
    		runButton();
    		stageSwitch = 1;
    	}
    	else {
    		alert('Error with Stage Button');
    	}
    });

    var autoCount = 0;
    var autoId;
   	var autoTest = function() {
    	if ( autoCount <= 2000 ) {
    		autoCount++;
    		runButton();
    	}
    	else {
    		clearInterval(autoTest);
    	}
    }

    $("#auto").on("click", function() {
    	var btnName = $(this).text();
    	if ( btnName == 'Auto Pilot') {
    		autoId = setInterval(autoTest, 500);
    		$(this).text('Stop...');
    	}
    	else if ( btnName == 'Stop...') {
    		clearInterval(autoId);
    		$(this).text('Auto Pilot');
    		autoCount = 0;
    	}
    	else {
    		alert('Error with Auto Pilot Button');
    	}
    });
});