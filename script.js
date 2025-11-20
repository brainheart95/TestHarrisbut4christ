function getNextServiceDate() {
    const now = new Date();

    // Start from "now" but set to Sunday 10:30
    const target = new Date(now);
    target.setHours(10, 30, 0, 0); // 10:30

    const day = now.getDay(); // 0 = Sunday

    if (day !== 0 || now >= target) {
        // Not Sunday, or it's already past 10:30 today → move to next Sunday
        const daysUntilSunday = (7 - day) % 7 || 7;
        target.setDate(target.getDate() + daysUntilSunday);
    }

    return target;
}

function startCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return;

    let target = getNextServiceDate();

    function update() {
        const now = new Date();

        if (now >= target) {
            el.textContent = "We are live (or starting very soon)!";
            return;
        }

        const diffMs = target - now;
        const totalSeconds = Math.floor(diffMs / 1000);

        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        el.textContent = `Next service in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    update();
    setInterval(update, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Church prototype loaded.");
    startCountdown();
});
