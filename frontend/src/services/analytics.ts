import api from './api';

// Analytics tracking service
export const analyticsAPI = {
  // Track campaign view
  trackView: async (campaignId: string) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/view`);
      return response.data;
    } catch (error) {
      console.error('Failed to track view:', error);
      throw error;
    }
  },

  // Track campaign click
  trackClick: async (campaignId: string) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/click`);
      return response.data;
    } catch (error) {
      console.error('Failed to track click:', error);
      throw error;
    }
  },

  // Track campaign signup (when user joins)
  trackSignup: async (campaignId: string) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/join`);
      return response.data;
    } catch (error) {
      console.error('Failed to track signup:', error);
      throw error;
    }
  }
};

// React hook for analytics tracking
export const useAnalytics = () => {
  const trackView = async (campaignId: string) => {
    try {
      await analyticsAPI.trackView(campaignId);
    } catch (error) {
      // Silently fail for analytics - don't break user experience
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackClick = async (campaignId: string) => {
    try {
      await analyticsAPI.trackClick(campaignId);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  return { trackView, trackClick };
};
