// frontend/src/features/organizer/services/eventService.js

const API_BASE_URL = 'http://localhost:5000/api';

export const createEvent = async (eventData, isDraft = false) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add basic event information
    formData.append('title', eventData.title || '');
    formData.append('description', eventData.description || '');
    formData.append('venue', eventData.venueName || '');
    formData.append('address', `${eventData.address || ''}, ${eventData.ward || ''}, ${eventData.district || ''}, ${eventData.province || ''}`.trim().replace(/^,\s*|,\s*$/g, ''));
    formData.append('date', eventData.date || '');
    formData.append('time', eventData.time || '');
    formData.append('category', eventData.category || '');
    formData.append('modeOnline', eventData.modeOnline ? eventData.modeOnline.toString() : 'false');
    formData.append('modeOffline', eventData.modeOffline ? eventData.modeOffline.toString() : 'false');
    
    // Add status
    formData.append('status', isDraft ? 'draft' : 'pending');
    
    // Add organizer information
    formData.append('organizer_name', eventData.orgName || '');
    formData.append('organizer_description', eventData.orgInfo || '');
    formData.append('organizer_contact', eventData.orgContact || 'N/A');
    
    // Add files if they exist
    if (eventData.posterFile) {
      formData.append('poster', eventData.posterFile);
    }
    
    if (eventData.orgLogo) {
      formData.append('orgLogo', eventData.orgLogo);
    }
    
    // Add tickets as JSON string (empty array for drafts if no tickets)
    const ticketsToSubmit = eventData.tickets && eventData.tickets.length > 0 ? eventData.tickets : [];
    formData.append('tickets', JSON.stringify(ticketsToSubmit));
    
    // Add optional fields
    if (eventData.termsConditions) {
      formData.append('terms_conditions', eventData.termsConditions);
    }
    if (eventData.refundPolicy) {
      formData.append('refund_policy', eventData.refundPolicy);
    }
    
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header - browser will set it automatically for FormData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const events = await response.json();
    return events;
    
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
