const findSolution = (f, min, max) => {

    let x, res;

    let count = 0;
    while ( max - min > 1) {
        x = Math.round(min + (max - min) / 2);
        res = f(x);
        if (Math.abs(res) < 0.00001)
            break;
        else if (res < 0)
            max = x;
        else 
            min = x;    

        count++;
        if (count > 30) break;
    }    

    return x;

}

export const calcTerm = (loanAmount, interestRate, monthlyPayment) => {

    const f = (x) => {
        return calcMonthlyPayment(loanAmount, interestRate, x) - monthlyPayment;
    }

    let x = findSolution(f, 1, 100 * 12, monthlyPayment);
    return x;
}

export const calcMonthlyPayment = (loanAmount, interestRate, loanTerm, roundPayment = false) => {
    const monthlyInterestRate = interestRate / (12 * 100);
    const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    if (roundPayment)
        return Math.round(monthlyPayment);
    else
        return Math.round(100 * monthlyPayment) / 100;
}

export const calcPayments = (loanAmount, interestRate, monthlyPayment) => {
    let res = [];
    let remaining = loanAmount;
    let n = 0;
    while(remaining > 0) {
        n++;
        let payment = monthlyPayment;
        let interest = remaining * interestRate / (100 * 12);
        let principal = payment - interest;
        remaining -= principal;
        remaining = remaining > 0 ? remaining : 0;

        if (remaining < 20) {
            principal += remaining;
            payment += remaining; 
            remaining = 0;
        }

        res.push({n, payment, interest, principal, remaining});
    }

    return res;
}