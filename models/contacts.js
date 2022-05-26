const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const contactById = allContacts.find(({ id }) => id === contactId);
  if (!contactById) {
    return null;
  }
  return contactById;
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = { id: v4(), ...body };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts));
  return newContact;
};

const updateContact = async (id, body) => {
  const allContacts = await listContacts();
  const findIdx = allContacts.findIndex((item) => item.id === id);
  if (findIdx === -1) {
    return null;
  }
  allContacts[findIdx] = { id, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(allContacts));
  return allContacts[findIdx];
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const indexContact = allContacts.findIndex((item) => item.id === contactId);
  if (indexContact === -1) {
    return null;
  }
  const contactById = allContacts.filter((_, index) => index !== indexContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactById));
  return allContacts[indexContact];
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
