let cons = {};

cons.colours = {
	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	white: 37,
}
cons.colour = function(text){
	
	let search, replacement;
	for(var colour in cons.colours){
		search = "@clear@";
		replacement = "\x1b[0m";
        text = text.replace(new RegExp(search, 'g'), replacement);
        search = "#clear#";
        text = text.replace(new RegExp(search, 'g'), replacement);


        search = "@dark-"+colour+"@";
		replacement = "\x1b["+cons.colours[colour]+"m";
		text = text.replace(new RegExp(search, 'g'), replacement);
		
		search = "@"+colour+"@";
		replacement = "\x1b[1;"+cons.colours[colour]+"m";
		text = text.replace(new RegExp(search, 'g'), replacement);
		
		search = "#dark-"+colour+"#";
		replacement = "\x1b["+(cons.colours[colour]+10)+"m";
		text = text.replace(new RegExp(search, 'g'), replacement);
		
		search = "#"+colour+"#";
		replacement = "\x1b[1;"+(cons.colours[colour]+10)+"m";
		text = text.replace(new RegExp(search, 'g'), replacement);
		
	}
	text += "\x1b[0m";
	console.log(text);
}

module.exports = cons;