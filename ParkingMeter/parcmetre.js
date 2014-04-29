/*****************************************
 *                                       *
 * PARKING METER KATA BY RAPHAEL MARQUES *
 *              28/04/2014               *
 *                                       *
 *****************************************/

// RULES
// From 9h to 19h	-- DONE
// 1€ = 20 minutes	-- DONE
// 2€ = 60 minutes	-- DONE
// 3€ = 120 minutes	-- DONE
// 5€ = 300 minutes	-- DONE
// 8€ = 600 minutes	-- DONE
// Free days and sundays are free	-- DONE
// Holidays and July / August too	-- DONE
// Valid coins are: 0.05cts / 0.10cts / 0.20cts / 0.50cts / 1€ / 2€	-- DONE
// Wrong inserted coins are returned	-- DONE
// Give money back when it's free 	-- DONE
// Give a ticket when completing order

'use strict';

var ParkingMeter = function() {
	this.receivedCoins = [];

	this.holidays = [
		{start: Date.parse('October  19, 2013'), end: Date.parse('November  3, 2013')},
		{start: Date.parse('December 21, 2013'), end: Date.parse('January   5, 2014')},
		{start: Date.parse('February 15, 2014'), end: Date.parse('March     2, 2014')},
		{start: Date.parse('April 	 12, 2014'), end: Date.parse('April    27, 2014')},
		{start: Date.parse('July 	  5, 2014'), end: Date.parse('September 2, 2014')}
	];

	this.freeDays = [
		Date.parse('January   1, 2014 00:00:00'),
		Date.parse('April  	 21, 2014 00:00:00'),
		Date.parse('May  	  1, 2014 00:00:00'),
		Date.parse('May  	  8, 2014 00:00:00'),
		Date.parse('May  	 29, 2014 00:00:00'),
		Date.parse('June      9, 2014 00:00:00'),
		Date.parse('July     14, 2014 00:00:00'),
		Date.parse('August   15, 2014 00:00:00'),
		Date.parse('November  1, 2014 00:00:00'),
		Date.parse('November 11, 2014 00:00:00'),
		Date.parse('December 25, 2014 00:00:00')
	];

	this.daysOfWeek = {
		SUNDAY 		: 0,
		MONDAY		: 1,
		TUESDAY		: 2,
		WEDNESDAY	: 3,
		THURSDAY 	: 4,
		FRIDAY 		: 5,
		SATURDAY 	: 6,
	};
	
	this.moneyTime = {
		'1' : 20,
		'2' : 60,
		'3' : 120,
		'5' : 300,
		'8' : 600
	};

	this.validCoins = {
		'0.01' : false,
		'0.02' : false,
		'0.05' : true,
		 '0.1' : true,
		 '0.2' : true,
		 '0.5' : true,
		   '1' : true,
		   '2' : true,
	};
};

ParkingMeter.prototype.convertMoneyToTime = function(money, date) {
	if(this.isSunday(date) || this.isHolidays(date) || this.isFreeDay(date) || !this.isBillingHours(date)) {
		this.returnCoins();
		return 0;
	} else {
		return this.moneyTime[money];
	}
};

ParkingMeter.prototype.isSunday = function(date) {
	return date && date.getDay() === this.daysOfWeek.SUNDAY;
};

ParkingMeter.prototype.isHolidays = function(date) {
	var self = this;
	return date && (function() {
		for(var i in self.holidays) {
			if(date.getTime() >= self.holidays[i].start && date.getTime() <= self.holidays[i].end) {
				return true;
			}
		}

		return false;
	})();
};

ParkingMeter.prototype.isFreeDay = function(date) {
	if(date) {
		var localDate = new Date(date.getTime());
		localDate.setHours(0);
		localDate.setMinutes(0);
		localDate.setSeconds(0);

		for(var i in this.freeDays) {
			if(localDate.getTime() === this.freeDays[i]) {
				return true;
			}
		}
	}

	return false;
};

ParkingMeter.prototype.isBillingHours = function(date) {
	return date && date.getHours() >= 9 && date.getHours() < 19;
};

ParkingMeter.prototype.receiveCoin = function(coin) {
	if(this.validCoins[coin]) {
		this.receivedCoins.push(coin);
		return true;
	}

	this.returnCoins(1);

	return false;
};

ParkingMeter.prototype.getAmount = function() {
	var amount = 0;
	for(var i in this.receivedCoins) {
		amount += this.receivedCoins[i];
	}

	return amount;
};

ParkingMeter.prototype.returnCoins = function(numberOfCoins) {
	if(!numberOfCoins) {
		numberOfCoins = this.receivedCoins.length;
	}

	while(numberOfCoins--) {
		this.receivedCoins = this.receivedCoins.slice(0, this.receivedCoins.length - 1);
		// Simulate the return of the coin to the user.
	}
};

ParkingMeter.prototype.validAmount = function(amount) {
	return this.moneyTime[amount] !== undefined;
};

ParkingMeter.prototype.getTicket = function(date) {
	var amount = this.getAmount();

	if(this.validAmount(amount)) {
		var time = this.convertMoneyToTime(amount, date ? date : new Date());
		
		if(time > 0) {
			return {price: amount + '€', validity: time + ' minutes'};
		}
	}

	return 'Please reach a valid amount.';
};

/* ------------------------------------------------- */

// BEFORE

var parkingMeter = new ParkingMeter();
var testDate = new Date();
	testDate.setHours(15);

/* ------------------------------------------------- */

module('Conversion');

function test1eIs20Minutes() {
	deepEqual(parkingMeter.convertMoneyToTime(1, testDate), 20);
}

function test2eIs60Minutes() {
	deepEqual(parkingMeter.convertMoneyToTime(2, testDate), 60);
}

function test3eIs120Minutes() {
	deepEqual(parkingMeter.convertMoneyToTime(3, testDate), 120);
}

function test5eIs300Minutes() {
	deepEqual(parkingMeter.convertMoneyToTime(5, testDate), 300);
}

function test8eIs600Minutes() {
	deepEqual(parkingMeter.convertMoneyToTime(8, testDate), 600);
}

test('1€ to 20 minutes', test1eIs20Minutes);
test('2€ to 60 minutes', test2eIs60Minutes);
test('3€ to 120 minutes', test3eIs120Minutes);
test('5€ to 300 minutes', test5eIs300Minutes);
test('8€ to 600 minutes', test8eIs600Minutes);

/* ------------------------------------------------- */

module('Free days');

function testHolidays() {
	ok(parkingMeter.isHolidays(new Date(Date.parse('December  25, 2013'))));
	ok(!parkingMeter.isHolidays(new Date(Date.parse('September 5, 2014'))));
}

function sundayIsFree() {
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('March 30, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(2, new Date(Date.parse('April  6, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(3, new Date(Date.parse('April 13, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(5, new Date(Date.parse('April 20, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(8, new Date(Date.parse('April 27, 2014'))), 0);
}

function holidaysAreFree() {
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('October  20, 2013'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(2, new Date(Date.parse('December 25, 2013'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(3, new Date(Date.parse('February 20, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(5, new Date(Date.parse('April    27, 2014'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(8, new Date(Date.parse('August   10, 2014'))), 0);
}

function freeDaysAreFree() {
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('January   1, 2014 00:00:00'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(8, new Date(Date.parse('December 25, 2014 00:00:00'))), 0);
}

test('Holidays are valid', testHolidays);
test('Sunday is free', sundayIsFree);
test('Holidays are free', holidaysAreFree);
test('Free days are free', freeDaysAreFree);

/* ------------------------------------------------- */

module('Hours');

function testHours() {
	ok(parkingMeter.isBillingHours(new Date(Date.parse('January  6, 1992 09:00:00'))));
	ok(parkingMeter.isBillingHours(new Date(Date.parse('January  6, 1992 11:12:13'))));
	ok(parkingMeter.isBillingHours(new Date(Date.parse('January  6, 1992 18:59:59'))));
	ok(!parkingMeter.isBillingHours(new Date(Date.parse('January 6, 1992 00:00:00'))));
}

function billBetween9hAnd19h() {
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('April 29, 2014 09:00:00'))), 20);
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('April 29, 2014 14:00:00'))), 20);
	deepEqual(parkingMeter.convertMoneyToTime(3, new Date(Date.parse('April 29, 2014 18:59:59'))), 120);
}

function freeOtherwise() {
	deepEqual(parkingMeter.convertMoneyToTime(1, new Date(Date.parse('April 29, 2014 00:00:00'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(3, new Date(Date.parse('April 29, 2014 08:59:59'))), 0);
	deepEqual(parkingMeter.convertMoneyToTime(8, new Date(Date.parse('April 29, 2014 19:00:00'))), 0);
}

test('Hours are valid', testHours);
test('Billing between 9h and 19h', billBetween9hAnd19h);
test('Free otherwise', freeOtherwise);

/* ------------------------------------------------- */

module('Money count');

function canRememberAmountOfMoney() {
	var validCoins = [0.05, 0.1, 0.2, 0.5, 1, 2],
		amount = 0;

	for(var i = 0; i < 10; ++i) {
		var coin = validCoins[Math.floor(Math.random() * validCoins.length)];
		amount += coin;
		parkingMeter.receiveCoin(coin);
	}

	deepEqual(parkingMeter.getAmount(), amount);
}

test('Remembering amount', canRememberAmountOfMoney);

/* ------------------------------------------------- */

module('Coins');

function canPut5ctsInTheParkingMeter() {
	ok(parkingMeter.receiveCoin(0.05));
}

function cannotPut1ctsInTheParkingMeter() {
	ok(!parkingMeter.receiveCoin(0.01));
}

function canPut50ctsInTheParkingMeter() {
	ok(parkingMeter.receiveCoin(0.5));
}

test('Can receive 5cts', canPut5ctsInTheParkingMeter);
test('Cannot receive 1cts', cannotPut1ctsInTheParkingMeter);
test('Can receive 50cts', canPut50ctsInTheParkingMeter);

/* ------------------------------------------------- */

module('Ticket');

function canGetATicketFor1e() {
	var pm = new ParkingMeter();
	pm.receiveCoin(1);
	deepEqual(pm.getTicket(new Date(Date.parse('April 29, 2014 15:00:00'))), {price: '1€', validity: '20 minutes'});
}

function canGetATicketFor2e() {
	var pm = new ParkingMeter();
	pm.receiveCoin(2);
	deepEqual(pm.getTicket(new Date(Date.parse('April 29, 2014 15:00:00'))), {price: '2€', validity: '60 minutes'});
}

function canGetATicketFor3e() {
	var pm = new ParkingMeter();
	pm.receiveCoin(2);
	pm.receiveCoin(1);
	deepEqual(pm.getTicket(new Date(Date.parse('April 29, 2014 15:00:00'))), {price: '3€', validity: '120 minutes'});
}

function canGetATicketFor5e() {
	var pm = new ParkingMeter();
	pm.receiveCoin(0.5);
	pm.receiveCoin(0.2);
	pm.receiveCoin(0.2);
	pm.receiveCoin(0.1);
	pm.receiveCoin(2);
	pm.receiveCoin(2);
	deepEqual(pm.getTicket(new Date(Date.parse('April 29, 2014 15:00:00'))), {price: '5€', validity: '300 minutes'});
}

function canGetATicketFor8e() {
	var pm = new ParkingMeter();
	pm.receiveCoin(0.5);
	pm.receiveCoin(0.2);
	pm.receiveCoin(0.2);
	pm.receiveCoin(1);
	pm.receiveCoin(0.1);
	pm.receiveCoin(2);
	pm.receiveCoin(1);
	pm.receiveCoin(2);
	pm.receiveCoin(1);
	deepEqual(pm.getTicket(new Date(Date.parse('April 29, 2014 15:00:00'))), {price: '8€', validity: '600 minutes'});
}

test('Get ticket for 1€', canGetATicketFor1e);
test('Get ticket for 2€', canGetATicketFor2e);
test('Get ticket for 3€', canGetATicketFor3e);
test('Get ticket for 5€', canGetATicketFor5e);
test('Get ticket for 8€', canGetATicketFor8e);