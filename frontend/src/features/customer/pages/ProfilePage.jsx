import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import NavbarLoggedIn from '../../../components/NavbarLoggedIn';
import Footer from '../../../components/Footer';
import { setSuccessMessage, setErrorMessage } from '../../../context/authSlides.jsx';
import { updateProfile, getCustomerStats, changePassword } from '../services/profileService.js';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, token, successMessage, errorMessage } = useSelector(state => state.auth);

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [stats, setStats] = useState({
        eventsAttended: 0,
        ticketsPurchased: 0,
        accountStatus: 'Member'
    });
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        avatar: null
    });
    const [originalData, setOriginalData] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Initialize profile data from user state
    useEffect(() => {
        if (user) {
            const userData = {
                username: user.username || '',
                email: user.email || '',
                fullName: user.full_name || user.fullName || '',
                phone: user.phone || '',
                address: user.address || '',
                dateOfBirth: user.date_of_birth || user.dateOfBirth || '',
                avatar: user.avatar || null
            };
            setProfileData(userData);
            setOriginalData(userData);
        }
    }, [user]);

    // Load customer statistics
    useEffect(() => {
        const loadStats = async () => {
            if (token && isAuthenticated) {
                try {
                    const statsData = await getCustomerStats(token);
                    setStats(statsData);
                } catch (error) {
                    console.error('Failed to load stats:', error);
                    // Don't show error to user for stats, just use defaults
                }
            }
        };
        loadStats();
    }, [token, isAuthenticated]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                dispatch(setErrorMessage('File size must be less than 5MB'));
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                dispatch(setErrorMessage('Please select an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        dispatch(setErrorMessage(''));
        dispatch(setSuccessMessage(''));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData(originalData);
        dispatch(setErrorMessage(''));
        dispatch(setSuccessMessage(''));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Validate required fields
            if (!profileData.fullName.trim()) {
                dispatch(setErrorMessage('Full name is required'));
                setIsLoading(false);
                return;
            }

            if (!profileData.email.trim()) {
                dispatch(setErrorMessage('Email is required'));
                setIsLoading(false);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileData.email)) {
                dispatch(setErrorMessage('Please enter a valid email address'));
                setIsLoading(false);
                return;
            }

            // Phone validation (Vietnamese phone numbers)
            if (profileData.phone && !/^[0-9+\-\s()]{10,15}$/.test(profileData.phone)) {
                dispatch(setErrorMessage('Please enter a valid phone number'));
                setIsLoading(false);
                return;
            }

            // API call to update profile
            const updatedUser = await updateProfile(token, {
                full_name: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                address: profileData.address,
                date_of_birth: profileData.dateOfBirth,
                avatar: profileData.avatar
            });

            // Update localStorage with new user data
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUserData = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUserData));

            dispatch(setSuccessMessage('Profile updated successfully!'));
            setOriginalData(profileData);
            setIsEditing(false);
            setIsLoading(false);

        } catch (error) {
            console.error('Error updating profile:', error);
            dispatch(setErrorMessage('An error occurred while updating profile'));
            setIsLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        setIsLoading(true);
        try {
            // Validate password fields
            if (!passwordData.currentPassword) {
                dispatch(setErrorMessage('Current password is required'));
                setIsLoading(false);
                return;
            }

            if (!passwordData.newPassword) {
                dispatch(setErrorMessage('New password is required'));
                setIsLoading(false);
                return;
            }

            if (passwordData.newPassword.length < 6) {
                dispatch(setErrorMessage('New password must be at least 6 characters long'));
                setIsLoading(false);
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                dispatch(setErrorMessage('New passwords do not match'));
                setIsLoading(false);
                return;
            }

            // API call to change password
            await changePassword(token, {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            });

            dispatch(setSuccessMessage('Password changed successfully!'));
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
            setIsLoading(false);

        } catch (error) {
            console.error('Error changing password:', error);
            dispatch(setErrorMessage(error.message || 'An error occurred while changing password'));
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarLoggedIn />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                                <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit size={16} />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaSave size={16} />
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaTimes size={16} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {successMessage}
                        </div>
                    )}

                    {/* Profile Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser size={48} className="text-gray-400" />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                            <FaCamera size={16} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                                    {profileData.fullName || 'Full Name'}
                                </h3>
                                <p className="text-gray-600">@{profileData.username}</p>
                                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Customer Account
                                </div>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUser className="inline mr-2" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profileData.username}
                                        disabled={true}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        required
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
                                            }`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={profileData.dateOfBirth}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
                                            }`}
                                    />
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMapMarkerAlt className="inline mr-2" />
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={profileData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        rows="3"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
                                            }`}
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    * Required fields. Your information is kept secure and private.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
                                <p className="text-gray-600 text-sm">Manage your account password and security</p>
                            </div>
                            {!showPasswordForm ? (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <FaLock size={16} />
                                    Change Password
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        dispatch(setErrorMessage(''));
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <FaTimes size={16} />
                                    Cancel
                                </button>
                            )}
                        </div>

                        {showPasswordForm && (
                            <div className="border-t border-gray-200 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Current Password */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                placeholder="Enter your current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('current')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.current ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('new')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.new ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.confirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handlePasswordSave}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaSave size={16} />
                                        {isLoading ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account Statistics */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.eventsAttended}</div>
                                <div className="text-sm text-gray-600">Events Attended</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.ticketsPurchased}</div>
                                <div className="text-sm text-gray-600">Tickets Purchased</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.accountStatus}</div>
                                <div className="text-sm text-gray-600">Account Status</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;
