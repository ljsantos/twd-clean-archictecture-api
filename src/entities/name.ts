import { left } from "../shared/either";
import { InvalidNameError } from "./errors/invalid-name-error";

export class Name {

    private readonly value: string

    private constructor (value: string) {
        this.value = value
    }

    public static create (name: string) {
        if (!this.validate(name)) {
            return left(new InvalidNameError)
        }
    }

    public static validate(name: string): boolean {
        if (!name) {
            return false
        }

        if (name.trim().length < 2) {
            return false
        }

        if (name.trim().length > 256) {
            return false
        }

        return true
    }
}