import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { TLoginUser } from "./auth.interface"
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config"
import { jwtUtils } from "../../utils/jwt"

const loginUserFromDB = async (payload : TLoginUser) => {
    const user = await prisma.user.findUniqueOrThrow({
        where : {
            email : payload.email
        }
    })

    if(user.activeStatus === "BLOCKED"){
        throw new Error("Your account is blocked , please contact to support.")
    }

    const isPasswordMatched = await bcrypt.compare(payload.password , user.password);

    if(!isPasswordMatched){
        throw new Error("Credentials Not Matched!")
    }

//     const accessToken = jwt.sign({
//         id : user.id,
//         email : user.email,
//         role : user.role,
//         name : user.name
//     }, config.jwt_access_secret , 
//     {
//         expiresIn : config.jwt_access_expire_in
//     } as SignOptions
// )

const jwtPayload = {
        id : user.id,
        email : user.email,
        role : user.role,
        name : user.name
    }

const accessToken = jwtUtils.createToken( jwtPayload, config.jwt_access_secret , config.jwt_access_expire_in as SignOptions )

const refreshToken = jwtUtils.createToken( jwtPayload, config.jwt_refresh_secret , config.jwt_refresh_expire_in as SignOptions )

    return {
        user ,
        accessToken,
        refreshToken
    };
}


const refreshTokenFromDB = async(refreshToken : string) => {
    const verifiedRefreshToken =jwtUtils.verifyToken(refreshToken , config.jwt_refresh_secret)

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.data)
    }

    const {id } = verifiedRefreshToken.data as JwtPayload;


    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : id
        }
    })

    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked!")
    }

    const jwtPayload = {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload , config.jwt_access_secret , config.jwt_access_expire_in as SignOptions)

    return {accessToken}
}


export const authService = {
    loginUserFromDB,
    refreshTokenFromDB
}