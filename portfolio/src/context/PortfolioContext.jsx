import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PortfolioContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user from local storage
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_URL}/portfolio`);
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio data', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Login action
  const login = async (username, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { username, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
  };

  // Update Portfolio
  const updatePortfolio = async (updatedData) => {
    if (!user) return toast.error('Not authorized');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.put(`${API_URL}/portfolio`, updatedData, config);
      setPortfolioData(data);
      toast.success('Portfolio updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      portfolioData,
      isLoading,
      user,
      login,
      logout,
      updatePortfolio,
      fetchPortfolioData
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};
