/*
 * Evana Gizzi 
*/

$(document).ready(function(){
	person = new Object();
	person.name = "Evana";

	/* each circle class will have a boolean for selected */
	/* two functions are shift arrows, and move particle */


	/*
	find circle.selected == true
		var circle_pos == (x, y) pos of circle based on table cell 
		var new_direction
		find circle.arrows(arrows as an array).selected == true (also, will be the only large arrow)
			changed the selected arrow to unselected (or small)
			if array.next != null 
				set the next arrow in the array as selected (or large)
				new_direction = next_arrow class (left or right)
			else 
				array[0] = selected (large)
				new_direction = next_arrow class (left or right)
		set circle.selected to unselected 
		if new_direction == left
			new_circle = (x+2, y-1) 
		else if new_direction == right
			new_circle = (x+2, y+1) 
		else 
			Alert("error")
		find the circle w pos "new_circle" and set it to selected
	*/

	alert("HI");
	alert(person.name);
});