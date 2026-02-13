import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { whiteLabelService } from '../../../services/white-label.service';
import { toast } from 'react-toastify';

interface WhiteLabelItem {
  _id: string;
  userId: {
    _id: string;
    username: string;
    role: string;
    fullName: string;
  };
  domain: string;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SuperAdminWhiteLabels = () => {
  const userState = useSelector(selectUserData);
  const [loading, setLoading] = useState(true);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabelItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    domain: '',
    companyName: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    textColor: '#212529',
    fontFamily: 'Arial, sans-serif',
    customCSS: '',
    customJS: '',
    headerHTML: '',
    footerHTML: ''
  });

  useEffect(() => {
    fetchAllWhiteLabels();
  }, []);

  const fetchAllWhiteLabels = async () => {
    try {
      setLoading(true);
      const response = await whiteLabelService.getAllWhiteLabels();
      setWhiteLabels(response.data.data.whiteLabels);
    } catch (error) {
      console.error('Error fetching white-labels:', error);
      toast.error('Failed to fetch white-label setups');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (whiteLabelId: string, currentStatus: boolean) => {
    try {
      await whiteLabelService.toggleWhiteLabelStatus(whiteLabelId, !currentStatus);
      toast.success(`White-label ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchAllWhiteLabels(); // Refresh the list
    } catch (error) {
      console.error('Error toggling white-label status:', error);
      toast.error('Failed to update white-label status');
    }
  };

  const handleCreateWhiteLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await whiteLabelService.createWhiteLabel(formData);
      toast.success('White-label setup created successfully!');
      setShowCreateForm(false);
      setFormData({
        userId: '',
        domain: '',
        companyName: '',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        backgroundColor: '#ffffff',
        textColor: '#212529',
        fontFamily: 'Arial, sans-serif',
        customCSS: '',
        customJS: '',
        headerHTML: '',
        footerHTML: ''
      });
      fetchAllWhiteLabels(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating white-label:', error);
      toast.error(error.response?.data?.message || 'Failed to create white-label setup');
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center p-4">Loading white-label setups...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>All White-Label Setups</h4>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New White-Label'}
          </button>
        </div>
        <div className="card-body">
          {showCreateForm && (
            <div className="mb-4 p-3 border rounded">
              <h5>Create New White-Label Setup</h5>
              <form onSubmit={handleCreateWhiteLabel}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="userId">Admin User ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                        placeholder="User ID of the admin"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="domain">Domain *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        required
                        placeholder="e.g., mybrand.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="companyName">Company Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., My Brand"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="logoUrl">Logo URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="logoUrl"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="faviconUrl">Favicon URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="faviconUrl"
                        name="faviconUrl"
                        value={formData.faviconUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="primaryColor">Primary Color</label>
                      <input
                        type="color"
                        className="form-control"
                        id="primaryColor"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create White-Label'}
                </button>
              </form>
            </div>
          )}

          {whiteLabels.length === 0 ? (
            <div className="text-center p-4">
              <p>No white-label setups found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Domain</th>
                    <th>Admin User</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {whiteLabels?.map((whiteLabel) => (
                    <tr key={whiteLabel._id}>
                      <td>{whiteLabel.companyName}</td>
                      <td>{whiteLabel.domain}</td>
                      <td>
                        <strong>{whiteLabel.userId.username}</strong>
                        <br />
                        <small className="text-muted">{whiteLabel.userId.fullName}</small>
                      </td>
                      <td>
                        <span className={`badge ${whiteLabel.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {whiteLabel.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(whiteLabel.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${whiteLabel.isActive ? 'btn-warning' : 'btn-success'} me-2`}
                          onClick={() => handleToggleStatus(whiteLabel._id, whiteLabel.isActive)}
                        >
                          {whiteLabel.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminWhiteLabels;