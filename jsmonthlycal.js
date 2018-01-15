'use strict';

(function(window, document) {

	var jsMonthlyCal = window.jsMonthlyCal = {
		drawCalendar: drawCalendar
	};


	// simple implementation based on $.extend() from jQuery
	var merge = function() {
		var obj, name, copy,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		for (; i < length; i++) {
			if ((obj = arguments[i]) != null) {
				for (name in obj) {
					copy = obj[name];

					if (target === copy) {
						continue;
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};


	Date.prototype.getWeek = function() {
		var onejan = new Date(this.getFullYear(), 0, 1);
		var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
		var dayOfYear = (today - onejan + 1) / 86400000;
		return Math.ceil(dayOfYear / 7);
	};

	Date.isLeapYear = function(year) {
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	};

	Date.getDaysInMonth = function(year, month) {
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	};

	Date.prototype.isLeapYear = function() {
		return Date.isLeapYear(this.getFullYear());
	};

	Date.prototype.getDaysInMonth = function() {
		return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
	};

	Date.prototype.addMonths = function(value) {
		var n = this.getDate();
		this.setDate(1);
		this.setMonth(this.getMonth() + value);
		this.setDate(Math.min(n, this.getDaysInMonth()));
		return this;
	};


	function drawCalendar(mycontainer, currdate, nbmonth, nbsub, options) {

		var day = ["wk", "mo", "tu", "we", "th", "fr", "sa", "su"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var noday;
		var nomonth;
		var temp;
		var today = new Date();
		// 5 days t = 0; 7 days t = 2
		var t;


		options = merge({
			size: '11px',
			family: 'Verdana, Geneva, sans-serif',
			padding: '5px',
			weekend: false,
			background: {
				color: 'lightgray'
			},
			today: {
				color: 'white',
				bg: 'DimGray'
			},
			week: {
				color: 'orange'
			}
		}, options || {});
		
		if (options.weekend === true) {
			t = 2;
		} else {
			t = 0;
		}

		currdate.addMonths(nbsub);

		var mytable = document.getElementById(mycontainer);

		// 1re row -> title // Month
		temp = new Date(currdate.getFullYear(), currdate.getMonth(), 1);
		var row = mytable.insertRow(0);
		for (nomonth = 0; nomonth <= nbmonth - 1; nomonth += 1) {
			var th = document.createElement('th');
			th.innerHTML = months[temp.getMonth()] + " " + temp.getFullYear();
			th.colSpan = 6 + t;
			th.className = 'tb_title';
			th.style.backgroundColor = options.background.color;
			th.style.fontSize = options.size;
			th.style.fontFamily = options.family;
			th.style.textAlign = 'center';
			row.appendChild(th);

			temp.addMonths(1);
		}
		// 2e row -> title // Wk + days
		row = mytable.insertRow(-1);
		for (nomonth = 0; nomonth <= nbmonth - 1; nomonth += 1) {
			for (noday = 0; noday <= 8 - 1 - 2 + t; noday += 1) {
				// 8 = 7 days + no week - sat - sun
				th = document.createElement('th');
				th.innerHTML = day[noday];
				th.className = 'tb_title';
				th.style.backgroundColor = options.background.color;
				th.style.fontSize = options.size;
				th.style.fontFamily = options.family;
				th.style.textAlign = 'center';
				if (noday === 0) {
					th.style.color = options.week.color;
				}
				row.appendChild(th);
			}
		}

		// other rows -> day number
		var n, first, last;

		// currdate is start date

		// i is row in table
		for (var i = 0; i <= 6 - 1; i += 1) {
			row = mytable.insertRow(-1);
			temp = new Date(currdate.getFullYear(), currdate.getMonth(), 1);
			for (nomonth = 0; nomonth <= nbmonth - 1; nomonth += 1) {
				n = 2 + i * 7;
				// getDay() => day of the week ie 0:Sun, 1:Mon, ....
				first = temp.getDay();
				last = temp.getDaysInMonth();
				var td = document.createElement('td');
				td.innerHTML = new Date(temp.getYear(), temp.getMonth(), n - first).getWeek(); // Wk
				td.className = 'tb_week';
				td.style.textAlign = 'center';
				td.style.color = options.week.color;
				td.style.backgroundColor = options.background.color;
				td.style.fontStyle = 'italic';
				td.style.fontSize = options.size;
				td.style.fontFamily = options.family;
				td.style.padding = options.padding;
				row.appendChild(td);
				for (noday = 0; noday <= 8 - 1 - 3 + t; noday += 1) {
					td = document.createElement('td');
					td.style.fontSize = options.size;
					td.style.fontFamily = options.family;
					td.style.textAlign = 'center';
					td.style.padding = options.padding;
					if (n > first && (n - first) <= last) {
						td.innerHTML = n - first;
					} else {
						td.innerHTML = '';
						//td.innerHTML = n + " / " + first + " / " + last;
						//td.style.color = 'Gray';
					}
					if (today.getMonth() === temp.getMonth() && (n - first) === today.getDate() && today.getYear() === temp.getYear()) {
						td.className = 'tb_cell tb_today';
						td.style.color = options.today.color;
						td.style.backgroundColor = options.today.bg;
						//console.log("height: " + row.clientHeight);
						var radius = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
						td.style.borderRadius = radius / 2 + 'px';
					} else {
						td.className = 'tb_cell';
					}
					row.appendChild(td);
					n += 1;
				}
				temp.addMonths(1);
			}
		}
	}
})(this, document);