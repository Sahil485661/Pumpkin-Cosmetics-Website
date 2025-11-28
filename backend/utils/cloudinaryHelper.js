import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {Object} file - File object from express-fileupload
 * @param {String} folder - Cloudinary folder name
 * @returns {Object} - { public_id, url }
 */
export const uploadToCloudinary = async (file, folder = 'pumpkin-cosmetics') => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        return {
            public_id: result.public_id,
            url: result.secure_url
        };
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects
 * @param {String} folder - Cloudinary folder name
 * @returns {Array} - Array of { public_id, url }
 */
export const uploadMultipleToCloudinary = async (files, folder = 'pumpkin-cosmetics') => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error(`Multiple upload failed: ${error.message}`);
    }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public_id
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of Cloudinary public_ids
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
    try {
        const deletePromises = publicIds.map(id => cloudinary.uploader.destroy(id));
        await Promise.all(deletePromises);
    } catch (error) {
        throw new Error(`Multiple delete failed: ${error.message}`);
    }
};
