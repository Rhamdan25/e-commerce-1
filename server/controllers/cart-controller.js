const Cart = require("../models/cart")
const User = require("../models/user")
const Product = require("../models/product")
const mongoose = require("mongoose")

class CartController{
    static create(req, res, next) {
        Product.findOne({_id: req.body.product})
            .then(product =>{
                
                if(!product) {
                    throw({
                        code: 404,
                        message: "Product not found"
                    })
                }
                if((product.stock - 1) < 0) {
                    throw({
                        code: 400,
                        message: `Sorry,${product.title} is out of stock`
                    })
                }
                return Cart.findOne({userId: req.headers.decoded._id, product: req.body.product, status: 'cart'})
            })
            .then(found =>{
                if(found){
                    Cart.update({_id: found._id}, {$inc: { quantity: req.body.quantity }})
                    .then(updated =>{
                        res.status(201).json(updated)
                    })
                }else{
                    var newCart = new Cart({
                        status: 'cart',
                        userId: req.headers.decoded._id,
                        product: req.body.product,
                        quantity: req.body.quantity,
                    })
                    newCart.save()
                    .then(created =>{
                        res.status(201).json(created)
                       })
                }
            })
            .catch(next)
    }
    static findCart(req, res, next) {
        console.log("finding cart")
        Cart.find({
            userId: req.headers.decoded._id,
        }).populate("userId").populate("product")
        .then(found =>{
            res.status(200).json(found)
        })
        .catch(next)
    }


    static updateCart(req, res, next) { //CHECKOUT
        var promises = []
        Cart.find({userId: req.headers.decoded._id, status: "cart"}).populate("product").populate("userId")
        .then(carts =>{
            carts.forEach(cart =>{
                if((cart.product.stock - cart.quantity) < 0) {
                    throw({
                        code: 400,
                        message: `Sorry, ${cart.product.title} is out of stock`
                    })
                }
            })
            carts.forEach(cart =>{
                cart.status = "ordered"
                promises.push(cart.save())
            })      
            return Promise.all(promises)        
        })
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(next)
    }
    static updateQuantity(req, res, next) {
        Cart.findOne({_id: req.body._id}).populate("product")
        .then(cart =>{
            if((cart.product.stock - req.body.quantity) >= 0) {
                cart.quantity = req.body.quantity
                return cart.save()
            }else {
                throw({
                    code: 400,
                    message: "Product is out of stock"
                })
            }
        })
        .then(cart =>{
            res.status(200).json(cart)
        })
        .catch(next)
    }
    static deleteCart(req, res, next) {
        Cart.deleteOne({_id: req.params.id})
        .then(deleted =>{
            res.status(200).json(deleted)
        })
        .catch(next)
    }
    static getTransactions(req, res, next) {
        Cart.find({userId: req.headers.decoded._id, status: req.params.status}).populate("product")
         .then(transactions =>{
             res.status(200).json(transactions)
         })
         .catch(next)
    }

    static getAllPendingTransactions(req, res, next) {
        Cart.find().populate("product").populate("userId")
        .then(carts =>{
            res.status(200).json(carts)
        })
        .catch(next)
    }
    
    static updateTransactions(req, res, next) {
        Cart.findOne({_id: req.body.id})
        .then(cart =>{
            cart.status = req.body.status
            return cart.save()
        })
        .then(cart =>{
            res.status(200).json(cart)
        })
        .catch(next)
    }
}

module.exports = CartController