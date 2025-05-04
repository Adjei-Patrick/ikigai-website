document.addEventListener('DOMContentLoaded', function() {
    const subjectSelect = document.getElementById('subject');
    const startButton = document.getElementById('start-form');

    if (subjectSelect && startButton) {
        subjectSelect.addEventListener('change', function() {
            startButton.disabled = !this.value;
        });

        startButton.addEventListener('click', function() {
            const subject = subjectSelect.value;
            if (subject) {
                window.location.href = `/form/${encodeURIComponent(subject)}`;
            }
        });
    }
}); 