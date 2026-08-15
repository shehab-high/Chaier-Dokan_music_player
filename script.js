const PLAYLIST_URL =
    "https://www.youtube.com/embed/videoseries?list=PLTSBjCUnFORdicw72E4Znio0K3zZg5f2Y";

let playlistID = null;

try {
    const url = new URL(PLAYLIST_URL);
    playlistID = url.searchParams.get("list");
} catch (error) {
    console.error("Invalid YouTube playlist URL");
}

let player = null;
let playerReady = false;

function onYouTubeIframeAPIReady() {

    if (!playlistID) return;

    player = new YT.Player("youtube-player", {
        width: "280",
        height: "158",

        playerVars: {
            autoplay: 0,
            controls: 0,
            playsinline: 1,
            rel: 0,
            listType: "playlist",
            list: playlistID
        },

        events: {

            onReady: function () {
                playerReady = true;

                player.setVolume(70);

                updateTrackName();
            },

            onStateChange: function (event) {

                const playButton =
                    document.getElementById("playBtn");

                if (!playButton) return;

                if (
                    event.data ===
                    YT.PlayerState.PLAYING
                ) {
                    playButton.textContent = "❚❚";
                    updateTrackName();
                } else {
                    playButton.textContent = "▶";
                }
            },

            onError: function () {

                setTimeout(function () {

                    if (playerReady && player) {
                        player.nextVideo();

                        setTimeout(
                            updateTrackName,
                            800
                        );
                    }

                }, 800);
            }
        }
    });
}

const playButton =
    document.getElementById("playBtn");

if (playButton) {

    playButton.addEventListener(
        "click",
        function () {

            if (!playerReady || !player) return;

            const state =
                player.getPlayerState();

            if (
                state ===
                YT.PlayerState.PLAYING
            ) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        }
    );
}

const nextButton =
    document.getElementById("nextBtn");

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            if (!playerReady || !player) return;

            player.nextVideo();

            setTimeout(
                updateTrackName,
                700
            );
        }
    );
}

const previousButton =
    document.getElementById("previousBtn");

if (previousButton) {

    previousButton.addEventListener(
        "click",
        function () {

            if (!playerReady || !player) return;

            player.previousVideo();

            setTimeout(
                updateTrackName,
                700
            );
        }
    );
}

function updateTrackName() {

    if (!playerReady || !player) return;

    const data =
        player.getVideoData();

    const trackName =
        document.getElementById("trackName");

    if (
        trackName &&
        data &&
        data.title
    ) {
        trackName.textContent =
            data.title;
    }
}

function updateProgress() {

    if (!playerReady || !player) return;

    const current =
        player.getCurrentTime();

    const duration =
        player.getDuration();

    if (
        !duration ||
        isNaN(duration)
    ) {
        return;
    }

    const percentage =
        (current / duration) * 100;

    const progress =
        document.getElementById("progress");

    const currentTime =
        document.getElementById("currentTime");

    const durationElement =
        document.getElementById("duration");

    if (progress) {
        progress.style.width =
            percentage + "%";
    }

    if (currentTime) {
        currentTime.textContent =
            formatTime(current);
    }

    if (durationElement) {
        durationElement.textContent =
            formatTime(duration);
    }
}

setInterval(
    updateProgress,
    500
);

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        String(remaining).padStart(2, "0")
    );
}

const progressBar =
    document.querySelector(".progress-bar");

if (progressBar) {

    progressBar.addEventListener(
        "click",
        function (event) {

            if (!playerReady || !player) return;

            const rect =
                this.getBoundingClientRect();

            const percentage =
                (
                    event.clientX -
                    rect.left
                ) / rect.width;

            const duration =
                player.getDuration();

            player.seekTo(
                duration * percentage,
                true
            );
        }
    );
}

const volumeSlider =
    document.getElementById("volumeSlider");

const volumeButton =
    document.getElementById("volumeBtn");

let previousVolume = 70;

if (volumeSlider) {

    volumeSlider.addEventListener(
        "input",
        function () {

            const volume =
                Number(this.value);

            if (
                playerReady &&
                player
            ) {
                player.setVolume(volume);
            }

            updateVolumeIcon(volume);
        }
    );
}

if (volumeButton) {

    volumeButton.addEventListener(
        "click",
        function () {

            if (!volumeSlider) return;

            const currentVolume =
                Number(volumeSlider.value);

            if (currentVolume > 0) {

                previousVolume =
                    currentVolume;

                volumeSlider.value = 0;

                if (
                    playerReady &&
                    player
                ) {
                    player.setVolume(0);
                }

                updateVolumeIcon(0);

            } else {

                volumeSlider.value =
                    previousVolume;

                if (
                    playerReady &&
                    player
                ) {
                    player.setVolume(
                        previousVolume
                    );
                }

                updateVolumeIcon(
                    previousVolume
                );
            }
        }
    );
}

function updateVolumeIcon(volume) {

    if (!volumeButton) return;

    if (volume === 0) {
        volumeButton.textContent = "🔇";
    } else if (volume < 50) {
        volumeButton.textContent = "🔉";
    } else {
        volumeButton.textContent = "🔊";
    }
}

function updateDateTime() {

    const now = new Date();

    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12;

    hours =
        hours || 12;

    const timeElement =
        document.getElementById(
            "liveTime"
        );

    if (timeElement) {

        timeElement.textContent =
            `${hours}:${minutes} ${ampm}`;
    }

    const banglaMonths = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর"
    ];

    const banglaNumbers =
        "০১২৩৪৫৬৭৮৯";

    function toBanglaNumber(number) {

        return String(number).replace(
            /\d/g,
            digit =>
                banglaNumbers[digit]
        );
    }

    const day =
        toBanglaNumber(
            now.getDate()
        );

    const year =
        toBanglaNumber(
            now.getFullYear()
        );

    const month =
        banglaMonths[
            now.getMonth()
        ];

    const dateElement =
        document.getElementById(
            "liveDate"
        );

    if (dateElement) {

        dateElement.textContent =
            `${day} ${month} ${year}`;
    }
}

updateDateTime();

setInterval(
    updateDateTime,
    1000
);

let activeUsers = 127;

const activeUsersElement =
    document.getElementById(
        "activeUsers"
    );

function updateActiveUsers() {

    if (!activeUsersElement) return;

    const change =
        Math.floor(
            Math.random() * 6
        ) - 2;

    activeUsers += change;

    activeUsers =
        Math.max(
            100,
            Math.min(
                180,
                activeUsers
            )
        );

    activeUsersElement.style.opacity =
        "0";

    setTimeout(
        function () {

            activeUsersElement.textContent =
                activeUsers;

            activeUsersElement.style.opacity =
                "1";

        },
        180
    );
}

setInterval(
    updateActiveUsers,
    10000
);