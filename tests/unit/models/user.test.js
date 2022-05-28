const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("generatetoken", () => {
    it("shoeld generate token ", () => {
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(),isAdmin: true};
        const user = new User(payload);
        const token = user.generateAuthTokens();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload); 
    });
})