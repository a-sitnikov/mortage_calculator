import { calcTerm, calcMonthlyPayment} from './utils'

describe('mortage functions', () => {
    
    it('calc payment', () => {
        let res = calcMonthlyPayment(1000000, 10, 36);
        expect(res).toBe(32267.19);
    })

    it('calc payment, round', () => {
        let res = calcMonthlyPayment(1000000, 10, 36, true);
        expect(res).toBe(32267);
    })

    it('calc term', () => {
        let res = calcTerm(1000000, 10, 32267);
        expect(res).toBe(36);
    })

})