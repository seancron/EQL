$(document).ready( function() {

	var shape_list = new Array();

	function Shape_Obj(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.shape = new Kinetic.Circle({
						x: x,
						y: y,
						radius: 35,
						fill: 'white',
						stroke: 'black',
						strokeWidth: 2
					});
		this.arrows = new Array();
		this.selected = false;
		this.odometer = 0;
		this.text = new Kinetic.Text({
						x: x-8,
						y: y-5,
						text: this.odometer,
						fontSize: 20,
						fontFamily: 'Arial',
						fill: 'black',
						visible: false
		});
	}

	var div_width = $("#display-wrapper").width();
	var div_height = $("#display-wrapper").height();
	var stage = new Kinetic.Stage({
		container: 'display-wrapper',
		width: div_width,
		height: div_height
	});

	var circle_layer = new Kinetic.Layer();
	var arrows_layer = new Kinetic.Layer();
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

	addArrows(0, 0, 1, 0, -0.259, 0.966, 0.707, -0.707, 1);
	addArrows(0, 0, 1, 1, 0.259, 0.966, -0.707, -0.707, 2);

	addArrows(1, 0, 2, 0, -0.5, 0.866, 0.5, -0.866, 1);
	addArrows(1, 0, 2, 0, -0.259, 0.966, 0.707, -0.707, 2);
	addArrows(1, 0, 2, 1, 0.259, 0.966, -0.707, -0.707, 3);

	addArrows(1, 1, 2, 1, -0.259, 0.966, 0.707, -0.707, 1);
	addArrows(1, 1, 2, 2, 0.259, 0.966, -0.707, -0.707, 2);
	addArrows(1, 1, 2, 2, 0.5, 0.866, -0.5, -0.866, 3);

	addArrows(2, 0, 3, 0, -0.707, 0.707, 0.259, -0.966, 1);
	addArrows(2, 0, 3, 0, -0.5, 0.866, 0.5, -0.866, 2);
	addArrows(2, 0, 3, 0, -0.259, 0.966, 0.707, -0.707, 3);
	addArrows(2, 0, 3, 1, 0.259, 0.966, -0.707, -0.707, 4);

	addArrows(2, 1, 3, 1, -0.5, 0.866, 0.5, -0.866, 1);
	addArrows(2, 1, 3, 1, -0.259, 0.966, 0.707, -0.707, 2);
	addArrows(2, 1, 3, 2, 0.259, 0.966, -0.707, -0.707, 3);
	addArrows(2, 1, 3, 2, 0.5, 0.866, -0.5, -0.866, 4);

	addArrows(2, 2, 3, 2, -0.259, 0.966, 0.707, -0.707, 1);
	addArrows(2, 2, 3, 3, 0.259, 0.966, -0.707, -0.707, 2);
	addArrows(2, 2, 3, 3, 0.5, 0.866, -0.5, -0.866, 3);
	addArrows(2, 2, 3, 3, 0.707, 0.707, -0.259, -0.966, 4);

	addArrows(3, 0, 4, 0, -0.866, 0.5, 0, -1, 1);
	addArrows(3, 0, 4, 0, -0.707, 0.707, 0.259, -0.966, 2);
	addArrows(3, 0, 4, 0, -0.5, 0.866, 0.5, -0.866, 3);
	addArrows(3, 0, 4, 0, -0.259, 0.966, 0.707, -0.707, 4);
	addArrows(3, 0, 4, 1, 0.259, 0.966, -0.707, -0.707, 5);

	addArrows(3, 1, 4, 1, -0.707, 0.707, 0.259, -0.966, 1);
	addArrows(3, 1, 4, 1, -0.5, 0.866, 0.5, -0.866, 2);
	addArrows(3, 1, 4, 1, -0.259, 0.966, 0.707, -0.707, 3);
	addArrows(3, 1, 4, 2, 0.259, 0.966, -0.707, -0.707, 4);
	addArrows(3, 1, 4, 2, 0.5, 0.866, -0.5, -0.866, 5);

	addArrows(3, 2, 4, 2, -0.5, 0.866, 0.5, -0.866, 1);
	addArrows(3, 2, 4, 2, -0.259, 0.966, 0.707, -0.707, 2);
	addArrows(3, 2, 4, 3, 0.259, 0.966, -0.707, -0.707, 3);
	addArrows(3, 2, 4, 3, 0.5, 0.866, -0.5, -0.866, 4);
	addArrows(3, 2, 4, 3, 0.707, 0.707, -0.259, -0.966, 5);

	addArrows(3, 3, 4, 3, -0.259, 0.966, 0.707, -0.707, 1);
	addArrows(3, 3, 4, 4, 0.259, 0.966, -0.707, -0.707, 2);
	addArrows(3, 3, 4, 4, 0.5, 0.866, -0.5, -0.866, 3);
	addArrows(3, 3, 4, 4, 0.707, 0.707, -0.259, -0.966, 4);
	addArrows(3, 3, 4, 4, 0.866, 0.5, 0, -1, 5);


	stage.add(arrows_layer);


	function addArrows(i, j, m, n, fromXScale, fromYScale, toXScale, toYScale, orderId ) {
		var r = 35;
		var r2 = 70;
		var fromX = shape_list[i][j].x;
		var fromY = shape_list[i][j].y;
		var toX = shape_list[m][n].x;
		var toY = shape_list[m][n].y;

		var fx = fromX + (fromXScale*r);
		var fy = fromY + (fromYScale*r);
		var tx = toX + (toXScale*r);
		var ty = toY + (toYScale*r);

		var x_val = Math.abs(fx-tx);
		var y_val = Math.abs(fy-ty);

		if ((fx-tx) < 0) {
			var stx = tx - (x_val/2);
		} else {
			var stx = tx + (x_val/2);
		};

		var sty = ty - (y_val/2);

		shape_list[i][j].arrows.push(addArrowPair(fx, fy, tx, ty, stx, sty, n, m, orderId ));
	}

	function Arrow_Obj(fromX, fromY, toX, toY, stoX, stoY, tarX, tarY, orderId) {
		this.large_arrow = canvas_arrow(fromX, fromY, toX, toY, false);
		this.small_arrow = canvas_arrow(fromX, fromY, stoX, stoY, true);
		this.orderId = orderId;
		this.selected = false;
		this.tarX = tarX;
		this.tarY = tarY;
	}

	function addArrowPair(fromX, fromY, toX, toY, stoX, stoY, tarX, tarY, orderId) {
		var temp = new Arrow_Obj(fromX, fromY, toX, toY, stoX, stoY, tarX, tarY, orderId);
		arrows_layer.add(temp.large_arrow);
		arrows_layer.add(temp.small_arrow);
		return temp;
	}


	function canvas_arrow(fromx, fromy, tox, toy, show){
	    var headlen = 10;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
	    var angle = Math.atan2(toy-fromy,tox-fromx);

	    line = new Kinetic.Line({
	        points: [fromx, fromy, tox, toy, tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6),tox, toy, tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6)],
	        stroke: "black",
	        strokeWidth: 3,
	        visible: show
	    });

	    return line;
	}


	//Click Handlers
	var parPos = null;
	var arw = null;
	initState();

	function initState() {
		for (var i=0; i<4; i++) {
			for (var j=0; j<shape_list[i].length; j++) {
				var max = shape_list[i][j].arrows.length;
				for (var k=0; k < max; k++) {
					if ( max-1 == k) {
						shape_list[i][j].arrows[k].selected = true;
						shape_list[i][j].arrows[k].large_arrow.show();
						shape_list[i][j].arrows[k].small_arrow.hide();
					}
				}
			}
		}
		arrows_layer.draw();
	}

	function clearPath() {
		for( var i=0; i<4; i++) {
			for (var j=0; j<shape_list[i].length; j++) {
				for( var k=0; k<shape_list[i][j].arrows.length; k++ ) {
					if (shape_list[i][j].arrows[k].large_arrow.getStroke() == "red") {
						shape_list[i][j].arrows[k].large_arrow.setStroke('black');
					}
				}
			}
		}
		arrows_layer.draw();
	}

	function moveParticle() {
		if ( parPos == null ) {
			parPos = shape_list[0][0];
			parPos.selected = true;
			selectCircle(parPos);
		}
		else {
			parPos.selected = false;
			selectCircle(parPos);
			parPos = shape_list[arw.tarY][arw.tarX];
			parPos.selected = true;
			selectCircle(parPos);
			arw = null;
		}
	}

	function moveArrow() {
		var arw;
		var max = parPos.arrows.length;
		for (var i=0; i<max; i++) {
			if (parPos.arrows[i].selected) {
				arw = parPos.arrows[i];
				var next = {};
				if (i == max-1) {
					next = parPos.arrows[0];
					break;
				}
				else {
					next = parPos.arrows[i+1];
					break;
				}
			}
		}
		if (next == undefined) {
			parPos.selected = false;
			parPos = shape_list[0][0];
			parPos.selected = true;
			selectCircle(parPos);
			clearPath();
			return null;
		}
		selectArrow(next);
		unselectArrow(arw);
		arrows_layer.draw();
		return next;
	}

	function selectArrow(arw) {
		arw.selected = true;
		arw.large_arrow.show();
		arw.small_arrow.hide();
		arw.large_arrow.setStroke("red");
	}

	function unselectArrow(arw) {
		arw.selected = false;
		arw.large_arrow.hide();
		arw.small_arrow.show();
		arw.large_arrow.setStroke("black");
	}

	function selectCircle(obj) {
		var shape = obj.shape;
		if ( shape.getFill() == "white" ) {
			shape.setFill("red");
			shape.setStrokeWidth(8);
			obj.odometer++;
			obj.text.setText(obj.odometer);
		}
		else {
			shape.setFill("white");
			shape.setStrokeWidth(2);
		}
		circle_layer.draw();
		text_layer.draw();
	}

	$("#testing").on("click", function() {
		if (arrow1.getVisible()) {
			arrow1.hide();
			arrow2.hide();
			arrow3.show();
			arrow4.show();
		}
		else {
			arrow1.show();
			arrow2.show();
			arrow3.hide();
			arrow4.hide();
		}
		arrows_layer.draw();
	});

	$("#testing2").on("click", function() {
		if (parPos == null ) {
			clearPath();
			moveParticle();
		}
		else if (arw == null) {
			arw = moveArrow();
		}
		else {
			moveParticle();
		}
	});

	var odometer_on = false;
	$("#start").on("click", function() {
		for( var i=0; i<4; i++) {
			for (var j=0; j<shape_list[i].length; j++) {
				if (!odometer_on) {
					shape_list[i][j].text.show();
				}
				else if (odometer_on) {
					shape_list[i][j].text.hide();
				}
			}
		}
		odometer_on = !(odometer_on);
		text_layer.draw();
	});

	$("#reset_btn").on("click", function() {
        $(this).unbind("click");
        window.location.reload();
    });

    $("#stage").on("click", function() {
    	if (parPos == null ) {
    		clearPath();
			moveParticle();
		}
    	while ( parPos != null && parPos.arrows[0] != undefined  && parPos.arrows[0].tarX < 5 ) {
    		if (parPos == null ) {
				moveParticle();
			}
			else if (arw == null) {
				arw = moveArrow();
			}
			else {
				moveParticle();
			}

			if (parPos.arrows[0] == undefined) {
				parPos = null;
				arw = null;
			}
    	}
    	if (parPos.arrows[0] == undefined) {
				parPos = null;
				arw = null;
			}
    });


});