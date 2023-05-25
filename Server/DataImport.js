import express from "express";
import products from "./data/Products.js";
import users from "./data/users.js";
import Product from "./Models/ProductModel.js";
import User from "./Models/UserModel.js";
import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
// import { connect } from "mongoose";
import connectDatabse from "./config/MongoDb.js";

dotenv.config();
connectDatabse();

const ImportData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        const createUser = await User.insertMany(users);

        const adminUser = createUser[0]._id

        const sampleProduct = products.map(product => {
            return {
                ...product,
                user: adminUser
            }
        })
        await Product.insertMany(sampleProduct);

        console.log('Data Imported');
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data destroyed!')
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

// const ImportData = express.Router();

// ImportData.post(
//     "/user",
//     asyncHandler(async (req, res) => {
//         await User.remove({});
//         const importUser = await User.insertMany(users);
//         res.send({ importUser });
//     })
// );

// ImportData.post(
//     "/products",
//     asyncHandler(async (req, res) => {
//         await Product.remove({});
//         const importProducts = await Product.insertMany(products);
//         res.send({ importProducts });
//     })
// );

if (process.argv[2] === '-d') {
    destroyData()
} else {
    ImportData()
}

export default ImportData
