const Job = require("../models/Job");
const Service = require("../models/Service");

const serviceController = {
  // Create a new service listing
  createService: async (req, res) => {
    const {
      title,
      description,
      price,
      category,
      availability,
      workSamples,
      skills,
    } = req.body;

    try {
      const service = new Service({
        freelancerID: req.user.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        availability: req.body.availability,
        workSamples: req.body.workSamples || [],
        skills: req.body.skills || [],
      });

      await service.save();
      res
        .status(201)
        .json({ message: "Service created successfully", service });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get services by freelancer ID
  getServices: async (req, res) => {
    const freelancerID = req.user.id;
    // console.log("Freelancer ID:", freelancerID);
    try {
      const services = await Service.find({
        freelancerID,
      }).populate("freelancerID", "name email");
      // console.log("Services found:", services);
      if (services.length === 0) {
        return res
          .status(404)
          .json({ message: "No services found for this freelancer" });
      }
      res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get a service by ID
  getServiceById: async (req, res) => {
    try {
      const { serviceID } = req.params;
      const service = await Service.findById(serviceID).populate(
        "freelancerID",
        "name email"
      );
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a service listing
  updateService: async (req, res) => {
    const { serviceID } = req.params;
    const freelancerID = req.user.id;
    const updatedData = req.body;
    try {
      const service = await Service.findById(serviceID);

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (service.freelancerID.toString() !== freelancerID) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this service" });
      }

      const updatedService = await Service.findByIdAndUpdate(
        serviceID,
        updatedData,
        { new: true }
      );

      await updatedService.save();
      res
        .status(200)
        .json({ message: "Service updated successfully", service });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a service listing
  deleteService: async (req, res) => {
    const { serviceID } = req.params;
    const freelancerID = req.user.id;
    try {
      const service = await Service.findByIdAndDelete(serviceID);

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (service.freelancerID.toString() !== freelancerID) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this service" });
      }

      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all services with search and filter
  searchJobs: async (req, res) => {
    const { search, category, minprice, maxprice } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }
    if (minprice) {
      query.price = { $gte: minprice };
    }
    if (maxprice) {
      query.price = query.price
        ? { ...query.price, $lte: maxprice }
        : { $lte: maxprice };
    }

    try {
      const services = await Job.find(query);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = serviceController;
