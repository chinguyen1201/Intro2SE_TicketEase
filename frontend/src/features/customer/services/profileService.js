// Profile service for customer profile management
const API_BASE_URL = 'http://localhost:3000';

/**
 * Get customer profile information
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

/**
 * Update customer profile information
 * @param {string} token - Authentication token
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated user profile data
 */
export const updateProfile = async (token, profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

/**
 * Upload profile avatar
 * @param {string} token - Authentication token
 * @param {File} file - Avatar image file
 * @returns {Promise<Object>} Updated user profile data with new avatar URL
 */
export const uploadAvatar = async (token, file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch(`${API_BASE_URL}/customer/profile/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload avatar');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

/**
 * Get customer statistics (events attended, tickets purchased, etc.)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Customer statistics
 */
export const getCustomerStats = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/statistics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch statistics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
};

/**
 * Change customer password
 * @param {string} token - Authentication token
 * @param {Object} passwordData - Current and new passwords
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (token, passwordData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/profile/password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }

        return await response.json();
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

/**
 * Delete customer account
 * @param {string} token - Authentication token
 * @param {string} password - Current password for confirmation
 * @returns {Promise<Object>} Success response
 */
export const deleteAccount = async (token, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/profile`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete account');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};
