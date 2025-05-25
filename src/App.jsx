import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [info, setInfo] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
    bloodGroup: "",
    gender: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const FirebaseDB = import.meta.env.VITE_STORAGE_DATABASE;

  async function fetchData() {
    try {
      const response = await axios.get(`${FirebaseDB}`);
      if (response.data) {
        setInfo(
          Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }))
        );
      } else {
        setInfo([]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function handleChange(e) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  async function addInfo() {
    try {
      await axios.post(
        `https://react-one-123a6-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`,
        userInfo
      );
      fetchData();
      resetForm();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function startEdit(item) {
    setEditMode(true);
    setEditId(item.id);
    setUserInfo({
      firstName: item.firstName,
      lastName: item.lastName,
      age: item.age,
      bloodGroup: item.bloodGroup,
      gender: item.gender,
    });
  }

  async function updateInfo() {
    try {
      await axios.put(
        `https://react-one-123a6-default-rtdb.asia-southeast1.firebasedatabase.app/users/${editId}.json`,
        userInfo
      );
      fetchData();
      resetForm();
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function deleteData(id) {
    try {
      await axios.delete(
        `https://react-one-123a6-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`
      );
      fetchData();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function resetForm() {
    setUserInfo({
      firstName: "",
      lastName: "",
      age: "",
      bloodGroup: null,
      gender: null,
    });
  }

  function cancelEdit() {
    resetForm();
    setEditMode(false);
    setEditId(null);
  }

  return (
    <div className="container">
      <div className="col1">
        <h2>{editMode ? "Edit User" : "Add New User"}</h2>
        <div className="forms">
          <div className="firstLine">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={userInfo.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={userInfo.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="lastLine">
            <label htmlFor="age">Age:</label>
            <input
              type="text"
              name="age"
              placeholder="Enter age"
              value={userInfo.age}
              onChange={handleChange}
              required
            />
            <label htmlFor="bloodGroup">Blood Group:</label>
            <select
              name="bloodGroup"
              value={updateInfo.bloodGroup}
              onChange={handleChange}
              required
            >
              <option>-- Select BloodGroup -- </option>
              <option value="O+ve">O+ve</option>
              <option value="O+ve">AB+ve</option>
              <option value="O+ve">B+ve</option>
              <option value="O+ve">O-ve</option>
              <option value="O+ve">AB-ve</option>
              <option value="O+ve">B-ve</option>
            </select>
            <label htmlFor="gender">Gender:</label>
            <select
              name="gender"
              value={updateInfo.gender}
              onChange={handleChange}
              required
            >
              <option>-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Trans">Trans</option>
            </select>
          </div>
          <div className="buttonLine">
            {editMode ? (
              <div className="button-group">
                <button onClick={updateInfo}>Update User</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <button onClick={addInfo}>Add a User</button>
            )}
          </div>
        </div>
      </div>
      <div className="col2">
        {info.length === 0 ? (
          <p>No data available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {info.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.age}</td>
                  <td>{item.gender}</td>
                  <td>{item.bloodGroup}</td>
                  <td>
                    <button onClick={() => startEdit(item)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => deleteData(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
