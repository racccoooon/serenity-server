import {UserFilter} from "../../repositories/userRepository.js";

export class GetPublicUserProfileQuery{
    constructor(userId) {
        this.userId = userId;
    }
}

export class GetPublicUserProfileHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query){
        const user = await this.userRepository.first(new UserFilter()
            .whereId(query.userId));

        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            updatedAt: user.updatedAt,
        };
    }
}