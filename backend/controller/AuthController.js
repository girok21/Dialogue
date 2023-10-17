import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

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
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


//@desc Register user
//@route POST/api/user/login
//@access Public

export const loginUser = async(req, res) => {
    const { userid, password } = req.body;
    try {
        const user = await UserModel.findOne({$or: [{username: userid}, {email: userid}]});
        if(user){
            const validity = await bcrypt.compare(password, user.password);

            validity ? res.status(200).json(user) : res.status(400).json("Wrong userid or password")
        }
        else{
            res.status(404).json("Wrong userid or password")
        }
    } catch (error) {
        res.status(500).json(`Error: ${error.message}`)
    }
}