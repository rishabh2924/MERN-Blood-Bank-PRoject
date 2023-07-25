const userModel = require("../models/userModel");
//Get donar list
const getDonarListController=async(req,res)=>{
    try {
        const donarData=await userModel.find({
            role:"donar"
        }).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:'donar list fetched successfully',
            donarData,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar List API',
            error
        })
    }
}

//Get donar list
const getHospitalListController=async(req,res)=>{
    try {
        const hospitalData=await userModel.find({
            role:"hospital"
        }).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:'hospital list fetched successfully',
            hospitalData,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar List API',
            error
        })
    }
}

//Get org list
const getOrgListController=async(req,res)=>{
    try {
        const orgData=await userModel.find({
            role:"organisation"
        }).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:'ORG list fetched successfully',
            orgData,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar List API',
            error
        })
    }
}


// DELETE DONAR
const deleteDonarController =async (req,res)=>{
    try {
        await userModel.findOneAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:" Record Delelted Successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error while deleting ",
            error
        })
    }
}



module.exports={getDonarListController,getHospitalListController,getOrgListController,deleteDonarController}