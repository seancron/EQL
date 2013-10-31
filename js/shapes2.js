$(document).ready( function() {

	var shape_list = new Array();

	function Shape_Obj(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = 35;
		this.shape = new Kinetic.RegularPolygon({
						x: x,
						y: y,
						radius: radius,
						sizes: 6,
						fill: 'blue',
						stroke: 'black',
						strokeWidth: 2
					});
		this.charge = 'positive';
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
	var particle_layer = new Kinetic.Layer();
	var text_layer = new Kinetic.Layer();

	var xCoor = (stage.getWidth()/2);
	var yCoor = 40;
	var xInt = 100;
	var yInt = 120;

	for (var i=0; i<5; i++) {
		y = yCoor + (yInt*i);
		shape_list[i] = new Array();
		switch(i) {
			case 0:
				addCircle(xCoor, y, i, 0);
				break;
			case 1:
				addCircle( (xCoor+(-100)), y, i, 0);
				addCircle( (xCoor+(100)), y, i, 1);
				break;
			case 2:
				addCircle( (xCoor+(-200)), y, i, 0);
				addCircle( xCoor, y, i, 1);
				addCircle( (xCoor+(200)), y, i, 2);
				break;
			case 3:
				addCircle( (xCoor+(-300)), y, i, 0);
				addCircle( (xCoor+(-100)), y, i, 1);
				addCircle( (xCoor+(100)), y, i, 2);
				addCircle( (xCoor+(300)), y, i, 3);
				break;
			case 4:
				addCircle( (xCoor+(-400)), y, i, 0);
				addCircle( (xCoor+(-200)), y, i, 1);
				addCircle( xCoor, y, i, 2);
				addCircle( (xCoor+(200)), y, i, 3);
				addCircle( (xCoor+(400)), y, i, 4);
				break;
			default:
				alert("Error with Switch");
		}
	}

	stage.add(circle_layer);
	stage.add(text_layer);

	function addCircle(x, y, i, j) {
		shape_list[i][j] = new Shape_Obj(x, y, 35);
		circle_layer.add(shape_list[i][j].shape);
		text_layer.add(shape_list[i][j].text);
		if ( i==4 ) {
			shape_list[i][j].shape.hide();
			circle_layer.draw();
			text_layer.draw();
		}
	}

});