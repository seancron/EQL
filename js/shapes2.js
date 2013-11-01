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
		// this.text = new Kinetic.Text({
		// 				x: x-8,
		// 				y: y-5,
		// 				text: this.odometer,
		// 				fontSize: 20,
		// 				fontFamily: 'Arial',
		// 				fill: 'white',
		// 				visible: false
		// });
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
	// var particle_layer = new Kinetic.Layer();
	// var text_layer = new Kinetic.Layer();

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
		if ( j==0 ) {
			shape_list[i][j].border = true;
		}
		else if (j==i+1) {
			toggleSign(shape_list[i][j]);
			shape_list[i][j].border = true;
		}
	}

	function toggleSign(obj) {
		var shape = obj.shape;
		if (obj.charge == 'positive') {
			obj.charge = 'negative';
			shape.setFill('yellow');
		}
		else {
			obj.charge = 'positive';
			shape.setFill('blue');
		}
		shape_layer.draw();
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
		this.tar = shape_list[1][1];
	}

	function contLine(obj, direction) {
		var line = obj.line;
		var arr = line.getPoints();
		var lastX = arr[arr.length-1].x;
		var lastY = arr[arr.length-1].y;
		var newX;
		var newY;
		if (obj.type == 'straight') {
			newX = (direction * 70) + lastX;
			newY = lastY + 40;
			obj.type = 'angled';
			if ( direction == -1 ) {
				var i = ptr3.i;
				var j = ptr3.j;
				linePtr.tar = shape_list[i-1][j+1];
			}
		}
		else if (obj.type == 'angled') {
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

	//test
	// var linePtr = new Line_Obj(array);
	// path_layer.add(linePtr.line);
	// path_layer.draw();
	// contLine(linePtr, 1);
	// contLine(linePtr, 2);
	// contLine(linePtr, -1);
	// contLine(linePtr, 3);
	// contLine(linePtr, 1);
	// contLine(linePtr, 4);
	// contLine(linePtr, -1);
	// contLine(linePtr, 5);

	var linePtr = null;
	var test = -1;
	var count = 1;
	var flip = false;
	$("#testing2").on("click", function() {
		if ( linePtr == null ) {
			linePtr = new Line_Obj();
			path_layer.add(linePtr.line);
			path_layer.draw();
			count = count+1;
			flip = true;
			return;
		}
		if ( count == 6 ) {
			linePtr.line.remove();	
			path_layer.draw();
			linePtr = null;
			count = 1;
			test = test * -1;
			return;
		}
		if ( flip ) {
			toggleSign(linePtr.tar);
			flip = false;
			return;
		}

		if ( linePtr.type == 'straight') {
			contLine(linePtr, test);
		}
		else if ( linePtr.type == 'angled' ) {
			contLine(linePtr, count);
			count = count+1;
		}
		else {
			alert("Error inside MoveParticle Function");
		}

		path_layer.draw();
	});

	$("#reset_btn").on("click", function() {
        $(this).unbind("click");
        window.location.reload();
    });
});