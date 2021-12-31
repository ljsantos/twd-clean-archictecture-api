import { Email } from "./email"

describe ("Email validation", () => {
    test('should not accept null strings', () => {
        const email = null
        expect(Email.validate(email)).toBeFalsy
    })
})