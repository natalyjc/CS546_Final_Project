$(document).ready(function() {
    
    fetchCourses();

    function fetchCourses() {
      $.ajax({
        url: '/api/courses',
        method: 'GET',
        success: function(responseMessage) {
          if (responseMessage && responseMessage.length > 0) {
            const courseListContainer = $('<ul class="course-list"></ul>');
            responseMessage.forEach((course, index) => {
              const courseElement = $(`
                <li class="course-card">
                  <div class="course-card-header">
                    <div class="course-name">
                      <a href="/courses/${course._id}" class="course-link">${course.title}</a>
                    </div>
                    <div class="course-actions">
                      <a href="/courses/${course._id}/edit" class="update-course-btn">✏️ Edit</a>
                      <form action="/courses/delete/${course._id}" method="POST">
                        <button type="submit" class="delete-course-btn" data-id="${course._id}">🗑 Delete</button>
                      </form>
                    </div>
                  </div>
                  <div class="course-details">
                    <span class="course-progress">📈 Progress: ${course.progress}%</span>
                    <span class="course-status">📌 Status: ${course.status}</span>
                  </div>
                  <div class="course-recommendations">
                    <h4>🎥 Recommended YouTube Videos:</h4>
                    <ul id="yt-${index}">
                      <li>Loading videos...</li>
                    </ul>
                  </div>
                </li>
              `);
              
              // Append course element to course list
              courseListContainer.append(courseElement);
            });
            
            // Replace/append the course list to the container
            $('#courseContainer').html(courseListContainer);
            
            // Now fetch video recommendations for each course
          } else {
            $('#courseContainer').html('<p>No courses added yet.</p>');
          }
        },
        error: function(error) {
          console.error('Error fetching courses:', error);
          $('#courseContainer').html('<p>Error loading courses. Please try again later.</p>');
        }
      });
    }
  });