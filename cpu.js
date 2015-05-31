console.log("hello world");

// The 6502's registers
var A = 0;
var X = 0;
var Y = 0;
var P = 0;
var PC = 0x8000 - 1;
var SP = 0xFF;

var mem = new Uint8ClampedArray(0x10000);


/*
*                    # #     # #     # ######     #######    #    ######  #       #######  #####  
*                    # #     # ##   ## #     #       #      # #   #     # #       #       #     # 
*                    # #     # # # # # #     #       #     #   #  #     # #       #       #       
*                    # #     # #  #  # ######        #    #     # ######  #       #####    #####  
*              #     # #     # #     # #             #    ####### #     # #       #             # 
*              #     # #     # #     # #             #    #     # #     # #       #       #     # 
*               #####   #####  #     # #             #    #     # ######  ####### #######  ##### 
*/




// TODO: fix four-letter functions (I copy pasta this from a 6502 reference page lel);
var operations = [
/*          00,     01,     02,     03,     04,     05,     06,     07,     08,     09,     0A,     0B,     0C,     0D,     0E,     0F,    LSB*/
/* 0 */    BRK,    ORA,    NOP,    NOP,    NOP,    ORA,   ASLM,    NOP,    PHP,    ORA,   ASLA,    NOP,    NOP,    ORA,   ASLM,    NOP,   
/* 1 */    BPL,    ORA,    NOP,    NOP,    NOP,    ORA,   ASLM,    NOP,    CLC,    ORA,    NOP,    NOP,    NOP,    ORA,   ASLM,    NOP,   
/* 2 */    JSR,    AND,    NOP,    NOP,    BIT,    AND,   ROLM,    NOP,    PLP,    AND,   ROLA,    NOP,    BIT,    AND,   ROLM,    NOP,   
/* 3 */    BMI,    AND,    NOP,    NOP,    NOP,    AND,   ROLM,    NOP,    SEC,    AND,    NOP,    NOP,    NOP,    AND,   ROLM,    NOP,   
/* 4 */    RTI,    EOR,    NOP,    NOP,    NOP,    EOR,   LSRM,    NOP,    PHA,    EOR,   LSRA,    NOP,    JMP,    EOR,   LSRM,    NOP,   
/* 5 */    BVC,    EOR,    NOP,    NOP,    NOP,    EOR,   LSRM,    NOP,    CLI,    EOR,    NOP,    NOP,    NOP,    EOR,   LSRM,    NOP,   
/* 6 */    RTS,    ADC,    NOP,    NOP,    NOP,    ADC,   RORM,    NOP,    PLA,    ADC,   RORA,    NOP,    JMP,    ADC,   RORM,    NOP,   
/* 7 */    BVS,    ADC,    NOP,    NOP,    NOP,    ADC,   RORM,    NOP,    SEI,    ADC,    NOP,    NOP,    NOP,    ADC,   RORM,    NOP,   
/* 8 */    NOP,    STA,    NOP,    NOP,    STY,    STA,    STX,    NOP,    DEY,    NOP,    TXA,    NOP,    STY,    STA,    STX,    NOP,   
/* 9 */    BCC,    STA,    NOP,    NOP,    STY,    STA,    STX,    NOP,    TYA,    STA,    TXS,    NOP,    NOP,    STA,    NOP,    NOP,   
/* A */    LDY,    LDA,    LDX,    NOP,    LDY,    LDA,    LDX,    NOP,    TAY,    LDA,    TAX,    NOP,    LDY,    LDA,    LDX,    NOP,   
/* B */    BCS,    LDA,    NOP,    NOP,    LDY,    LDA,    LDX,    NOP,    CLV,    LDA,    TSX,    NOP,    LDY,    LDA,    LDX,    NOP,   
/* C */    CPY,    CMP,    NOP,    NOP,    CPY,    CMP,    DEC,    NOP,    INY,    CMP,    DEX,    NOP,    CPY,    CMP,    DEC,    NOP,   
/* D */    BNE,    CMP,    NOP,    NOP,    NOP,    CMP,    DEC,    NOP,    CLD,    CMP,    NOP,    NOP,    NOP,    CMP,    DEC,    NOP,   
/* E */    CPX,    SBC,    NOP,    NOP,    CPX,    SBC,    INC,    NOP,    INX,    SBC,    NOP,    NOP,    CPX,    SBC,    INC,    NOP,   
/* F */    BEQ,    SBC,    NOP,    NOP,    NOP,    SBC,    INC,    NOP,    SED,    SBC,    NOP,    NOP,    NOP,    SBC,    INC,    NOP];
/*MSB*/



// TODO map these to actual functions (also a copy pasta from internet lolz);
// TODO should I make em all functions?
var addressing = [
/*                    00,              01,              02,              03,              04,              05,              06,              07,              08,              09,             0A,               0B,              0C,              0D,              0E,              0F,             LSB*/
/* 00*/           "impl", indexedIndirect,              "",              "",              "",        zeroPage,        zeroPage,              "",          "impl",       immediate,             "A",              "",              "",        absolute,        absolute,              "",          
/* 10*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,              "",          
/* 20*/         absolute, indexedIndirect,              "",              "",        zeroPage,        zeroPage,        zeroPage,              "",          "impl",       immediate,             "A",              "",        absolute,        absolute,        absolute,              "",          
/* 30*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,              "",          
/* 40*/           "impl", indexedIndirect,              "",              "",              "",        zeroPage,        zeroPage,              "",          "impl",       immediate,             "A",              "",        absolute,        absolute,        absolute,              "",          
/* 50*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,              "",          
/* 60*/           "impl", indexedIndirect,              "",              "",              "",        zeroPage,        zeroPage,              "",          "impl",       immediate,             "A",              "",        indirect,        absolute,        absolute,              "",          
/* 70*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,              "",          
/* 80*/               "", indexedIndirect,              "",              "",        zeroPage,        zeroPage,        zeroPage,              "",          "impl",              "",          "impl",              "",        absolute,        absolute,        absolute,              "",          
/* 90*/         relative, indirectIndexed,              "",              "",       zeroPageX,       zeroPageX,       zeroPageY,              "",          "impl",       absoluteY,          "impl",              "",              "",       absoluteX,              "",              "",          
/* A0*/        immediate, indexedIndirect,       immediate,              "",        zeroPage,        zeroPage,        zeroPage,              "",          "impl",       immediate,          "impl",              "",        absolute,        absolute,        absolute,              "",          
/* B0*/         relative, indirectIndexed,              "",              "",       zeroPageX,       zeroPageX,       zeroPageY,              "",          "impl",       absoluteY,          "impl",              "",       absoluteX,       absoluteX,       absoluteY,              "",          
/* C0*/        immediate, indexedIndirect,              "",              "",        zeroPage,        zeroPage,        zeroPage,              "",          "impl",       immediate,          "impl",              "",        absolute,        absolute,        absolute,              "",          
/* D0*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,              "",          
/* E0*/        immediate, indexedIndirect,              "",              "",        zeroPage,        zeroPage,        zeroPage,              "",          "impl",       immediate,          "impl",              "",        absolute,        absolute,        absolute,              "",          
/* F0*/         relative, indirectIndexed,              "",              "",              "",       zeroPageX,       zeroPageX,              "",          "impl",       absoluteY,              "",              "",              "",       absoluteX,       absoluteX,                ];
/*MSB*/






// testing stuff
// 
// 
function loadProgram(prgm) {
    var prgmArr = prgm.split(" ");
    var prgmLoc = 0x8000;
    for (var i = 0; i < prgmArr.length; i++) {
        writeMemory(prgmLoc + i, parseInt("0x".concat(prgmArr[i])))
    }
}
function dumpPage(pageNum) {
    var str = "";
    for (var line = pageNum << 8; line < (pageNum + 1) << 8; line += 16) {
        str += "0x" + line.toString(16);
        for (var lsb = 0x0000; lsb < 0x0010; lsb++) {
            str += " ";
            str += readMemory(line | lsb).toString();
        }
        str += "<br>";
    }
    document.write(str);
}
loadProgram("a9 01 8d 00 02 a9 05 8d 01 02 a9 09 8d 02 02");
for (var i = 0; i < 10; i++) {
    executeCycle();
}
dumpPage(2);
console.log(readMemory(0x202));



























// TODO
// 
var nmiAddr = 0xFFFA;
var irqAddr = 0xFFFE;

//TODO implement the functions I called and make sure this is how interrupts ACTUALLY work
function executeCycle() {
    // if (nmiOccured()) {
    //     clearNonMaskableInteruptFlop();
    //     NMI();
    // } else if (canIrq() && irqOccured()) {
    //     IRQ();
    // } else {
        // TODO: don't use ++ it's horrible
        executeOpcode(readPC());
    // }
}
function executeOpcode(opcode) {
    var addressingMode = addressing[opcode];
    var operation = operations[opcode];
    if (addressingMode === "impl" || addressingMode === "A") {
        operation();
    } else {
        operation(addressingMode());
    }
}








// TODO actully use this...
function readPC() {
    PC++;
    return readMemory(PC);
}



function immediate() {
    return readPC();
}
function zeroPage() {
    return readMemory(readPC());
}
function zeroPageX() {
    return readMemory((readPC() + X) & 0xFF);
}
function zeroPageY() {
    return readMemory((readPC() + Y) & 0xFF);
}

// TODO is this right?
function relative() {
    return readPC();
}
// TODO: CHECK ENDIANNESS
function absolute() {
    var temp = readMemory(readPC() | readPC() << 8);
    return temp;
}
function absoluteX() {
    return readMemory(((readPC() | readPC() << 8) + X) & 0xFFFF);
}
function absoluteY() {
    return readMemory(((readPC() | readPC() << 8) + Y) & 0xFFFF);
}
function indirect() {
    var addr = readPC() << 8 | readPC();
    return readMemory(addr) | readMemory((addr + 1) & 0xFFFF) << 8;
}

// TODO
function indexedIndirect() {
    var LSB = (readPC() + X) & 0xFF;
    var MSB = (LSB + 1) & 0xFF;
    return readMemory(MSB) << 8 | readMemory(LSB);
}
function indirectIndexed() {
    var LSB = readPC() & 0xFF;
    var MSB = (LSB + 1) & 0xFF;
    return ((readMemory(MSB) << 8 | readMemory(LSB)) + Y) & 0xFFFF;
}












// current implementation: convert mirrored addresses to original locations
function mirror(addr) {
    if (addr < 0x2000) {
        return addr % 0x800;
    } else if (addr < 0x4000) {
        return (addr % 8) + 2000;
    } else {
        return addr;
    }
}
function readMemory(addr) {
    return mem[mirror(addr)];
}
function writeMemory(addr,  val) {
    mem[mirror(addr)] = val;
}



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






// converting two's complement numbers
// TODO check if these work
function to32(val) {
    return ((val << 24) & 0x80000000) | (val & 0x7F);
}
function to8(val) {
    return ((val >>> 24) & 0x80) | (val & 0x7F);
}


// Addition/Subtraction
// TODO BCD Mode?
// TODO simplify this...
// why is addition so complicated Q_Q
function ADC(val) {
    var sameSign = ~((A >>> 7) ^ (val >>> 7));
    A += val;
    A += getCarryFlag();
    setCarryFlag(A >>> 8);
    A &= 0xFF;
    if (sameSign && (val >>> 7) ^ (val >>> 7)) {
        setOverflowFlag(1);
    }
    setSignFlag(A >>> 7);
    setZeroFlag(~A);
}
// TODO
function SBC(val) {
    A = to32(A);
    val = to32(val);
    A = A - val - (1 - getCarryFlag());
    setOverflowFlag(A > 127 || A < -128);
    setCarryFlag(A & 0x100);
    A = to8(A);
    setZeroFlag(~A);
    setSignFlag(A >>> 7);
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
    writeMemory(addr,  temp);
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
    writeMemory(addr,  temp);
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
    push((PC >>> 8) & 0xFF);
    push(PC & 0xFF);
    push(P);
    // TODO & 0xFF00 0x00FF these?
    PC = readMemory(0xFFFE) << 8 | readMemory(0xFFFF);
    setBRKFlag(1);
}
function JMP(val) {
    PC = val;
}
// TODO
function JSR(val) {
    push(PC >>> 8 & 0xFF);
    push(PC & 0xFF);
    PC = val;
}
// TODO check if we should be pulling MSByte of PC first
// TODO PEMDAS
function RTI() {
    P = pull();
    PC = pull() | pull() << 8;
}
function RTS() {
    PC = pull() | pull() << 8;
    PC++;
}

// TODO remove for speed? included for readability but...
function IRQ() {
    BRK();
}
function NMI() {
    push((PC >>> 8) & 0xFF);
    push(PC & 0xFF);
    push(P);
    // TODO & 0xFF00 0x00FF these?
    PC = readMemory(0xFFFA) << 8 | readMemory(0xFFFB);
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
    writeMemory(addr,  temp);
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
    writeMemory(addr,  temp);
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
    writeMemory(addr, temp);
}

function RORA() {
    A |= getCarryFlag() << 8;
    setCarryFlag(A & 1);
    A >>>= 1;
    A &= 0xFF;
    setSignFlag(A >>> 7);
    setZeroFlag(~A);
}

function RORM(addr) {
    var temp = readMemory(addr);
    temp |= getCarryFlag() << 8;
    setCarryFlag(temp & 1);
    temp >>>= 1;
    temp &= 0xFF;
    setSignFlag(temp >>> 7);
    setZeroFlag(~temp);
    writeMemory(addr, temp);
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
    writeMemory(SP,  val);
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
    writeMemory(addr, A);
}
function STX(addr) {
    writeMemory(addr, X);
}
function STY(addr) {
    writeMemory(addr, Y);
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
