const chai = require("chai")
const chaiHttp = require("chai-http")
const fs = require("fs")

var image = fs.readFileSync("./test/DEH-cap.jpg")
var imageName = null

const app = require("../app")
const { deleteProduct, deleteImage } = require("../helpers/delete-all")
var token = null

var productId = null

chai.use(chaiHttp)
const expect = chai.expect

after(function(done){
    deleteProduct(imageName, done);
    // deleteImage(imageName, done)
})


describe("Products CRUD", function() {
    describe("Correct Parameters", function() {
        describe("Get user JWT token", function() {
            it("should get user JWT token", function(done) {
                chai.request(app)
                    .post("/users/register")
                    .send({
                        username: "ramdanadmin",
                        email: "ramdanadmin@mail.com",
                        password: "password",
                        admin: true
                    })
                    .then(res =>{
                        token = res.body.access_token
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })

        })

        describe("POST /add", function() {
            it("should send an object containing new registered product info with status code 201", function(done) {
                this.timeout(60000)
                // console.log(token)
                chai.request(app)
                    .post("/products/add")
                    .set("token", token)
                    .attach("image", image, "DEH-cap.jpg")
                    .field("title", "Product DEH cap")
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



        describe("GET /all", function() {
            it("should get all product data", function(done) {
                chai.request(app)
                    .get("/products/all")
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
        })

        describe("PUT /edit", function() {
            it("should send an object containing updated product with status code 200", function(done) {
                this.timeout(60000)
                chai.request(app)
                    .put(`/products/edit/${productId}`)
                    .set("token", token)
                    .attach("image", fs.readFileSync("./test/DEH-hoodie.jpg"), "DEH-hoodie.jpg")
                        .field("title", "Product Title")
                        .field("description", "Product Description")
                        .field("price", '60')
                        .field("show", "Dear Evan Hansen")
                        .field("stock", '50')
                    .then(res =>{
                        console.log(res.body,"<<<<")
                        var imageUrl = res.body[0].image.split("/")
                        imageName = imageUrl[imageUrl.length-1]
                        expect(res.body).to.be.an("array")
                        expect(res.body[0]).to.be.an("object")
                        expect(res).to.have.status(200)
                        expect(res.body[0]).to.have.property("title")
                        expect(res.body[0]).to.have.property("description")
                        expect(res.body[0]).to.have.property("image")
                        expect(res.body[0]).to.have.property("price")
                        expect(res.body[0]).to.have.property("show")
                        expect(res.body[0]).to.have.property("stock")
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })

            it("should send an object containing updated product with status code 200(not updating image here)", function(done) {
                this.timeout(60000)
                chai.request(app)
                    .put(`/products/edit/${productId}`)
                    .set("token", token)
                    .attach("image", "", "DEH-hoodie.jpg")
                    .field("title", "Edited Title")
                    .field("description", "Edited Description")
                    .field("price", '60')
                    .field("show", "Dear Evan Hansen")
                    .field("stock", '50')
                .then(res =>{
                    expect(res.body).to.be.an("array")
                    expect(res.body[0]).to.be.an("object")
                    expect(res).to.have.status(200)
                    expect(res.body[0]).to.have.property("title")
                    expect(res.body[0]).to.have.property("description")
                    expect(res.body[0]).to.have.property("image")
                    expect(res.body[0]).to.have.property("price")
                    expect(res.body[0]).to.have.property("show")
                    expect(res.body[0]).to.have.property("stock")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("should throw an error when trying to input a negative integer into stock", function(done) {
                this.timeout(60000)
                chai.request(app)
                    .put(`/products/edit/${productId}`)
                    .set("token", token)
                    .attach("image", "", "DEH-hoodie.jpg")
                    .field("title", "Edited Title")
                    .field("description", "Edited Description")
                    .field("price", '60')
                    .field("show", "Dear Evan Hansen")
                    .field("stock", '-1')
                .then(res =>{
                    expect(res).to.have.status(400)
                    expect(res.body).to.equal('Product validation failed: stock: Path `stock` (-1) is less than minimum allowed value (1).')
                    
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })

            it("should throw an error when trying to input a negative integer into stock", function(done) {
                this.timeout(60000)
                chai.request(app)
                    .put(`/products/edit/${productId}`)
                    .set("token", token)
                    .attach("image", "", "DEH-hoodie.jpg")
                    .field("description", "Edited Description")
                    .field("price", '60')
                    .field("show", "Dear Evan Hansen")
                    .field("stock", '1')
                .then(res =>{
                    expect(res).to.have.status(400)
                    expect(res.body).to.equal("Product validation failed: title: Product Title cannot be empty")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("PATCH /editquantity", function() {
            it("should reduce the stock of the product", function(done) {
                chai.request(app)
                    .patch(`/products/editquantity/${productId}`)
                    .set("token", token)
                    .send({
                        quantity: 2
                    })
                    .then(res =>{
                        expect(res).to.have.status(200)
                        expect(res.body).to.have.property("title")
                        expect(res.body).to.have.property("description")
                        expect(res.body).to.have.property("image")
                        expect(res.body).to.have.property("price")
                        expect(res.body).to.have.property("show")
                        expect(res.body).to.have.property("stock")
                        expect(res.body.stock).to.equal(48)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })

            it("should throw an error when product is out of stock", function(done) {
                chai.request(app)
                    .patch(`/products/editquantity/${productId}`)
                    .set("token", token)
                    .send({
                        quantity: 52
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res.body).to.equal("Sorry, Edited Title is out of stock, please contact our staffs")
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })
        })

        describe("DELETE /delete/:id", function() {
            it("should delete selected product", function(done) {
                chai.request(app)
                    .delete(`/products/delete/${productId}`)
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



    describe("Incorrect parameters", function() {
        describe("POST /add", function() {
            it("should throw an error when user is not an admin", function(done) {
                chai.request(app)
                    .post("/products/add")
                    .send({
                        title: "Some Product",
                        description: "Some product from some broadway show",
                        price: 100,
                        show: "Hades Town",
                        stock: 5
                    })
                    .then(res =>{
                        expect(res).to.have.status(401)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
        })
        describe("/PUT /edit", function() {
            it("should throw an error when user is not an admin", function(done) {
                chai.request(app)
                    .put(`/products/edit/${productId}`)
                    .send({
                        title: "Some Product",
                        description: "Some product from some broadway show",
                        price: 100,
                        show: "Hades Town",
                        stock: 5
                    })
                    .then(res =>{
                        expect(res).to.have.status(401)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })

            


        })
    })

})
