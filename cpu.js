console.log("hello world");
var A = 0;
var X = 0;
var Y = 0;
var P = 0;
var PC = 0x600;
var SP = 0xff;




/*
*
* STATUS REGISTER GETTER METHODS
*
*/

function getCarryFlag() {
	return (P >> 0) & 1;
}

function getZeroFlag() {
	return (p >> 1) & 1;
}

function getInterruptFlag() {
	return (P >> 2) & 1;
}

// the NES does not support decimal mode but the 6502 does
function getDecimalModeFlag() {
	return (P >> 3) & 1;
}

function getBRKFlag() {
	return (P >> 4) & 1;
}

// bit 5 of status register (P) is not used and always set to 1

function getOverflowFlag() {
	return (P >> 6) & 1;
}

function getSignFlag() {
	return (P >> 7) & 1;
}






/*
*
* STATUS REGISTER SETTER METHODS
*
*/
function setCarryFlag(bit) {
	if (bit) {
		P |= 1 << 0;
	} else {
		P |= 0 << 0;
	}
}

function setZeroFlag(bit) {
	if (bit) {
		P |= 1 << 1;
	} else {
		P |= 0 << 1;
	}
}

function setInterruptFlag(bit) {
	if (bit) {
		P |= 1 << 2;
	} else {
		P |= 0 << 2;
	}
}

// the NES does not support decimal mode but the 6502 does

function setDecimalModeFlag(bit) {
	if (bit) {
		P |= 1 << 3;
	} else {
		P |= 0 << 3;
	}
}

function setBRKFlag(bit) {
	if (bit) {
		P |= 1 << 4;
	} else {
		P |= 0 << 4;
	}
}

// bit 5 of status register (P) is not used and always set to 1

function setOverflowFlag(bit) {
	if (bit) {
		P |= 1 << 6;
	} else {
		P |= 0 << 6;
	}
}

function setSignFlag(bit) {
	if (bit) {
		P |= 1 << 7;
	} else {
		P |= 0 << 7;
	}
}





function executeCycle() {
	var opcode = program[PC];
}
function processOpcode(opcode) {
	switch (opcode) {
		case 0x69:

	}
}

// why is addition so complicated Q_Q
function ADC(M) {
	var sameSign = ~((A >>> 7) ^ (M >>> 7));
	A += M;
	A += getCarryFlag();
	setCarryFlag(A >>> 8);
	A &= 0xFF;
	if (sameSign && (M >>> 7) ^ (A >>> 7)) {
		setOverflowFlag(1);
	}
	setSignFlag(A >>> 7);
	setZeroFlag(~A);
}
function AND(M) {
	A &= M;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}

function ASLA() {
	A <<= 1;
	setCarryFlag(A >> 8);
	A &= 0xFF;
	setZeroFlag(~A);
	setSignFlag(A >> 7);
}
function ASLM(addr) {
	var temp = readMemory(addr);
	temp <<= 1;
	setCarryFlag(temp >> 8);
	temp &= 0xFF;
	setZeroFlag(~temp);
	setSignFlag(temp >> 7);
	writeMemory(addr, temp);
}

function BIT(M) {
	var temp = A & M;
	setZeroFlag(~temp);
	setSignFlag(temp >> 7);
	setOverflowFlag(temp >> 6);
}

function branch(val) {
	if (val >> 7) {
		PC -= (~val + 1) & 0xFF;
	} else {
		PC += val;
	}
}



function BCS(val) {
	if (getCarryFlag()) {
		branch(val);
	}
}
function BCC(val) {
	if (!getCarryFlag()) {
		branch(val);
	}
}
function BEQ(val) {
	if (getZeroFlag()) {
		branch(val);
	}
}
function BNE(val) {
	if (!getZeroFlag()) {
		branch(val);
	}
}
function BMI(val) {
	if (getSignFlag()) {
		branch(val);
	}
}
function BPL(val) {
	if (!getSignFlag()) {
		branch(val);
	}
}
function BVS(val) {
	if (getOverflowFlag()) {
		branch(val);
	}
}
function BVC(val) {
	if (!getOverflowFlag()) {
		branch(val);
	}
}

function CMP(val) {
	setCarryFlag(A >= val);
	setZeroFlag(A == val);
	setSignFlag((A - val) < 0);
}

function CPX(val) {
	setCarryFlag(X >= val);
	setZeroFlag(X == val);
	setSignFlag((X - val) < 0);
}

function CPY(val) {
	setCarryFlag(Y >= val);
	setZeroFlag(Y == val);
	setSignFlag((Y - val) < 0);
}

function DEC(addr) {
	var temp = readMemory(addr);
	temp = temp - 1;
	setSignFlag(temp < 0);
	setZeroFlag(temp == 0);

	// need to do this hack to deal with 8 bit vs 32 bit numbers
	if (temp < 0) {
		temp &= 0x7F;
		temp |= 1 << 7;
	}
	writeMemory(addr);
}

function DEX(val) {
	X = X - 1;
	setSignFlag(X < 0);
	setZeroFlag(X == 0);

	// need to do this hack to deal with 8 bit vs 32 bit numbers
	if (X < 0) {
		X &= 0x7F;
		X |= 1 << 7;
	}
}

function DEY(val) {
	Y = Y - 1;
	setSignFlag(Y < 0);
	setZeroFlag(Y == 0);

	// need to do this hack to deal with 8 bit vs 32 bit numbers
	if (Y < 0) {
		Y &= 0x7F;
		Y |= 1 << 7;
	}
}

function EOR(val) {
	A ^= val;
	setZeroFlag(~A);
	setSignFlag(A >>> 7);
}



