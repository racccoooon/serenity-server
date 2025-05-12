import {Mediator} from "../mediator/index.js";
import {GetPublicUserProfileQuery} from "../queries/users/getPublicUserProfile.js";
import {status} from "http-status";
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";

export function getPublicUserProfile(fastify) {
    fastify.get('/api/v1/users/:id',
        async (request, reply) => {
            await authenticateEntity(request);

            const response = await request.scope.resolve(Mediator)
                .send(new GetPublicUserProfileQuery(
                    request.params.id,
                ));

            if(!response){
                reply.code(status.NOT_FOUND);
                return;
            }

            reply.send(response);
        });
}