import React, { createContext, useState, useCallback } from 'react';
import { workspaceService } from '../services/workspace';

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workspaceService.getWorkspaces();
      setWorkspaces(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch workspaces';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkspace = useCallback(async (data) => {
    try {
      setError(null);
      const response = await workspaceService.createWorkspace(data);
      setWorkspaces([...workspaces, response.data.workspace]);
      return { success: true, workspace: response.data.workspace };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create workspace';
      setError(message);
      return { success: false, error: message };
    }
  }, [workspaces]);

  const updateWorkspace = useCallback(async (id, data) => {
    try {
      setError(null);
      const response = await workspaceService.updateWorkspace(id, data);
      setWorkspaces(workspaces.map(w => w._id === id ? response.data.workspace : w));
      return { success: true, workspace: response.data.workspace };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update workspace';
      setError(message);
      return { success: false, error: message };
    }
  }, [workspaces]);

  const deleteWorkspace = useCallback(async (id) => {
    try {
      setError(null);
      await workspaceService.deleteWorkspace(id);
      setWorkspaces(workspaces.filter(w => w._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete workspace';
      setError(message);
      return { success: false, error: message };
    }
  }, [workspaces]);

  const selectWorkspace = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await workspaceService.getWorkspaceById(id);
      setCurrentWorkspace(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workspace');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    selectWorkspace
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
