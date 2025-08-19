import React, { useEffect, useState } from 'react';
import { Table, Card, Spinner, Alert, Image } from 'react-bootstrap';
import api from '../services/api';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/companies_admin.php', { withCredentials: true });
        if (res.data.success) {
          setCompanies(res.data.companies);
        } else {
          setError(res.data.message || 'Failed to fetch companies');
        }
      } catch (err) {
        setError('Error fetching companies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="p-3">
      <h3 className="mb-3">All Companies</h3>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Industry</th>
              <th>Employees</th>
              <th>Website</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No companies found</td>
              </tr>
            ) : (
              companies.map(company => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>
                    <Image 
                      src={company.logo_url} 
                      alt={company.name} 
                      width={50} 
                      height={50} 
                      rounded 
                    />
                  </td>
                  <td>{company.name}</td>
                  <td>{company.industry || '-'}</td>
                  <td>{company.employees || '-'}</td>
                  <td>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                    ) : '-'}
                  </td>
                  <td>{new Date(company.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default AdminCompanies;
