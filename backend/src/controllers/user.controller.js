import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {refreshToken,accessToken}

    } catch (error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler( async (req,res) => {
    //get user details from the frontend
    //validate the data - not empty
    //check if user already exists: username, email
    //check for images, avatar
    //upload them to cloudinary, avatar verify if uploaded
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const {fullname,username,email,password,role} = req.body;
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    // console.log("email: ",email);

    if (
        [fullname,username,email,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are mandatory.")
    }

    const existedUser = await User.findOne({
        $or: [{username} ,{email}]
    })

    if (existedUser){
        throw new ApiError(409, "Username or email already exists.")
    }
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email");
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        role: role || "user",
        avatar: "",
        coverImage: ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser," User created successfully.")
    )
})

const loginUser = asyncHandler( async (req,res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //refresh and access token
    //send cookie

    console.log("LOGIN BODY:", req.body);
    const {email,username,password,role} = req.body;
    if (!(username || email)){
        throw new ApiError(400,"Username or email is required.")
    }
    
    if (email && !email.includes("@")) {
        throw new ApiError(400, "Invalid email");
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if (!user){
        throw new ApiError(404, "User does not exist.")
    }
    
    if (role && user.role !== role) {
        throw new ApiError(401, "Invalid role selected.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials.")
    }

    const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))

})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = await jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if (!user){
            throw new ApiError(401, "Invalid r\Refresh token.")
        }
    
        if (incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used.")
        }
    
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {refreshToken: newRefreshToken,accessToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken",newRefreshToken)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newpassword, confPassword} = req.body
    if (!oldPassword || !newpassword || !confPassword) {
        throw new ApiError(400, "All password fields are required");
    }

    if (!(newpassword===confPassword)){
        throw new ApiError(401, "Confirm Password must be same as the new Password.")
    }

    const user = await User.findById(req.user?._id).select("+password");
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid){
        throw new ApiError(401, "The Old Password is incorrect.")
    }

    user.password = newpassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed successfully."
    ))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Current User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body

    if (!fullname || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}