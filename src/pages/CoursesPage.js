import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import authService from '../services/authService';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiService.getCourses();
        setCourses(response.data);
      } catch (error) {
        setError('Error fetching courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const handleAddCourse = async () => {
    if (!newCourse.trim()) {
      setError('Course title cannot be empty');
      return;
    }
    try {
      const response = await apiService.createCourse(newCourse);
      setCourses([...courses, response.data]);
      setNewCourse('');
    } catch (error) {
      setError('Error adding course');
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = async () => {
    if (!editingTitle.trim()) {
      setError('Course title cannot be empty');
      return;
    }
    try {
      const response = await apiService.updateCourse(editingCourse.id, editingTitle);
      const updatedCourses = courses.map((course) =>
          course.id === editingCourse.id ? response.data : course
      );
      setCourses(updatedCourses);
      setEditingCourse(null);
      setEditingTitle('');
    } catch (error) {
      setError('Error editing course');
      console.error('Error editing course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await apiService.deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      setError('Error deleting course');
      console.error('Error deleting course:', error);
    }
  };

  const startEditing = (course) => {
    setEditingCourse(course);
    setEditingTitle(course.title);
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setEditingTitle('');
  };

  const currentUser = authService.getCurrentUser();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div>
        <h1>Courses</h1>
        <ul>
          {courses.map((course) => (
              <li key={course.id}>
                {course.title}
                {course.owner === currentUser?.username && (
                    <>
                      <button onClick={() => startEditing(course)}>Edit</button>
                      <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                    </>
                )}
              </li>
          ))}
        </ul>
        <div>
          <input
              type="text"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              placeholder="New Course"
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
        {editingCourse && (
            <div>
              <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Edit Course"
              />
              <button onClick={handleEditCourse}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </div>
        )}
      </div>
  );
};

export default CoursesPage;