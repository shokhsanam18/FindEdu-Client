import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Branch = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`/api/filials/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch branch details');
        }
        const data = await response.json();
        setBranch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [id]);

  if (loading) return <div>Loading branch details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!branch) return <div>Branch not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{branch.name}</h2>
      <div className="space-y-2">
        <p><strong>Address:</strong> {branch.address}</p>
        <p><strong>Phone:</strong> {branch.phone}</p>
        {/* Add more branch details as needed */}
      </div>
    </div>
  );
};

export default Branch;