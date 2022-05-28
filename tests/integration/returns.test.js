const {Rental} = require("../../models/rental");
const {User} = require("../../models/user");
const mongoose = require("mongoose");
const request = require('supertest');
const moment = require("moment");
const { Movie } = require("../../models/movie");

describe("/api/returns", ()=> {
    let server;
    let rental;
    let token;
    let movieId
    let customerId

    const exec = () => {
        return request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
    }

    beforeEach(async() => { 
        server = require('../../index');
        
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthTokens();

        movie = new Movie({
            _id : movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name:"12345",
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }

        });
        await rental.save();

    });
    afterEach(async () => { 
        await Rental.remove({});
        await Movie.remove({});
        server.close(); 
    });

    it("should return 401 if client is not logged in", async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it("should return 400 if customerId is not provided", async() => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 400 if movieId is not provided", async() => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 404 if rental is not found for customer/movie", async() => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it("should return 400 if rental is already processed", async() => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 200 if rental is processed", async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it("should set the return date if input is valid", async() => {
        
        const res = await exec();
        rentalinDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalinDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    it("should set the rental fee if input is valid", async() => {
        
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save(); 

        const res = await exec();

        rentalinDb = await Rental.findById(rental._id);

        expect(rentalinDb.rentalFee).toBe(14);
    });
    it("should increase the stock if input is valid", async() => {
        
        const res = await exec();

        const movieinDb = await Movie.findById(movieId);

        expect(movieinDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    it("should return the rental if input is valid", async() => {
        
        const res = await exec();
        rentalinDb = await Rental.findById(rental._id);
        expect(res.body).not.toMatchObject(rentalinDb);
        
    });
})