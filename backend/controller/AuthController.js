import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//@desc Register user
//@route POST/api/user/register
//@access Public
export const registerUser = async( req, res )=>{
    const { username, password, firstName, lastName, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExists = await UserModel.findOne({$or : [{ username }, { email }]});
    if(userExists) {
        let message = "";
        if(userExists.email === email){
            message = 'Email already exists'
        }else{
            message = 'Username already taken'
        }
        res.status(400).json(message);
        return;
    }
    const newUser = new UserModel({username, password: hashedPassword, firstName, lastName, email});  
    try {
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        // set JWT as HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        delete newUser.password;
        return res.json({
            email: newUser.email,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            bio: newUser.bio,
            profilePicture: newUser.profilePicture,
            coverPicture: newUser.coverPicture,
            _id: newUser._id,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


//@desc Register user
//@route POST/api/user/login
//@access Public

export const loginUser = async(req, res) => {
    const { userid, password } = req.body;
    console.log(userid, password)
    try {
        const user = await UserModel.findOne({$or: [{username: userid}, {email: userid}]});
        if(user){
            const validity = await bcrypt.compare(password, user.password);
            console.log(userid, password)
            if(validity){
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });
                // set JWT as HTTP-only cookie
                res.cookie('jwt', token, {
                    httpOnly : true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
                return res.json({
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture,
                    coverPicture: user.coverPicture,
                    _id: user._id,   
                });
            }
            else{
                return res.status(404).json("Wrong userid or password")
            }
        }
        else{
            return res.status(404).json("Wrong userid or password")
        }
    } catch (error) {
        res.status(500).json(`Error: ${error.message}`)
    }
}

export const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({message: 'User logged out'});
}