import pkg, { ValidationError } from "sequelize";
const { DataTypes, Sequelize, Op } = pkg;
import { isValid, format } from "date-fns";
import { User, validateUser } from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const name = req.query.name || false;
    const email = req.query.email || false;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startAge = parseInt(req.query.startAge) || false;
    const endAge = parseInt(req.query.endAge) || false;
    const startDate = req.query.startDate || false;
    const endDate = req.query.endDate || false;

    console.log(startAge,endAge)
    // Check if startAge is a valid integer
    if (isNaN(startAge) || !Number.isInteger(startAge)) {
      return res
        .status(400)
        .json({
            success: false,
          error: "Invalid startAge parameter. It should be an integer.",
        });
    }

    // Check if endAge is a valid integer
    if (isNaN(endAge) || !Number.isInteger(endAge)) {
      return res
        .status(400)
        .json({ 
            success: false,
            error: "Invalid endAge parameter. It should be an integer." });
    }

    // Calculate the skip value based on the page number
    const skip = (pageNumber - 1) * perPage;
    // Build filter object based on provided query parameters
    const filter = {};
    if (name) {
      filter.name = {
        [Op.like]: `%${name}%`,
      };
    }
    if (email) {
      filter.email = { [Op.like]: `%${email}%` };
    }
    if (startAge && endAge) {
      filter.age = {
        [Op.between]: [startAge, endAge],
      };
    }
    if (startDate && endDate) {
      let validStartDate = isValid(new Date(startDate))
        ? new Date(startDate)
        : null;
      let validEndDate = isValid(new Date(endDate)) ? new Date(endDate) : null;
      if (validStartDate == null || validEndDate == null) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid Date",
        });
      }
      if (validStartDate > validEndDate) {
        [validStartDate, validEndDate] = [validEndDate, validStartDate];
      }

      if (validStartDate && validEndDate) {
        filter.date_of_birth = {
          [Op.between]: [validStartDate, validEndDate],
        };
      }
    }
    const totalCount = await User.count({
      where: filter,
    });

    let sortFields;
    let sortOrder;
    try {
      try {
        sortFields = req.query.sortFields
          ? JSON.parse(req.query.sortFields)
          : ["id"];

        const allowedSortFields = [
          "id",
          "name",
          "age",
          "email",
          "date_of_birth",
        ];

        if (sortFields.some((field) => !allowedSortFields.includes(field))) {
          throw new Error(
            "Invalid sort fields. Allowed values are 'id' ,'name', 'age', 'email', 'date_of_birth'"
          );
        }
      } catch (error) {
        throw error;
      }

      if (!Array.isArray(sortFields)) {
        throw new Error("Provide a valid array of sortaasc fields");
      }

      if (req.query.sortOrder) {
        if (![1, -1].includes(parseInt(req.query.sortOrder))) {
          throw new Error("Use 1 for ascending or -1 for descending.");
        } else {
          sortOrder = req.query.sortOrder == 1 ? "ASC" : "DESC";
        }
      } else if (
        (req.query.sortFields ? true : false) &&
        !req.query.sortOrder
      ) {
        throw new Error(
          "Sorting order is not defined. Use 1 for ascending or -1 for descending."
        );
      } else {
        sortOrder = req.query.sortOrder ? "ASC" : "DESC";
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }

    console.log(sortFields, sortOrder);
    // Fetch records from the database using the calculated skip and limit values and applied filters
    const responsePayload = await User.findAll({
      attributes: ["name", "age", "email", "date_of_birth"],
      where: filter,
      offset: skip,
      limit: parseInt(perPage),
      order: sortFields.map((field) => [field, sortOrder]),
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / perPage);

    // Calculate next and previous page numbers
    const nextPage = pageNumber < totalPages ? parseInt(pageNumber) + 1 : null;
    const prevPage = pageNumber > 1 ? parseInt(pageNumber) - 1 : null;

    return res.status(200).json({
      success: true,
      message: "Paginated users fetched successfully",
      data: {
        totalRecord: totalCount,
        totalPages: totalPages,
        pageNumber: pageNumber,
        perPage: perPage,
        nextPage: nextPage,
        prevPage: prevPage,
        user: responsePayload,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default { getUsers };
