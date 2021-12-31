import { UserRepository } from "../../ports/user-repository";
import { UserData } from "../user-data";

export class InMemoryUserRepository implements UserRepository {

    private repository: UserData[]

    constructor (repository: UserData[]) {
        this.repository = repository
    }


    async findUserByEmail(email: string): Promise<UserData> {
        const users = this.repository.filter((user) => {
            return user.email === email
        })
        if (users.length > 0){
            return users[0]
        }
        return null
    }
}