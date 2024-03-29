# Decimal-32 floating point converter
## About The Project
### Description
The website serves as a decimal-32 floating-point converter, capable of processing decimal inputs in base-10 exponential format and converting them into binary and hexadecimal forms. The 32-bit value is partitioned into 1 bit for the sign, 5 bits for the combination field, 6 bits for the exponent continuation, and 20 bits for the coefficient continuation. Special cases such as NaN and Infinity are also detected and converted. Access the website through this [link]( https://skillial.github.io/CSARCH2-Simulation-Project/)

### Steps
1. Check if input is valid
2. Normalize the input
3. Shift input (if possible)
4. Choose rounding method
5. Get Sign Bit from input
6. Get Combinational Field from input
7. Get Exponent Continuation from input
8. Convert remaining input to Densely Packed BCD
9. Compile and Display


### Problems encountered
#### 1. Javascript's floating point representaion
    Explanation: Some of the floating point numbers were represented differently when operations were performed. For example, 0.5 minus 0.4 resulted in 0.09999999999999964.
    Fix: The input was taken as a string instead of an integer.
#### 2. Rounding with strings
    Explanation: Since the inputs are stored as strings, rounding '9' up to '10' was a challenge 
    Fix: The input was first parsed into an integer before incrementing. Afterwards, it will be parsed back into a string.
#### 3. Exponents with floating points
    Explanation: Exponents with floating points are being rounded and converted.
    Fix: The convert button is disabled when there is a radix point in the input.
#### 4. Integer representaion of javascript
    Explanation: If the input is larger than a certain number, it is not being represented properly.
    Fix: When the number is too large, 'Infinity' is shown instead of the actual value.
#### 5. Whitespaces in input produces NaN
    Explanation: Inputs with white spaces are being accepted as they are not marked as NaN by JavaScript's isNaN function.
    Fix: Self-created checker for white spaces were made.
#### 6. Representable inputs with >90 exponents
    Explanation: Some inputs are still representable even if the exponent is greater than 90. For example, 1 x 10^91 can be represented as 10 x 10^90.
    Fix: A checker was created to verify if there are '0's on the left side that can be truncated so that a '0' can be added on the right side.

## Usage
### Inputs
**Decimal:** Base-10 Number <br>
**Exponent:** Base-10 Number (No Floating Points) <br>
**Rounding mode:** Truncate/Floor/Ceiling/RTN-TE

### Outputs
**Rounded number:** 7-Digit Base-10 Number <br>
**Exponent after rounding:** Base-10 Number (w/o Bias) <br>
**Binary Form:** 32-Bit Conversion of the Input <br>
**Hexadecimal Form:** 8-Digit Hexadecimal Conversion of the Input

### Demo
The video demo may also be accessed through this [link](https://youtu.be/UjbbGdQmPh4) <br>
Access the test cases [here](test%20cases/)
## Authors

1. Cabrera, Jean
2. Cabrera, Alyanna
3. Lu, Bentley
4. Tan, Arvin
