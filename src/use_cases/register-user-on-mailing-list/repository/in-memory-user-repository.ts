import { UserRepository } from "../../ports/user-repository";
import { UserData } from "../user-data";

export class InMemoryUserRepository implements UserRepository {

    private repository: UserData[]

    constructor (repository: UserData[]) {
        this.repository = repository
    }


    async findUserByEmail(email: string): Promise<UserData> {
        return null
    }
}