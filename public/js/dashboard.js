(function ($) {
  let preferencesForm = $('.widget-settings-form'),
    courseContainer = $('#courseContainer'),
    goalContainer = $('#goalContainer');

  fetchCourses();
  fetchGoals();

  preferencesForm.submit(function (e) {
    e.preventDefault();

    const preferences = {
      showCourses: $('input[name="showCourses"]').is(':checked'),
      showGoals: $('input[name="showGoals"]').is(':checked'),
      showRecommendations: $('input[name="showRecommendations"]').is(':checked')
    };

    let requestConfig = {
      url: '/dashboard/preferences',
      method: 'POST',
      data: preferences
    };

    $.ajax(requestConfig).then(function (response) {
      window.location.reload();
    }).fail(function (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    });
  });

  function fetchCourses() {
    let requestConfig = {
      url: '/api/courses',
      method: 'GET'
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      if (responseMessage && responseMessage.length > 0) {
        const courseListContainer = $('<ul class="course-list"></ul>');
        const showRecommendations = $('input[name="showRecommendations"]').is(':checked');

        responseMessage.forEach((course) => {
          const courseElement = $(
            `<li class="course-card" data-course-id="${course._id}">
              <div class="course-card-header">
                <a class="course-name" href="/courses/${course._id}">${course.title}</a>
                <div class="course-actions">
                  <form class="delete-course-form" data-course-id="${course._id}">
                    <button type="submit" class="delete-course-btn">🗑 Delete</button>
                  </form>
                  <form class="edit-course-form" action="/courses/${course._id}/edit" method="GET">
                    <button type="submit" class="edit-course-btn">✏️ Edit</button>
                  </form>
                </div>
              </div>
              <div class="course-details">
                <span class="course-status">📌 Status: ${course.status}</span>
                <button class="toggle-progress-btn">📈 View Progress</button>

                <div class="progress-container" style="display: none;">
                  <canvas class="progress-chart" width="200" height="200"></canvas>

                  <div class="progress-mode-selector">
                    <label>Choose Progress Mode:</label>
                    <select class="progress-mode">
                      <option value="" selected disabled>Select</option>
                      <option value="assignments">Assignments Completed</option>
                      <option value="dates">Start-End Date</option>
                    </select>
                  </div>

                  <div class="assignments-inputs" style="display: none;">
                    <input type="number" class="completed" placeholder="Completed Assignments" min="0" />
                    <input type="number" class="total" placeholder="Total Assignments" min="1" />
                    <button type="button" class="update-progress-btn">Update Progress</button>
                  </div>

                  <div class="dates-inputs" style="display: none;">
                    <input type="date" class="start-date" />
                    <input type="date" class="end-date" />
                    <button type="button" class="update-progress-btn">Update Progress</button>
                  </div>
                </div>
              </div>

              ${showRecommendations ? `
              <div class="course-recommendations">
                <h4>🎥 Recommended YouTube Videos:</h4>
                <ul><li>Loading videos...</li></ul>
              </div>
              ` : ''}
            </li>`
          );

          courseListContainer.append(courseElement);
        });

        courseContainer.html(courseListContainer);

        bindCourseEvents();
        if (showRecommendations) {
          loadRecommendations(); 
        }        
        initializeProgressCharts();

      } else {
        courseContainer.html('<p>No courses added yet.</p>');
      }
    }).fail(function (error) {
      console.error('Error fetching courses:', error);
      courseContainer.html('<p>Error loading courses. Please try again later.</p>');
    });
  }

  function bindCourseEvents() {
    $('.toggle-progress-btn').on('click', function () {
      const progressContainer = $(this).siblings('.progress-container');
      progressContainer.toggle();
      
      const isVisible = progressContainer.is(':visible');
      $(this).text(isVisible ? "📉 Hide Progress" : "📈 View Progress");
    });

    $('.progress-mode').on('change', function () {
      const selectedMode = $(this).val();
      const container = $(this).closest('.progress-container');

      if (selectedMode === 'assignments') {
        container.find('.assignments-inputs').show();
        container.find('.dates-inputs').hide();
      } else if (selectedMode === 'dates') {
        container.find('.assignments-inputs').hide();
        container.find('.dates-inputs').show();
      }
    });
    
    $('.update-progress-btn').on('click', function() {
      const container = $(this).closest('.progress-container');
      const courseCard = $(this).closest('.course-card');
      const courseId = courseCard.data('course-id');
      const chartCanvas = container.find('.progress-chart')[0];
      const mode = container.find('.progress-mode').val();
      let progress = 0;
      
      if (mode === "assignments") {
        const completed = parseInt(container.find(".completed").val()) || 0;
        const total = parseInt(container.find(".total").val()) || 1;
        progress = Math.min(100, Math.round((completed / total) * 100));
      } else if (mode === "dates") {
        const start = new Date(container.find(".start-date").val());
        const end = new Date(container.find(".end-date").val());
        const now = new Date();

        if (end > start && now >= start) {
          const elapsed = now - start;
          const total = end - start;
          progress = Math.min(100, Math.round((elapsed / total) * 100));
        }
      }
      updateProgressChart(chartCanvas, progress);
    });

    $('.delete-course-form').on('submit', function (e) {
      e.preventDefault();
      const courseId = $(this).data('course-id');
      const courseCard = $(this).closest('.course-card');

      let requestConfig = {
        url: `/dashboard/courses/delete/${courseId}`,
        method: 'POST'
      };

      $.ajax(requestConfig).then(function (response) {
        courseCard.remove();

        if ($('.course-list li').length === 0) {
          courseContainer.html('<p>No courses added yet.</p>');
        }
      }).fail(function (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete the course. Please try again.');
      });
    });
  }

  function fetchGoals() {
    let requestConfig = {
      url: '/api/goals',
      method: 'GET'
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      if (responseMessage && responseMessage.length > 0) {
        const goalListContainer = $('<ul class="goal-list"></ul>');
        let hasCompletedGoals = false;

        responseMessage.forEach((goal) => {
          if (goal.isCompleted) {
            hasCompletedGoals = true;
            const goalElement = $(
              `<li class="goal-card completed-goal" style="display: none;">
                <div class="goal-text">📌 ${goal.goalTitle}</div>
                <div class="goal-target-date">🎯 Target Date: ${goal.targetDate}</div>
                <div class="goal-completed">✅ Completed</div>
              </li>`
            );
            goalListContainer.append(goalElement);
          } else {
            const goalElement = $(
              `<li class="goal-card">
                <div class="goal-card-content">
                  <div class="goal-info">
                    <div class="goal-title">📌 ${goal.goalTitle}</div>
                    <div class="goal-date">🎯 Target Date: ${goal.targetDate}</div>
                  </div>
                  <div class="goal-status-actions">
                    <span class="goal-status in-progress">🚀 In Progress</span>
                    <form class="complete-goal-form" data-goal-id="${goal._id}">
                      <button type="submit" class="btn-primary mark-complete-btn">✅ Complete</button>
                    </form>
                    <form action="/dashboard/goals/${goal._id}/edit" method="GET">
                      <button type="submit" class="btn-primary mark-complete-btn">✏️ Edit</button>
                    </form>
                    <form class="delete-goal-form" data-goal-id="${goal._id}">
                      <button type="submit" class="btn-primary mark-complete-btn">🗑 Delete</button>
                    </form>
                  </div>
                </div>
              </li>`
            );
            goalListContainer.append(goalElement);
          }
        });

        goalContainer.html(goalListContainer);

        bindGoalEvents();

        if (hasCompletedGoals) {
          const toggleButton = $('<button id="toggle-completed-btn" class="btn-create-course" style="margin-top: 1rem;">Show Completed Goals</button>');
          goalContainer.append(toggleButton);

          toggleButton.on('click', function () {
            const completedGoals = $('.completed-goal');
            const buttonText = $(this).text();

            if (buttonText === 'Show Completed Goals') {
              completedGoals.show();
              $(this).text('Hide Completed Goals');
            } else {
              completedGoals.hide();
              $(this).text('Show Completed Goals');
            }
          });
        }

      } else {
        goalContainer.html('<p>No goals added yet.</p>');
      }
    }).fail(function (error) {
      console.error('Error fetching goals:', error);
      goalContainer.html('<p>Error loading goals. Please try again later.</p>');
    });
  }

  function bindGoalEvents() {
    $('.complete-goal-form').on('submit', function (e) {
      e.preventDefault();
      const goalId = $(this).data('goal-id');

      let requestConfig = {
        url: `/dashboard/goals/complete/${goalId}`,
        method: 'POST'
      };

      $.ajax(requestConfig).then(function (response) {
        fetchGoals();
      }).fail(function (error) {
        console.error('Error completing goal:', error);
        alert('Failed to complete the goal. Please try again.');
      });
    });

    $('.delete-goal-form').on('submit', function (e) {
      e.preventDefault();
      const goalId = $(this).data('goal-id');
      const goalCard = $(this).closest('.goal-card');

      if (confirm('Are you sure you want to delete this goal?')) {
        let requestConfig = {
          url: `/dashboard/goals/${goalId}/delete`,
          method: 'POST'
        };

        $.ajax(requestConfig).then(function (response) {
          goalCard.remove();

          if ($('.goal-list li').length === 0) {
            goalContainer.html('<p>No goals added yet.</p>');
          }
        }).fail(function (error) {
          console.error('Error deleting goal:', error);
          alert('Failed to delete the goal. Please try again.');
        });
      }
    });
  }

  function loadRecommendations() {
    $('.course-card').each(async function () {
      const courseId = $(this).attr('data-course-id');
      const videoList = $(this).find('.course-recommendations ul');

      try {
        const res = await fetch(`/recommendations/${courseId}`);
        const html = await res.text();
        videoList.html(html);
      } catch (error) {
        videoList.html('<li>Error loading recommendations.</li>');
      }
    });
  }
  //basically public/js/progress.js
  function initializeProgressCharts() {
    $('.progress-chart').each(function() {
      const ctx = this.getContext('2d');
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Completed", "Remaining"],
          datasets: [{
            data: [0, 100],
            backgroundColor: ["#36A2EB", "#E0E0E0"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            centerText: {
              display: true,
              text: '0%'
            }
          }
        },
        plugins: [{
          id: 'centerText',
          beforeDraw(chart) {
            if (chart.config.options.plugins.centerText?.display) {
              const { ctx, chartArea: { width, height } } = chart;
              ctx.save();
              ctx.font = 'bold 1.2rem sans-serif';
              ctx.fillStyle = '#1f2937';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(chart.config.options.plugins.centerText.text, width / 2, height / 2);
              ctx.restore();
            }
          }
        }]
      });
    });
    
    $('.progress-container input').on('input', function() {
      const container = $(this).closest('.progress-container');
      const modeSelect = container.find('.progress-mode');
      const mode = modeSelect.val();
      const chartCanvas = container.find('.progress-chart')[0];
      let progress = 0;
      
      if (mode === "assignments") {
        const assignmentsInputs = container.find('.assignments-inputs');
        const completed = parseInt(assignmentsInputs.find(".completed").val()) || 0;
        const total = parseInt(assignmentsInputs.find(".total").val()) || 1;
        progress = Math.min(100, Math.round((completed / total) * 100));
      } else if (mode === "dates") {
        const datesfs = container.find('.dates-inputs');
        const start = new Date(datesInputs.find(".start-date").val());
        const end = new Date(datesInputs.find(".end-date").val());
        const now = new Date();
  
        if (end > start && now >= start) {
          const elapsed = now - start;
          const total = end - start;
          progress = Math.min(100, Math.round((elapsed / total) * 100));
        }
      }
      
      updateProgressChart(chartCanvas, progress);
    });
  }
  
  function updateProgressChart(canvas, progress) {
    const chart = Chart.getChart(canvas);
    if (chart) {
      chart.data.datasets[0].data = [progress, 100 - progress];
      chart.options.plugins.centerText.text = `${progress}%`;
      chart.update();
    }
  }
})(window.jQuery);