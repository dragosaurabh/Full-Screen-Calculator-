# Free Online Programmer Calculator

Convert between binary, hexadecimal, octal, and decimal. Perform bitwise operations. Essential for software developers, computer science students, and anyone working with low-level data.

## How It Works

Enter a number in any base and instantly see its representation in all four bases:

- **Binary (BIN):** Base 2, digits 0-1
- **Octal (OCT):** Base 8, digits 0-7
- **Decimal (DEC):** Base 10, digits 0-9
- **Hexadecimal (HEX):** Base 16, digits 0-9 and A-F

Select your input base, type your number, and view conversions in real time.

## Base Conversions

### Decimal to Other Bases

| Decimal | Binary | Octal | Hexadecimal |
|---------|--------|-------|-------------|
| 10 | 1010 | 12 | A |
| 255 | 11111111 | 377 | FF |
| 1000 | 1111101000 | 1750 | 3E8 |
| 65535 | 1111111111111111 | 177777 | FFFF |

### Common Hex Values

| Hex | Decimal | Use Case |
|-----|---------|----------|
| FF | 255 | Max 8-bit unsigned value |
| FFFF | 65535 | Max 16-bit unsigned value |
| 7FFFFFFF | 2147483647 | Max 32-bit signed value |
| DEADBEEF | 3735928559 | Common debug marker |

## Bitwise Operations

| Operation | Symbol | Description | Example |
|-----------|--------|-------------|---------|
| AND | & | Both bits must be 1 | 1100 & 1010 = 1000 |
| OR | \| | Either bit can be 1 | 1100 \| 1010 = 1110 |
| XOR | ^ | Bits must differ | 1100 ^ 1010 = 0110 |
| NOT | ~ | Flip all bits | ~1100 = 0011 (4-bit) |
| Left Shift | << | Shift bits left | 0011 << 2 = 1100 |
| Right Shift | >> | Shift bits right | 1100 >> 2 = 0011 |

## Real-World Examples

**Setting permission flags:**
Read (4) + Write (2) + Execute (1):
`100 | 010 | 001` = 111 (binary) = 7 (decimal)

**Checking if a bit is set:**
Is bit 3 set in the value 13?
`1101 & 1000` = 1000 (non-zero, so yes)

**Clearing a specific bit:**
Clear bit 2 in the value 15:
`1111 & ~0100` = 1011 = 11 (decimal)

**Extracting color components from RGB:**
Red from 0xFF5733:
`FF5733 >> 16` = FF = 255

**Calculating subnet masks:**
/24 network mask:
`~((1 << 8) - 1)` = FFFFFF00

## Two's Complement

The calculator supports two's complement representation for signed integers:

- **8-bit:** Range -128 to 127
- **16-bit:** Range -32768 to 32767
- **32-bit:** Range -2147483648 to 2147483647
- **64-bit:** Full range support

**Example:** -1 in 8-bit two's complement:
Binary: 11111111
Hex: FF

## Common Mistakes to Avoid

**Confusing bit positions:**
Bits are numbered from right to left, starting at 0. Bit 0 is the rightmost (least significant) bit.

**Forgetting sign extension:**
When converting negative numbers between bit widths, the sign bit extends. -1 in 8-bit (FF) becomes FFFFFFFF in 32-bit.

**Mixing up AND and OR:**
AND narrows results (fewer 1s), OR expands results (more 1s). Use AND to check bits, OR to set bits.

**Overflow in shifts:**
Shifting left by more bits than the data type holds causes overflow. `1 << 32` in 32-bit arithmetic wraps around.

## FAQ

**How do I enter a hexadecimal number?**
Select HEX mode, then type using digits 0-9 and letters A-F. Letters are case-insensitive.

**What's the maximum number I can work with?**
The calculator uses 64-bit integers, supporting values up to 2^63 - 1 for signed or 2^64 - 1 for unsigned.

**How does NOT work with different bit widths?**
NOT inverts all bits within the selected bit width. ~0 in 8-bit mode is 255 (FF), not -1.

**Can I see the binary representation of negative numbers?**
Yes. Negative numbers display in two's complement format. Select your preferred bit width (8, 16, 32, or 64 bits).

**What's the difference between >> and >>> (logical vs arithmetic shift)?**
Arithmetic shift (>>) preserves the sign bit for negative numbers. Logical shift (>>>) fills with zeros. This calculator uses arithmetic shift.
