function getNextServiceDate() {
    const now = new Date();
    const target = new Date(now);
    target.setHours(10, 30, 0, 0); // Sunday 10:30 local

    const day = now.getDay(); // 0 = Sunday

    if (day !== 0 || now >= target) {
        const daysUntilSunday = (7 - day) % 7 || 7;
        target.setDate(target.getDate() + daysUntilSunday);
    }

    return target;
}

function startCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return; // other pages: do nothing

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

async function loadTeamMembers() {
    const container = document.getElementById("team-cards");
    if (!container) {
        // Not on the about page, nothing to do.
        return;
    }

    try {
        const response = await fetch("data/team.json");
        if (!response.ok) {
            console.error("Failed to load team.json", response.status);
            return;
        }

        const team = await response.json();

        // Clear any placeholder content
        container.innerHTML = "";

        team.forEach(member => {
            const hasPhoto = member.photo && member.photo.trim() !== "";

            // Create the <article> element
            const card = document.createElement("article");
            card.classList.add("card", "team-card");
            if (hasPhoto) {
                card.classList.add("has-photo");
            }

            if (hasPhoto) {
                // Background photo card
                card.innerHTML = `
                    <img src="${member.photo}" alt="${member.name}" class="team-photo" />
                    <div class="team-overlay">
                        <h3>${member.name}</h3>
                        <p class="role">${member.role}</p>
                        <p>${member.description}</p>
                    </div>
                `;
            } else {
                // Fallback card with initials
                const initials = member.initials || (member.name ? member.name.charAt(0).toUpperCase() : "?");
                card.innerHTML = `
                    <div class="avatar-placeholder">${initials}</div>
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                    <p>${member.description}</p>
                `;
            }

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading team members:", err);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    startCountdown();    // does nothing on pages without #countdown
    loadTeamMembers();   // does nothing on pages without #team-cards
});

