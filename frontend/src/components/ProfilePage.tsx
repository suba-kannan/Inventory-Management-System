import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const updatedProfile = { name, email, phone, password };

      const res = await axios.put(
        'http://localhost:5000/api/profile',
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
    setPhone(profile?.phone || '');
    setPassword('');
    setIsEditing(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-section">
        <strong>Name:</strong>
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        ) : (
          <p>{profile?.name}</p>
        )}
      </div>

      <div className="profile-section">
        <strong>Email:</strong>
        {isEditing ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        ) : (
          <p>{profile?.email}</p>
        )}
      </div>

      <div className="profile-section">
        <strong>Phone:</strong>
        {isEditing ? (
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        ) : (
          <p>{profile?.phone}</p>
        )}
      </div>

      <div className="profile-section">
        <strong>Password:</strong>
        {isEditing ? (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        ) : (
          <p>********</p>
        )}
      </div>

      <div className="profile-section">
        <strong>Role:</strong>
        <p>{profile?.role}</p>
      </div>

      {isEditing ? (
        <div className="profile-buttons">
          <button
            onClick={handleSave}
            className="save-button"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEdit}
          className="edit-button"
        >
          Edit Profile
        </button>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;
