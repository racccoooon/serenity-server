import { jest } from '@jest/globals';
import {GetPublicUserProfileHandler, GetPublicUserProfileQuery} from "../getPublicUserProfile.js";
import {v4} from "uuid";

test('user exists', async () => {
   // arrange
   const userRepo = {
        first: jest.fn(),
   };

   const query = new GetPublicUserProfileQuery(v4());

   var sut = new GetPublicUserProfileHandler(userRepo);

   // act
    await sut.handle(query);

   // assert
    expect(userRepo.first).toHaveBeenCalled();
});