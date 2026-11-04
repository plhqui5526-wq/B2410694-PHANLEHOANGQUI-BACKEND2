const ApiError = require('../api-error.js');
const ContactService = require('../services/contact.service.js');
const MongoDB = require('../utils/mongodb.util.js');

exports.create = async (req, res, next) => {
  if(!req.body?.name) {
    return next(new ApiError(400, "Name cannot be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occured while creating the contact"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents;

  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if(name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch(error) {
    return next(new ApiError(500, "An error occured while retrieving contacts"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if(!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch(error) {
    return next(new ApiError(500, `An error occured while retrieving a contact with the id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if(Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Update data cannot be empty."));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if(!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Updated contact sucessfully"});
  } catch(error) {
    return next(new ApiError(500, `An error occured while updating a contact with the id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if(!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Deleted contact successfully"});
  } catch(error) {
      return next(new ApiError(500, `An error occured while deleting a contact with the id=${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({message: `${deletedCount} contacts were deleted successfully`});
  } catch(error) {
    return next(new ApiError(500, "An error occured while deleting all contacts."));
  }
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occured while retrieving favorite contacts."));
  }
};
