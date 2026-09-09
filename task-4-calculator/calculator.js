(() => {
    const display = document.querySelector('.calculator__display');
    const keypad = document.querySelector('.keypad');

    if (!display || !keypad) return;

    const OPERATOR_SYMBOLS = { '+': '+', '-': '−', '*': 'x', '/': '/' };

    let currentValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    const formatNumber = (value) => {
        const [integerPart, decimalPart] = value.split('.');
        const formattedInteger = Number(integerPart).toLocaleString('en-US');
        return decimalPart === undefined ? formattedInteger : `${formattedInteger}.${decimalPart}`;
    };

    const updateDisplay = () => {
        if (operator === null) {
            display.textContent = formatNumber(currentValue);
            return;
        }

        const equation = `${formatNumber(String(firstOperand))} ${OPERATOR_SYMBOLS[operator]}`;
        display.textContent = waitingForSecondOperand ? equation : `${equation} ${formatNumber(currentValue)}`;
    };

    const inputDigit = (digit) => {
        if (waitingForSecondOperand) {
            currentValue = digit;
            waitingForSecondOperand = false;
        } else {
            currentValue = currentValue === '0' ? digit : currentValue + digit;
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            currentValue = '0.';
            waitingForSecondOperand = false;
            return;
        }
        if (!currentValue.includes('.')) {
            currentValue += '.';
        }
    };

    const clearAll = () => {
        currentValue = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    };

    const deleteLast = () => {
        currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
    };

    const compute = (first, second, op) => {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return second === 0 ? 0 : first / second;
            default: return second;
        }
    };

    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(currentValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = compute(firstOperand, inputValue, operator);
            currentValue = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    };

    const handleEquals = () => {
        if (operator === null || waitingForSecondOperand) return;
        const inputValue = parseFloat(currentValue);
        currentValue = String(compute(firstOperand, inputValue, operator));
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    };

    keypad.addEventListener('click', (event) => {
        const button = event.target.closest('button.key');
        if (!button) return;

        const { action, operator: op } = button.dataset;

        switch (action) {
            case 'number':
                inputDigit(button.textContent.trim());
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'operator':
                handleOperator(op);
                break;
            case 'equals':
                handleEquals();
                break;
            case 'delete':
                deleteLast();
                break;
            case 'clear':
                clearAll();
                break;
            default:
                return;
        }

        updateDisplay();
    });

    updateDisplay();
})();
