import axiosInstance from './axios';

export const getAgentResponse = async (message) => {
    try {
        const response = await axiosInstance.post('/agents/chat', { message }, {
            timeout: 60000,
        });
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.code === 'ECONNABORTED'
                ? 'Request timed out. Please try again.'
                : error.response?.data?.message || 'Failed to get response from agent'
        };
    }
};

export const clearAgentSession = async () => {
    try {
        const response = await axiosInstance.delete('/agents/clear-session');
        return { success: true, message: response.data.message };
    } catch (error) {
        // Silently fail on session clear (e.g. during unmount)
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to clear agent session'
        };
    }
};