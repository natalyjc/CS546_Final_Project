(function ($) {
  const $goalWrapper = $('#goal-list-wrapper');

  if ($goalWrapper.length) {
    $.getJSON('/api/goals')
      .done(function (goals) {
        if (!goals.length) {
          $goalWrapper.html('<p>No goals added yet.</p>');
          return;
        }

        const $list = $('<ul class="goal-list"></ul>');

        goals.forEach(goal => {
          const isCompleted = goal.isCompleted;

          const goalHtml = isCompleted
            ? `
              <li class="goal-card completed-goal" style="display: none;">
                <div class="goal-text">📌 ${goal.goalTitle}</div>
                <div class="goal-target-date">🎯 Target Date: ${goal.targetDate}</div>
                <div class="goal-completed">✅ Completed</div>
              </li>
            `
            : `
              <li class="goal-card">
                <div class="goal-card-content">
                  <div class="goal-info">
                    <div class="goal-title">📌 ${goal.goalTitle}</div>
                    <div class="goal-date">🎯 Target Date: ${goal.targetDate}</div>
                  </div>
                  <div class="goal-status-actions">
                    <span class="goal-status in-progress">🚀 In Progress</span>
                    <form action="/dashboard/goals/complete/${goal._id}" method="POST">
                      <button type="submit" class="btn-primary mark-complete-btn">✅ Complete</button>
                    </form>
                    <form action="/dashboard/goals/${goal._id}/edit" method="GET">
                      <button type="submit" class="btn-primary mark-complete-btn">✏️ Edit</button>
                    </form>
                    <form action="/dashboard/goals/${goal._id}/delete" method="POST"
                      onsubmit="return confirm('Are you sure you want to delete this goal?');">
                      <button type="submit" class="btn-primary mark-complete-btn">🗑 Delete</button>
                    </form>
                  </div>
                </div>
              </li>
            `;

          $list.append(goalHtml);
        });

        const $toggleButton = $(`
          <button id="toggle-completed-btn" class="btn-create-course" style="margin-top: 1rem;">
            Show Completed Goals
          </button>
        `);

        $goalWrapper.empty().append($list).append($toggleButton);

        $toggleButton.on('click', function () {
          const $completedGoals = $('.completed-goal');
          const isHidden = $completedGoals.first().css('display') === 'none';

          if (isHidden) {
            $completedGoals.slideDown();
            $(this).text('Hide Completed Goals');
          } else {
            $completedGoals.slideUp();
            $(this).text('Show Completed Goals');
          }
        });
      })
      .fail(function () {
        $goalWrapper.html('<p>Error loading goals. Please try again later.</p>');
      });
  }
})(window.jQuery);
