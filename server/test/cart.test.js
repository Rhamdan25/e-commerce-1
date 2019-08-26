const chai = require("chai")
const chaiHttp = require("chai-http")

const app = require("../app")
const { deleteCart } = require("../helpers/delete-all")
const fs = require("fs")

var token = null

var productId = null
var cartId = null

chai.use(chaiHttp)
const expect = chai.expect

after(function(done){
    deleteCart(done);
})

describe("Cart CRUD", function() {
    describe("Correct Parameters", function() {
        describe("Dummy user for cart", function() {
            it("should get user JWT token", function(done) {
                chai.request(app)
                    .post("/users/register")
                    .send({
                        username: "ramdanuser",
                        email: "ramdanuser@mail.com",
                        password: "password",
                        admin: true
                    })
                    .then(res =>{
                        // console.log(res.body)
                        token = res.body.access_token
                        expect(res).to.have.status(200)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })
        })
        describe("Dummy product for cart", function() {
            it("should send an object containing new registered product info with status code 201", function(done) {
                this.timeout(60000)
                // console.log(token)
                chai.request(app)
                    .post("/products/add")
                    .set("token", token)
                    .attach("image", fs.readFileSync("./test/DEH-cap.jpg"), "DEH-cap.jpg")
                    .field("title", "DEH cap")
                    .field("description", "Product Description")
                    .field("price", '25')
                    .field("show", "Dear Evan Hansen")
                    .field("stock", '100')
                  .then(res =>{
                    expect(res.body).to.be.an("object")
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property("title")
                    expect(res.body).to.have.property("description")
                    expect(res.body).to.have.property("image")
                    expect(res.body).to.have.property("price")
                    expect(res.body).to.have.property("show")
                    expect(res.body).to.have.property("stock")
                    var imageUrl = res.body.image.split("/")
                    imageName = imageUrl[imageUrl.length-1]
                    productId = res.body._id
                    done()
                  })
                  .catch(err =>{
                      console.log(err)
                  })
            })
        })

        describe("Adding new items into cart", function() {
            it("should add product into cart and return status code 201", function(done) {
                chai.request(app)
                    .post("/carts/add")
                    .set("token", token)
                    .send({
                        product: productId,
                        quantity: 5              
                    })
                .then(res =>{
                    cartId = res.body._id
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property("status")
                    expect(res.body.status).to.equal("cart")
                    expect(res.body).to.have.property("userId")
                    expect(res.body).to.have.property("product")
                    expect(res.body).to.have.property("quantity")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("throw an error when trying to add a product that does not exist into the cart", function(done) {
                chai.request(app)
                    .post("/carts/add")
                    .set("token", token)
                    .send({
                        product: "5d628360a0f4e1031e240b04",
                        quantity: 1              
                    })
                .then(res =>{
                    expect(res).to.have.status(404)
                    expect(res.body).to.equal("Product not found")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Get user's cart", function() {
            it("should get the cart data of current logged in user", function(done) {
                chai.request(app)
                    .get("/carts/all")
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("should throw an error when user is not logged in", function(done) {
                chai.request(app)
                    .get("/carts/all")
                .then(res =>{
                    expect(res).to.have.status(401)
                    expect(res.body).to.equal("Login First")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Updating the quantity of an item in cart", function() {
            it("should update the quantity of an item in cart", function(done) {
                chai.request(app)
                    .put("/carts/updatequantity")
                    .set("token", token)
                    .send({
                        _id: cartId,
                        quantity: 5
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.product.stock - res.body.quantity).to.gte(0)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("should throw an error when product is out of stock", function(done) {
                chai.request(app)
                    .put("/carts/updatequantity")
                    .set("token", token)
                    .send({
                        _id: cartId,
                        quantity: 101
                    })
                .then(res =>{
                    expect(res).to.have.status(400)
                    expect(res.body).to.equal("Product is out of stock")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("should throw an error when user is not logged in", function(done) {
                chai.request(app)
                    .put("/carts/updatequantity")
                    .send({
                        _id: cartId,
                        quantity: 100
                    })
                .then(res =>{
                    expect(res).to.have.status(401)
                    expect(res.body).to.equal("Login First")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Cart Checkout", function() {

            
            it("should update the status of cart to ordered", function(done) {
                chai.request(app)
                    .put("/carts/updatestatus")
                    .set("token", token)
                    .send({
                        
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("ordered")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        
        describe("Get all transactions with status ordered as an admin", function() {
            it("should return all ordered products", function(done) {
                chai.request(app)
                    .get(`/carts/transactions/admin`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("ordered")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        

        describe("Updating the status of an order as an admin", function() {
            it("should update the status of an order from ordered to sent", function(done) {
                chai.request(app)
                    .patch(`/carts/transactions/admin`)
                    .set("token", token)
                    .send({
                        id: cartId,
                        status: "sent"
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.status).to.equal("sent")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })

            })
        })

        describe("Get transactions by status type", function() {
            it("should return all transactions with status type sent", function(done) {
                chai.request(app)
                    .get(`/carts/transactions/sent`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("sent")
                    // console.log(res.body)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Updating the status of and order as a user", function() {
            it("should update the status of an order from sent to received", function(done) {
                chai.request(app)
                    .patch("/carts/transactions/complete")
                    .set("token", token)
                    .send({
                        id: cartId,
                        status: "received"
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.status).to.equal("received")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })
        
        
        describe("Delete Cart", function() {
            it("should delete the selected cart", function(done) {
                chai.request(app)
                    .delete(`/carts/delete/${cartId}`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property("deletedCount")
                    expect(res.body.deletedCount).to.equal(1)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })    
    })
    
})

