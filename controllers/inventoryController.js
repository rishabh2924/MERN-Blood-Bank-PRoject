const mongoose  = require("mongoose")
const inventoryModel = require("../models/inventoryModel")
const userModel = require("../models/userModel")

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Reocrd Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};


//Get all blood records
const getInventoryController = async (req, res) => {
    try {
      const inventory = await inventoryModel
        .find({
          organisation: req.body.userId,
        })
        .populate("donar")
        .populate("hospital")
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        messaage: "get all records successfully",
        inventory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Get All Inventory",
        error,
      });
    }
  };


  //Get donar record

  const getDonarController=async (req,res)=>{
    try {
      const organisation =req.body.userId
      //find donar
      const donarId=await inventoryModel.distinct("donar",
      {organisation
      })
      const donars= await userModel.find({_id:{$in:donarId}})
      return res.status(200).send({
        success:true,
        messaage:'Donar Record Fetched Successfully',
        donars
      })


    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Get All Inventory",
        error,
      });
    }
  }



  const getHospitalController= async (req,res)=>{
      try {
        const organisation=req.body.userId

        const hospitalId=await inventoryModel.distinct('hospital',{organisation})
        //find hospital
        const hospitals = await  userModel.find({
          _id:{$in:hospitalId}
        })
        return res.status(200).send({
          success:true,
          message:"Hospital data fetched successfully",
          hospitals,
        })
        
      } catch (error) {
        console.log(error);
        return res.status(505).send({
          success:false,
          messaage:'Error in get Hospital API',
          error
        })
      }
  }

  //Get Organisation Profiles
  const getOrganisationController = async (req, res) => {
    try {
      const donar = req.body.userId;
      const orgId = await inventoryModel.distinct("organisation", { donar });
      //find org
      const organisations = await userModel.find({
        _id: { $in: orgId },
      });
      return res.status(200).send({
        success: true,
        message: "Org Data Fetched Successfully",
        organisations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In ORG API",
        error,
      });
    }
  };
  // GET ORG for Hospital
  const getOrganisationForHospitalController = async (req, res) => {
    try {
      const hospital = req.body.userId;
      const orgId = await inventoryModel.distinct("organisation", { hospital });
      //find org
      const organisations = await userModel.find({
        _id: { $in: orgId },
      });
      return res.status(200).send({
        success: true,
        message: "Hospital Org Data Fetched Successfully",
        organisations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Hospital ORG API",
        error,
      });
    }
  };

  //get hospital blood records
  const getInventoryHospitalController = async (req, res) => {
    try {
      const inventory = await inventoryModel
        .find(
          req.body.filters
        )
        .populate("donar")
        .populate("hospital")
        .populate("organisation")
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        messaage: "get hospital consumer records successfully",
        inventory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Get All Inventory",
        error,
      });
    }
  };
  
module.exports={createInventoryController
  ,getInventoryController
  ,getDonarController
  ,getHospitalController
  ,getOrganisationController
  ,getOrganisationForHospitalController,
getInventoryHospitalController}