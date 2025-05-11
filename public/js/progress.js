document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".course-card").forEach((card) => {
      const toggleBtn = card.querySelector(".toggle-progress-btn");
      const progressContainer = card.querySelector(".progress-container");
      const chartCanvas = card.querySelector(".progress-chart");
      const modeSelect = card.querySelector(".progress-mode");
      const assignmentsInputs = card.querySelector(".assignments-inputs");
      const datesInputs = card.querySelector(".dates-inputs");
  
      // chart.js doughnut
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
            // percentage text in the middle of doughnut
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
  
      // view progress and hide progress button
      toggleBtn.addEventListener("click", () => {
        const isVisible = progressContainer.style.display === "block";
        progressContainer.style.display = isVisible ? "none" : "block";
        toggleBtn.textContent = isVisible ? "📈 View Progress" : "📉 Hide Progress";
      });
  
      // actually displatying/hiding either assignments completed or start-end date selection
      modeSelect.addEventListener("change", (e) => {
        const mode = e.target.value;
        assignmentsInputs.style.display = mode === "assignments" ? "block" : "none";
        datesInputs.style.display = mode === "dates" ? "block" : "none";
      });
  
      // can be deleted or modified based on assignments sub doc and start-end
      card.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          const mode = modeSelect.value;
          let progress = 0;
  
          if (mode === "assignments") {
            const completed = parseInt(assignmentsInputs.querySelector(".completed").value) || 0;
            const total = parseInt(assignmentsInputs.querySelector(".total").value) || 1;
            progress = Math.min(100, Math.round((completed / total) * 100));
          } else if (mode === "dates") {
            const start = new Date(datesInputs.querySelector(".start-date").value);
            const end = new Date(datesInputs.querySelector(".end-date").value);
            const now = new Date();
  
            if (end > start && now >= start) {
              const elapsed = now - start;
              const total = end - start;
              progress = Math.min(100, Math.round((elapsed / total) * 100));
            }
          }
  
        // updates doughnut and percentage text
        // needs to be modified based on assignments sub doc
        // and start-end date from course)
        chart.data.datasets[0].data = [progress, 100 - progress];
        chart.options.plugins.centerText.text = `${progress}%`;
        chart.update();

        });
      });
    });
  });
  