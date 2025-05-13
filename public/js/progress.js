const parseLocalDate = (str) => {
  const [year, month, day] = str.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};



document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".course-card").forEach((card) => {
    const toggleBtn = card.querySelector(".toggle-progress-btn");
    const progressContainer = card.querySelector(".progress-container");
    const chartCanvas = card.querySelector(".progress-chart");
    const modeSelect = card.querySelector(".progress-mode");
    const assignmentsInputs = card.querySelector(".assignments-inputs");
    const datesDisplay = card.querySelector(".dates-display");
    const dateRangeText = card.querySelector(".date-range");

    // Initialize Chart.js doughnut
    let chart = new Chart(chartCanvas, {
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

    // Show/hide progress section
    toggleBtn.addEventListener("click", () => {
      const isVisible = progressContainer.style.display === "block";
      progressContainer.style.display = isVisible ? "none" : "block";
      toggleBtn.textContent = isVisible ? "📈 View Progress" : "📉 Hide Progress";
    });

    // Handle mode switching
    modeSelect.addEventListener("change", (e) => {
      const mode = e.target.value;
      assignmentsInputs.style.display = mode === "assignments" ? "block" : "none";
      datesDisplay.style.display = mode === "dates" ? "block" : "none";

      if (mode === "assignments") {
        // Get values from data attributes
        const completedAssignments = parseInt(card.getAttribute("data-completed-assignments")) || 0;
        const totalAssignments = parseInt(card.getAttribute("data-total-assignments")) || 1;
        
        // Set the hidden input values
        assignmentsInputs.querySelector(".completed").value = completedAssignments;
        assignmentsInputs.querySelector(".total").value = totalAssignments;
        
        // Update the display text
        assignmentsInputs.querySelector(".completed-count").textContent = completedAssignments;
        assignmentsInputs.querySelector(".total-count").textContent = totalAssignments;
        
        // Calculate progress
        const progress = Math.min(100, Math.round((completedAssignments / totalAssignments) * 100));
        assignmentsInputs.querySelector(".progress-percentage").textContent = progress;
        
        // Update chart
        chart.data.datasets[0].data = [progress, 100 - progress];
        chart.options.plugins.centerText.text = `${progress}%`;
        chart.update();
      } else if (mode === "dates") {
        const startStr = card.getAttribute("data-start-date");
        const endStr = card.getAttribute("data-end-date");
        if (startStr && endStr) {
          const start = parseLocalDate(startStr);
          const end = parseLocalDate(endStr);
          const now = new Date();

          const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
          dateRangeText.textContent = `${start.toLocaleDateString(undefined, dateOptions)} → ${end.toLocaleDateString(undefined, dateOptions)}`;

          let progress = 0;
          if (end > start && now >= start) {
            const ms_per_day = 1000 * 60 * 60 * 24;
            const daysElapsed = Math.floor((now - start) / ms_per_day) + 1;
            const totalDays = Math.ceil((end - start) / ms_per_day) + 1;
            progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
          }

          chart.data.datasets[0].data = [progress, 100 - progress];
          chart.options.plugins.centerText.text = `${progress}%`;
          chart.update();
        }
      }
    });
  });
});

  