import User, { validateAddUser, validateUpdateUser } from "../models/User.js"



/**
 *  @desc Get all users
 *  @route /api/users
 *  @method GET
 *  @access private (only admin)
 */
export const getAllUsers = async (req, res)=>{
    try{
        const users = await User.find();
        if (!users || users.length === 0)
            return res.status(404).json({message: "users is not found"})

        res.status(200).json(users)
    } catch(error){
        res.status(400).json({message: error.message})
    }
}

/**
 * @desc Add user
 * @route /api/auth/register
 * @method POST
 * @access public 
 */
export const AddUser = async (req, res) => {
    const {error} = validateAddUser(req.body)
    if(error)
        return res.status(400).json({message: error.details[0].message})

    try{

        let user = await User.findOne({email: req.body.email})
        if(user)
            return res.status(400).json({message: 'this is user already registered'})
        
        user = new User(req.body);
        await user.save();

        res.status(200).json({message: "user registered successfully."});
    } catch(error){
        res.status(500).json({message: error.message})
    }
}


/**
 *  @desc Get user by id
 *  @route /api/users/:id
 *  @method GET
 *  @access private (any)
 */
export const getUserById = async (req, res)=>{
    try{
        const users = await User.findById(req.params.id);
        if (users === null || users.length === 0)
            return res.status(404).json({message: "user is not found"})
        res.status(200).json(users)
    } catch(error){
        res.status(400).json({message: error.message})
    }
}

/**
 *  @desc Update user
 *  @route /api/users/:id
 *  @method Put
 *  @access protected
 */
export const updateUser = async (req, res)=>{
    const {error} = validateUpdateUser(req.body)
    if (error)
        return res.status(400).json({message: error.details[0].message});

    try {
        let user = await User.findOne({email: req.body.email});
        if(user)
            return res.status(400).json({message: "Invalid request"});

        user = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                stage: req.body.stage,
                department: req.body.department,
            }
        }, {new: true});

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

/**
 *  @desc Delete user
 *  @route /api/users/:id
 *  @method DELETE
 *  @access protected
 */
export const deleteUser = async (req, res)=>{
    try {
        let user = await User.findById(req.params.id);
        if(!user)
            return res.status(404).json({message: "the user is not found."})

        user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "the user have been deleted successfully."})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}