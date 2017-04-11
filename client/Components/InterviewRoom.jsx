<body>
    <div id="elementToShare" style="margin-top: 3px;">
        <header>
            <h2>DEE SEE V2</h2>
            <div id="roomStatusText"></div>
            <div id="userRoleText"></div>
        </header>

        <input type="text" id="room-id" value="default">
        <button id="open-room">Open Room</button>
        <button id="join-room">Join Room</button>
        <br /><br />
        <button id="close-room" disabled>Waiting for session...</button>

        <div id="videos-container"></div>
    </div>

    <div id="recordControls">
        <button id="start">Start Canvas Recording</button>
        <button id="stop" disabled>Stop</button>
        <button id="save" disabled>Processes &amp; Save</button>
        <div id="room-urls"></div>
    </div>

    <!-- Custom function files - MUST BE IN ORDER -->
    <!-- helper, recorder, rtc-multi, lobby -->
    <script src="../Services/interviewHelpers.js"></script>
    <script src="../Services/interviewRecorder.js"></script>
    <script src="../Services/rtc-multi.js"></script>
    <script src="../Services/lobby.js"></script>
</body>