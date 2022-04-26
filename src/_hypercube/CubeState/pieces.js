import { range, rotateArrayCW as rotate } from '../utils'

export const [
    U1, U2, U3, U4, U5, U6, U7, U8, U9,
	L1, L2, L3, L4, L5, L6, L7, L8, L9,
    F1, F2, F3, F4, F5, F6, F7, F8, F9,
	R1, R2, R3, R4, R5, R6, R7, R8, R9,
	B1, B2, B3, B4, B5, B6, B7, B8, B9,
    D1, D2, D3, D4, D5, D6, D7, D8, D9,
] = range(0, 53)

export const UR = [U6, R2], RU = rotate(UR)
export const UF = [U8, F2], FU = rotate(UF)
export const UL = [U4, L2], LU = rotate(UL)
export const UB = [U2, B2], BU = rotate(UB)
export const DR = [D6, R8], RD = rotate(DR)
export const DF = [D2, F8], FD = rotate(DF)
export const DL = [D4, L8], LD = rotate(DL)
export const DB = [D8, B8], BD = rotate(DB)
export const FR = [F6, R4], RF = rotate(FR)
export const FL = [F4, L6], LF = rotate(FL)
export const BR = [B4, R6], RB = rotate(BR)
export const BL = [B6, L4], LB = rotate(BL)

export const URF = [U9, R1, F3], FUR = rotate(URF), RFU = rotate(FUR)
export const UFL = [U7, F1, L3], LUF = rotate(UFL), FLU = rotate(LUF)
export const ULB = [U1, L1, B3], BUL = rotate(ULB), LBU = rotate(BUL)
export const UBR = [U3, B1, R3], RUB = rotate(UBR), BRU = rotate(RUB)
export const DFR = [D3, F9, R7], RDF = rotate(DFR), FRD = rotate(RDF)
export const DLF = [D1, L9, F7], FDL = rotate(DLF), LFD = rotate(FDL)
export const DBL = [D7, B9, L7], LDB = rotate(DBL), BLD = rotate(LDB)
export const DRB = [D9, R9, B7], BDR = rotate(DRB), RBD = rotate(BDR)
export const 
    UFR = URF, FRU = FUR, RUF = RFU,
    ULF = UFL, LFU = LUF, FUL = FLU,
    UBL = ULB, BLU = BUL, LUB = LBU,
    URB = UBR, RBU = RUB, BUR = BRU,
    DRF = DFR, RFD = RDF, FDR = FRD,
    DFL = DLF, FLD = FDL, LDF = LFD,
    DLB = DBL, LBD = LDB, BDL = BLD,
    DBR = DRB, BRD = BDR, RDB = RBD

export const [U, R, F, D, L, B] = [[U5], [R5], [F5], [D5], [L5], [B5]]

export const moves = {
	"R" : [[U6, B4, D6, F6], [R2, R6, R8, R4], [U9, B1, D9, F9], [R1, R3, R9, R7], [F3, U3, B7, D3]],
	"R2": [[U6, D6], [R2, R8], [B4, F6], [R6, R4], [U9, D9], [R1, R9], [F3, B7], [B1, F9], [R3, R7], [U3, D3]],
	"R'": [[F6, D6, B4, U6], [R4, R8, R6, R2], [F9, D9, B1, U9], [R7, R9, R3, R1], [D3, B7, U3, F3]],
	"U" : [[U6, U8, U4, U2], [R2, F2, L2, B2], [U9, U7, U1, U3], [R1, F1, L1, B1], [F3, L3, B3, R3]],
	"U2": [[U6, U4], [R2, L2], [U8, U2], [F2, B2], [U9, U1], [R1, L1], [F3, B3], [U7, U3], [F1, B1], [L3, R3]],
	"U'": [[U2, U4, U8, U6], [B2, L2, F2, R2], [U3, U1, U7, U9], [B1, L1, F1, R1], [R3, B3, L3, F3]],
	"F" : [[F6, F8, F4, F2], [R4, D2, L6, U8], [F3, F9, F7, F1], [U9, R7, D1, L3], [R1, D3, L9, U7]],
	"F2": [[F6, F4], [R4, L6], [F8, F2], [D2, U8], [F3, F7], [U9, D1], [R1, L9], [F9, F1], [R7, L3], [D3, U7]],
	"F'": [[F2, F4, F8, F6], [U8, L6, D2, R4], [F1, F7, F9, F3], [L3, D1, R7, U9], [U7, L9, D3, R1]],
	"L" : [[L2, L6, L8, L4], [U4, F4, D4, B6], [L3, L9, L7, L1], [U7, F7, D7, B3], [F1, D1, B9, U1]],
	"L2": [[L2, L8], [U4, D4], [L6, L4], [F4, B6], [L3, L7], [U7, D7], [F1, B9], [L9, L1], [F7, B3], [D1, U1]],
	"L'": [[L4, L8, L6, L2], [B6, D4, F4, U4], [L1, L7, L9, L3], [B3, D7, F7, U7], [U1, B9, D1, F1]],
	"D" : [[D6, D8, D4, D2], [R8, B8, L8, F8], [D3, D9, D7, D1], [F9, R9, B9, L9], [R7, B7, L7, F7]],
	"D2": [[D6, D4], [R8, L8], [D8, D2], [B8, F8], [D3, D7], [F9, B9], [R7, L7], [D9, D1], [R9, L9], [B7, F7]],
	"D'": [[D2, D4, D8, D6], [F8, L8, B8, R8], [D1, D7, D9, D3], [L9, B9, R9, F9], [F7, L7, B7, R7]],
	"B" : [[B2, B6, B8, B4], [U2, L4, D8, R6], [B1, B3, B9, B7], [R3, U1, L7, D9], [U3, L1, D7, R9]],
	"B2": [[B2, B8], [U2, D8], [B6, B4], [L4, R6], [B1, B9], [R3, L7], [U3, D7], [B3, B7], [U1, D9], [L1, R9]],
	"B'": [[B4, B8, B6, B2], [R6, D8, L4, U2], [B7, B9, B3, B1], [D9, L7, U1, R3], [R9, D7, L1, U3]],
	"M" : [[U5, F5, D5, B5], [U8, F8, D8, B2], [F2, D2, B8, U2]],
	"M2": [[U5, D5], [F5, B5], [U8, D8], [F2, B8], [F8, B2], [D2, U2]],
	"M'": [[B5, D5, F5, U5], [B2, D8, F8, U8], [U2, B8, D2, F2]],
	"E" : [[R5, B5, L5, F5], [F6, R6, B6, L6], [R4, B4, L4, F4]],
	"E2": [[R5, L5], [B5, F5], [F6, B6], [R4, L4], [R6, L6], [B4, F4]],
	"E'": [[F5, L5, B5, R5], [L6, B6, R6, F6], [F4, L4, B4, R4]],
	"S" : [[R5, D5, L5, U5], [U6, R8, D4, L2], [R2, D6, L8, U4]],
	"S2": [[R5, L5], [D5, U5], [U6, D4], [R2, L8], [R8, L2], [D6, U4]],
	"S'": [[U5, L5, D5, R5], [L2, D4, R8, U6], [U4, L8, D6, R2]],
	"r" : [[U6, B4, D6, F6], [R2, R6, R8, R4], [U9, B1, D9, F9], [R1, R3, R9, R7], [F3, U3, B7, D3], [B5, D5, F5, U5], [B2, D8, F8, U8], [U2, B8, D2, F2]],
	"r2": [[U6, D6], [R2, R8], [B4, F6], [R6, R4], [U9, D9], [R1, R9], [F3, B7], [B1, F9], [R3, R7], [U3, D3], [U5, D5], [F5, B5], [U8, D8], [F2, B8], [F8, B2], [D2, U2]],
	"r'": [[F6, D6, B4, U6], [R4, R8, R6, R2], [F9, D9, B1, U9], [R7, R9, R3, R1], [D3, B7, U3, F3], [U5, F5, D5, B5], [U8, F8, D8, B2], [F2, D2, B8, U2]],
	"u" : [[U6, U8, U4, U2], [R2, F2, L2, B2], [U9, U7, U1, U3], [R1, F1, L1, B1], [F3, L3, B3, R3], [F5, L5, B5, R5], [L6, B6, R6, F6], [F4, L4, B4, R4]],
	"u2": [[U6, U4], [R2, L2], [U8, U2], [F2, B2], [U9, U1], [R1, L1], [F3, B3], [U7, U3], [F1, B1], [L3, R3], [R5, L5], [B5, F5], [F6, B6], [R4, L4], [R6, L6], [B4, F4]],
	"u'": [[U2, U4, U8, U6], [B2, L2, F2, R2], [U3, U1, U7, U9], [B1, L1, F1, R1], [R3, B3, L3, F3], [R5, B5, L5, F5], [F6, R6, B6, L6], [R4, B4, L4, F4]],
	"f" : [[F6, F8, F4, F2], [R4, D2, L6, U8], [F3, F9, F7, F1], [U9, R7, D1, L3], [R1, D3, L9, U7], [R5, D5, L5, U5], [U6, R8, D4, L2], [R2, D6, L8, U4]],
	"f2": [[F6, F4], [R4, L6], [F8, F2], [D2, U8], [F3, F7], [U9, D1], [R1, L9], [F9, F1], [R7, L3], [D3, U7], [R5, L5], [D5, U5], [U6, D4], [R2, L8], [R8, L2], [D6, U4]],
	"f'": [[F2, F4, F8, F6], [U8, L6, D2, R4], [F1, F7, F9, F3], [L3, D1, R7, U9], [U7, L9, D3, R1], [U5, L5, D5, R5], [L2, D4, R8, U6], [U4, L8, D6, R2]],
	"l" : [[L2, L6, L8, L4], [U4, F4, D4, B6], [L3, L9, L7, L1], [U7, F7, D7, B3], [F1, D1, B9, U1], [U5, F5, D5, B5], [U8, F8, D8, B2], [F2, D2, B8, U2]],
	"l2": [[L2, L8], [U4, D4], [L6, L4], [F4, B6], [L3, L7], [U7, D7], [F1, B9], [L9, L1], [F7, B3], [D1, U1], [F5, B5], [U8, D8], [F2, B8], [F8, B2], [D2, U2]],
	"l'": [[L4, L8, L6, L2], [B6, D4, F4, U4], [L1, L7, L9, L3], [B3, D7, F7, U7], [U1, B9, D1, F1], [B5, D5, F5, U5], [B2, D8, F8, U8], [U2, B8, D2, F2]],
	"d" : [[D6, D8, D4, D2], [R8, B8, L8, F8], [D3, D9, D7, D1], [F9, R9, B9, L9], [R7, B7, L7, F7], [R5, B5, L5, F5], [F6, R6, B6, L6], [R4, B4, L4, F4]],
	"d2": [[D6, D4], [R8, L8], [D8, D2], [B8, F8], [D3, D7], [F9, B9], [R7, L7], [D9, D1], [R9, L9], [B7, F7], [R5, L5], [B5, F5], [F6, B6], [R4, L4], [R6, L6], [B4, F4]],
	"d'": [[D2, D4, D8, D6], [F8, L8, B8, R8], [D1, D7, D9, D3], [L9, B9, R9, F9], [F7, L7, B7, R7], [F5, L5, B5, R5], [L6, B6, R6, F6], [F4, L4, B4, R4]],
	"b" : [[B2, B6, B8, B4], [U2, L4, D8, R6], [B1, B3, B9, B7], [R3, U1, L7, D9], [U3, L1, D7, R9], [U5, L5, D5, R5], [L2, D4, R8, U6], [U4, L8, D6, R2]],
	"b2": [[B2, B8], [U2, D8], [B6, B4], [L4, R6], [B1, B9], [R3, L7], [U3, D7], [B3, B7], [U1, D9], [L1, R9], [R5, L5], [D5, U5], [U6, D4], [R2, L8], [R8, L2], [D6, U4]],
	"b'": [[B4, B8, B6, B2], [R6, D8, L4, U2], [B7, B9, B3, B1], [D9, L7, U1, R3], [R9, D7, L1, U3], [R5, D5, L5, U5], [U6, R8, D4, L2], [R2, D6, L8, U4]],
	"x" : [[U6, B4, D6, F6], [R2, R6, R8, R4], [U9, B1, D9, F9], [R1, R3, R9, R7], [F3, U3, B7, D3], [B5, D5, F5, U5], [B2, D8, F8, U8], [U2, B8, D2, F2], [L4, L8, L6, L2], [B6, D4, F4, U4], [L1, L7, L9, L3], [B3, D7, F7, U7], [U1, B9, D1, F1]],
	"x2": [[U6, D6], [R2, R8], [B4, F6], [R6, R4], [U9, D9], [R1, R9], [F3, B7], [B1, F9], [R3, R7], [U3, D3], [U5, D5], [F5, B5], [U8, D8], [F2, B8], [F8, B2], [D2, U2], [L2, L8], [U4, D4], [L6, L4], [F4, B6], [L3, L7], [U7, D7], [F1, B9], [L9, L1], [F7, B3], [D1, U1]],
	"x'": [[F6, D6, B4, U6], [R4, R8, R6, R2], [F9, D9, B1, U9], [R7, R9, R3, R1], [D3, B7, U3, F3], [U5, F5, D5, B5], [U8, F8, D8, B2], [F2, D2, B8, U2], [L2, L6, L8, L4], [U4, F4, D4, B6], [L3, L9, L7, L1], [U7, F7, D7, B3], [F1, D1, B9, U1]],
	"y" : [[U6, U8, U4, U2], [R2, F2, L2, B2], [U9, U7, U1, U3], [R1, F1, L1, B1], [F3, L3, B3, R3], [F5, L5, B5, R5], [L6, B6, R6, F6], [F4, L4, B4, R4], [D2, D4, D8, D6], [F8, L8, B8, R8], [D1, D7, D9, D3], [L9, B9, R9, F9], [F7, L7, B7, R7]],
	"y2": [[U6, U4], [R2, L2], [U8, U2], [F2, B2], [U9, U1], [R1, L1], [F3, B3], [U7, U3], [F1, B1], [L3, R3], [R5, L5], [B5, F5], [F6, B6], [R4, L4], [R6, L6], [B4, F4], [D6, D4], [R8, L8], [D8, D2], [B8, F8], [D3, D7], [F9, B9], [R7, L7], [D9, D1], [R9, L9], [B7, F7]],
	"y'": [[U2, U4, U8, U6], [B2, L2, F2, R2], [U3, U1, U7, U9], [B1, L1, F1, R1], [R3, B3, L3, F3], [R5, B5, L5, F5], [F6, R6, B6, L6], [R4, B4, L4, F4], [D6, D8, D4, D2], [R8, B8, L8, F8], [D3, D9, D7, D1], [F9, R9, B9, L9], [R7, B7, L7, F7]],
	"z" : [[F6, F8, F4, F2], [R4, D2, L6, U8], [F3, F9, F7, F1], [U9, R7, D1, L3], [R1, D3, L9, U7], [R5, D5, L5, U5], [U6, R8, D4, L2], [R2, D6, L8, U4], [B4, B8, B6, B2], [R6, D8, L4, U2], [B7, B9, B3, B1], [D9, L7, U1, R3], [R9, D7, L1, U3]],
	"z2": [[F6, F4], [R4, L6], [F8, F2], [D2, U8], [F3, F7], [U9, D1], [R1, L9], [F9, F1], [R7, L3], [D3, U7], [R5, L5], [D5, U5], [U6, D4], [R2, L8], [R8, L2], [D6, U4], [B2, B8], [U2, D8], [B6, B4], [L4, R6], [B1, B9], [R3, L7], [U3, D7], [B3, B7], [U1, D9], [L1, R9]],
	"z'": [[F2, F4, F8, F6], [U8, L6, D2, R4], [F1, F7, F9, F3], [L3, D1, R7, U9], [U7, L9, D3, R1], [U5, L5, D5, R5], [L2, D4, R8, U6], [U4, L8, D6, R2], [B2, B6, B8, B4], [U2, L4, D8, R6], [B1, B3, B9, B7], [R3, U1, L7, D9], [U3, L1, D7, R9]],
}
