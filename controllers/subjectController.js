import Subject from "../models/Subject.js";
import { validateSubject } from "../models/Subject.js";



/**
 * @desc add new subject
 * @route /api/subject
 * @method POST
 * @access protected 
 */
export const addSubject = async (req, res) => {
    const {error} = validateSubject(req.body)
    if(error)
        return res.status(400).json({message: error.details[0].message})

    try{

        let subject = await Subject.findOne({
            name: req.body.name,
            instructor: req.body.instructor,
            stage: req.body.stage,
            department: req.body.department
        })
        if(subject)
            return res.status(400).json({message: 'this is subject already existed'})
        
        subject = new Subject(req.body);
        await subject.save();

        res.status(200).send("subjec successfully added.");
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

/**
 * @desc delete subject
 * @route /api/subject/:id
 * @method DELETE
 * @access protected 
 */
export const deleteSubject = async (req, res) => {
    try{
        //check if subject exists
        let subject = await Subject.findOne({_id: req.params.id})
        if(!subject)
            return res.status(400).json({message: 'the subject is not found.'})
        //delete subject
        subject = await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "the subject have been deleted successfully."})
    } catch(error){
        res.status(500).json({message: error.message})
    }
}