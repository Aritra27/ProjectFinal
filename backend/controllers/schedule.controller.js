const Berth = require("../models/berth");
const Schedule = require("../models/schedule");

const createSchedule = async (req, res) => {
  try {
    const {
      portId,
      shipId,
      content_type,
      arrival_time,
      departure_time,
      berthId,
      portOwnerId
    } = req.body;

    console.log(req.body);

    if (
      !portOwnerId||
      !portId ||
      !shipId ||
      !content_type ||
      !arrival_time ||
      !departure_time ||
      !berthId
    ) {
      return res.status(401).json({
        message: "some thing is missing",
        success: true,
      });
    }

    function calculatePriority(arrivalTime, contentType) {
      // Get the current time
      const currentTime = new Date();

      // Get the current time
      const parsedArrivalTime = new Date(arrivalTime);

      // Calculate the time difference in hours
      const timeDiffInHours =
        (parsedArrivalTime-currentTime ) / (1000 * 60 * 60);

      // Ensure valid base priority
      let basePriority = timeDiffInHours * 0.1 || 0;

      // Adjust for content type
      if (contentType === "food") {
        basePriority += 1;
      } else if (contentType === "Material") {
        basePriority += 0.5;
      }

      return basePriority;
    }
    const priority = calculatePriority(arrival_time, content_type);

    const schedule = await Schedule.create({
      shipOwnerId:req.id,  
      portOwnerId,
      portId,
      shipId,
      content_type,
      arrival_time,
      priority,
      departure_time,
      berthId,
    });
    return res.status(200).json({
      schedule,
      message: "schedule created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const freeSlots = async (req, res) => {
  const { expectedArrival_time, stayDuration, portId } = req.body;
  const availableSlots = new Map(); // Use a Map to keep unique slots

  const startDateObj = new Date(expectedArrival_time);

  try {
    console.log("checkpoint 1");
    console.log("Received portId: ", portId);
    console.log("Request body: ", req.body);

    // Fetch all berths for the given port with their schedules
    const berths = await Berth.find({ portId }).populate({
      path: "schedules",
      select: "arrival_time departure_time",
    });

    if (!berths || berths.length === 0) {
      console.log("No berths found for the portId:", portId);
      return res
        .status(404)
        .json({ error: "No berths found for the given port" });
    }

    // Process each berth to find available slots
    berths.forEach((berth) => {
      let lastDeparture = startDateObj;

      // Sort schedules by arrival time
      const sortedSchedules = berth.schedules?.length
        ? berth.schedules.sort(
            (a, b) => new Date(a.arrival_time) - new Date(b.arrival_time)
          )
        : [];

      // Find available slots by comparing schedule gaps
      sortedSchedules.forEach((schedule) => {
        const berthArrival = new Date(schedule.arrival_time);

        // Check if there's enough space for stayDuration before the next schedule
        if (lastDeparture < berthArrival) {
          const potentialStart = lastDeparture;
          const potentialEnd = new Date(potentialStart);
          potentialEnd.setHours(potentialEnd.getHours() + stayDuration);

          if (potentialEnd <= berthArrival) {
            const slotKey = `${potentialStart.toISOString()}-${potentialEnd.toISOString()}`;
            if (!availableSlots.has(slotKey)) {
              availableSlots.set(slotKey, {
                berthId: berth._id,
                availableFrom: potentialStart,
                availableUntil: berthArrival,
              });
            }
          }
        }
        lastDeparture = new Date(schedule.departure_time); // Move to the end of this schedule
      });

      // Check availability after the last schedule
      const potentialStart = lastDeparture;
      const potentialEnd = new Date(potentialStart);
      potentialEnd.setHours(potentialEnd.getHours() + stayDuration);

      // If there's no next schedule, mark availability as "indefinite" or "rest"
      const slotKey = `${potentialStart.toISOString()}-indefinite`;
      if (!availableSlots.has(slotKey)) {
        availableSlots.set(slotKey, {
          berthId: berth._id,
          availableFrom: potentialStart,
          availableUntil: sortedSchedules.length ? "indefinite" : "rest",
        });
      }
    });

    // Sort available slots by the earliest available time
    const sortedSlots = Array.from(availableSlots.values()).sort(
      (a, b) => new Date(a.availableFrom) - new Date(b.availableFrom)
    );

    console.log(sortedSlots);

    // Return the top 5 available slots
    return res.json({ success: "true", slots: sortedSlots.slice(0, 5) });
  } catch (err) {
    console.error("Error occurred:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong", details: err.message });
  }
};

const portSchedules = async(req,res)=>{
  const portOwnerId = req.id;
  try {
    const schedules = await Schedule.find({portOwnerId});
    if(!schedules){
      return res.status(200).json({
        success:true,
        schedules:[]
      })
    }
    return res.status(200).json({
      success:true,
      schedules
    })

  } catch (error) {
    console.log(error)
  }
}

const shipSchedules = async(req,res)=>{
  const shipOwnerId = req.id;
  try {
    const schedules = await Schedule.find({shipOwnerId});
    if(!schedules){
      return res.status(400).json({
        success:false,
      })
    }
    return res.status(200).json({
      success:true,
      schedules
    })

  } catch (error) {
    console.log(error)
  }
}

module.exports = { freeSlots, createSchedule,portSchedules,shipSchedules};
