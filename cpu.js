console.log("hello world");
var A = 0;
var X = 0;
var Y = 0;
var P = 0;
var PC = 0x8000 - 1;
var SP = 0x1FF;




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





// Addition/Subtraction
// TODO BCD Mode?
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
// TODO
function SBC(val) {

}










// branching operations
// TODO timing when crossing page?
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









// comparisons
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








// Increment/Decrement operations
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
	writeMemory(addr, temp);
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
// incrementing doesn't involve fudging around with two's complement stuff
function INC(addr) {
	var temp = readMemory(addr);
	temp = temp + 1;
	temp &= 0xFF;
	setSignFlag(temp >> 7);
	setZeroFlag(~temp);
	writeMemory(addr, temp);
}
function INX() {
	X = X + 1;
	X &= 0xFF;
	setSignFlag(X >> 7);
	setZeroFlag(~X);
}
function INY() {
	Y = Y + 1;
	Y &= 0xFF;
	setSignFlag(Y >> 7);
	setZeroFlag(~Y);
}












// JUMPING AROUND AND STUFF
// TODO
function BRK() {
}
function JMP(val) {
	PC = val;
}
// TODO
function JSR(val) {
}
// TODO check if we should be pulling MSByte of PC first
function RTI() {
	P = pull();
	PC = (pull() << 8) | pull();
}
function RTS() {
	PC = (pull() << 8) | pull();
	PC--;
}









// BIT OPERATIONS
// some functions are four lettered; these can operate on Acc or a memory locaiton
// this is fundamentally different from most functions using memory 
// because it reads and writes and therefore needs special implementation.

function BIT(M) {
	var temp = A & M;
	setZeroFlag(~temp);
	setSignFlag(temp >> 7);
	setOverflowFlag(temp >> 6);
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

function LSRA() {
	setCarryFlag(A & 1);
	A >>>= 1;
	setSignFlag(0);
	setZeroFlag(~A);
}

function LSRM(addr) {
	var temp = readMemory(addr);
	setCarryFlag(temp & 1);
	temp >>>= 1;
	setSignFlag(0);
	setZeroFlag(~temp);
	writeMemory(addr, temp);
}

function ROLA() {
	A <<= 1;
	A |= getCarryFlag();
	setCarryFlag(A >>> 8);
	A &= 0xFF;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}

function ROLM(addr) {
	var temp = readMemory(addr);
	temp <<= 1;
	temp |= getCarryFlag();
	setCarryFlag(temp >>> 8);
	temp &= 0xFF;
	setSignFlag(temp >>> 7);
	setZeroFlag(~temp);
	writeMemory(addr,temp);
}

function RORA() {
	A |= getCarryFlag() << 8;
	setCarryFlag(A & 1);
	A >>>= 1;
	A &= =0xFF;
	setSignFlag(A >>> 7);
	setZeroFlag(~A);
}

function RORM(addr) {
	var temp = readMemory(addr);
	temp |= getCarryFlag() << 8;
	setCarryFlag(temp & 1);
	temp >>>= 1;
	temp &= =0xFF;
	setSignFlag(temp >>> 7);
	setZeroFlag(~temp);
	writeMemory(addr,temp);
}

function AND(M) {
	A &= M;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}

function EOR(val) {
	A ^= val;
	setZeroFlag(~A);
	setSignFlag(A >>> 7);
}

function ORA(val) {
	A |= val;
	A &= 0xFF;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}









function push(val) {
	SP -= 1;
	if (SP < 0x100) {
		SP = 0x1FF;
	}
	writeMemory(SP, val);
}

function pull() {
	var result = readMemory(SP);
	SP = SP + 1;
	if (SP > 0x1FF) {
		SP = 0x100;
	}
	return result;
}

// stack operations
function PHA() {
	push(A);
}

function PHP() {
	push(P);
}

function PLA() {
	A = pull();
	setSignFlag(A >>> 7);
	setZeroFlag(~A);
}

function PLP() {
	P = readMemory();
}















// Status flag instructions (set/clear)
function SEC() {
	setCarryFlag(1);
}
function SED() {
	setDecimalModeFlag(1);
}
function SEI() {
	setInterruptFlag(1);
}
function CLC() {
	setCarryFlag(0);
}
function CLD() {
	setDecimalModeFlag(0);
}
function CLI() {
	setInterruptFlag(0);
}
function CLV() {
	setOverflowFlag(0);
}




// memory operations (store / load)
function STA(addr) {
	A = readMemory(addr);
}
function STX(addr) {
	X = readMemory(addr);
}
function STY(addr) {
	Y = readMemory(addr);
}
function LDA(val) {
	A = val;
	setZeroFlag(~A);
	setSignFlag(A >> 7);
}
function LDX(val) {
	X = val;
	setZeroFlag(~X);
	setSignFlag(X >> 7);
}
function LDY(val) {
	Y = val;
	setZeroFlag(~Y);
	setSignFlag(Y >> 7);
}



// transfer operations (moving stuffz between registerz)
function TAX() {
	X = A;
	setSignFlag(X >> 7);
	setZeroFlag(~X);
}
function TAY() {
	Y = A;
	setSignFlag(Y >> 7);
	setZeroFlag(~Y);
}
function TSX() {
	X = SP;
	setSignFlag(X >> 7);
	setZeroFlag(~X);
}
function TXA() {
	A = X;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}
function TXS() {
	SP = X;
}
function TYA() {
	A = Y;
	setSignFlag(A >> 7);
	setZeroFlag(~A);
}





// self explanatory
function NOP() {
	// lol
}
