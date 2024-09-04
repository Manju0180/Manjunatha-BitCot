import React, { useState } from 'react';
import './ContactsView.css';
import contactsData from '../data/contacts.json'; // Import the local JSON data
import { FaUser, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

function ContactsView() {
  const [contacts, setContacts] = useState(contactsData); // Use the imported data
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for Add
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state for Edit
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Modal state for View
  const [newContact, setNewContact] = useState({ name: '', mobile: '', email: '', address: '' }); // State for new contact
  const [editingContact, setEditingContact] = useState(null); // State for editing contact
  const [viewingContact, setViewingContact] = useState(null); // State for viewing contact
  const [errors, setErrors] = useState({}); // Validation errors

  // Filtered contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.mobile.includes(searchTerm)
  );

  // Handle input change for the new contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingContact) {
      setEditingContact(prevState => ({ ...prevState, [name]: value }));
    } else {
      setNewContact(prevState => ({ ...prevState, [name]: value }));
    }
  };

  // Validate the form
  const validateForm = (contact) => {
    const errors = {};
    if (!contact.name.trim()) errors.name = 'Name is required';
    if (!contact.mobile.trim()) errors.mobile = 'Mobile number is required';
    if (contact.mobile && !/^\d{10}$/.test(contact.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }
    if (!contact.email.trim()) errors.email = 'Email is required';
    if (!contact.address.trim()) errors.address = 'Address is required';
    return errors;
  };

  // Handle form submit for adding contact
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(newContact);
    if (Object.keys(validationErrors).length === 0) {
      setContacts([...contacts, { id: contacts.length + 1, ...newContact }]);
      setNewContact({ name: '', mobile: '', email: '', address: '' }); // Clear form
      setIsModalOpen(false); // Close modal
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle form submit for editing contact
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(editingContact);
    if (Object.keys(validationErrors).length === 0) {
      setContacts(contacts.map(contact => (contact.id === editingContact.id ? editingContact : contact)));
      setIsEditModalOpen(false); // Close modal
      setEditingContact(null); // Clear editing contact state
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle edit button click
  const handleEditClick = (contact) => {
    setEditingContact(contact); // Set the contact to edit
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Handle view button click
  const handleViewClick = (contact) => {
    setViewingContact(contact); // Set the contact to view
    setIsViewModalOpen(true); // Open the view modal
  };

  return (
    <div className="contacts-view">
      <header className="header">
        <h1>All Contacts</h1>
        <button className="add-contact-btn" onClick={() => setIsModalOpen(true)}>+</button>
      </header>

      <input
        type="text"
        placeholder="Search Contact"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="contacts-list">
        {filteredContacts.map((contact, index) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-header">
                <span className="serial-number">{index + 1}. </span>
              
             </div>
             <div className="contact-details">
                <FaUser className="contact-icon" /> {/* User icon */}
                <div className="NamePhone" >
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-phone">{contact.mobile}</span>
                </div>
             </div>
            <div className="contact-actions">
              <button onClick={() => handleViewClick(contact)}>
                <FaEye />
              </button>
              <button onClick={() => handleEditClick(contact)}>
                <FaEdit />
              </button>
              <button onClick={() => setContacts(contacts.filter(c => c.id !== contact.id))}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Contact</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile:</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={newContact.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newContact.address}
                  onChange={handleInputChange}
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              <button type="submit" className="submit-btn">Add Contact</button>
              <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {isEditModalOpen && (
        <div className="modal edit-modal-right"> {/* Class to position on right */}
          <div className="modal-content">
            <h2>Edit Contact</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingContact?.name || ''}
                  onChange={handleInputChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile:</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={editingContact?.mobile || ''}
                  onChange={handleInputChange}
                />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editingContact?.email || ''}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editingContact?.address || ''}
                  onChange={handleInputChange}
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              <button type="submit" className="submit-btn">Update Contact</button>
              <button type="button" className="close-btn" onClick={() => setIsEditModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {isViewModalOpen && viewingContact && (
        <div className="modal">
          <div className="modal-content">
            <h2>Contact Details</h2>
            <div className='View-page'>
            <div className="contact-details-view">
              <p><strong>Name:</strong> {viewingContact.name}</p>
              <p><strong>Mobile:</strong> {viewingContact.mobile}</p>
              <p><strong>Email:</strong> {viewingContact.email}</p>
              <p><strong>Address:</strong> {viewingContact.address}</p>
            </div>
            <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>Close</button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsView;




