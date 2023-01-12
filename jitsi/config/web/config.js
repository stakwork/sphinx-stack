// Jitsi Meet configuration.
var config = {};

if (!config.hasOwnProperty('hosts')) config.hosts = {};

config.hosts.domain = 'meet.jitsi';
config.focusUserJid = 'focus@auth.meet.jitsi';

var subdir = '<!--# echo var="subdir" default="" -->';
var subdomain = "<!--# echo var="subdomain" default="" -->";
if (subdir.startsWith('<!--')) {
    subdir = '';
}
if (subdomain) {
    subdomain = subdomain.substr(0,subdomain.length-1).split('.').join('_').toLowerCase() + '.';
}
config.hosts.muc = 'muc.' + subdomain + 'meet.jitsi';
config.bosh = '/' + subdir + 'http-bind';
config.websocket = 'wss://localhost:8443/' + subdir + 'xmpp-websocket';

// Video configuration.
//

if (!config.hasOwnProperty('constraints')) config.constraints = {};
if (!config.constraints.hasOwnProperty('video')) config.constraints.video = {};

config.resolution = 720;
config.constraints.video.height = { ideal: 720, max: 720, min: 180 };
config.constraints.video.width = { ideal: 1280, max: 1280, min: 320};
config.disableSimulcast = false;
config.startVideoMuted = 10;
config.startWithVideoMuted = false;

if (!config.hasOwnProperty('flags')) config.flags = {};
config.flags.sourceNameSignaling = true;
config.flags.sendMultipleVideoStreams = true;
config.flags.receiveMultipleVideoStreams = true;


// ScreenShare Configuration.
//

config.desktopSharingFrameRate = { min: 5, max: 5 };

// Audio configuration.
//

config.enableNoAudioDetection = true;
config.enableTalkWhileMuted = false;
config.disableAP = false;

if (!config.hasOwnProperty('audioQuality')) config.audioQuality = {};
config.audioQuality.stereo = false;

config.startAudioOnly = false;
config.startAudioMuted = 10;
config.startWithAudioMuted = false;
config.startSilent = false;
config.enableOpusRed = false;
config.disableAudioLevels = false;
config.enableNoisyMicDetection = true;


// Peer-to-Peer options.
//

if (!config.hasOwnProperty('p2p')) config.p2p = {};

config.p2p.enabled = true;


// Breakout Rooms
//

config.hideAddRoomButton = false;


// Etherpad
//

// Recording.
//

// Local recording configuration.
if (!config.hasOwnProperty('localRecording')) config.localRecording = {};
config.localRecording.disable = false;
config.localRecording.notifyAllParticipants = false;
config.localRecording.disableSelfRecording = false;


// Analytics.
//

if (!config.hasOwnProperty('analytics')) config.analytics = {};

// Enables callstatsUsername to be reported as statsId and used
// by callstats as repoted remote id.
config.enableStatsID = false;


// Dial in/out services.
//


// Calendar service integration.
//

config.enableCalendarIntegration = false;

// Invitation service.
//

// Miscellaneous.
//

// Prejoin page.
if (!config.hasOwnProperty('prejoinConfig')) config.prejoinConfig = {};
config.prejoinConfig.enabled = true;

// Hides the participant name editing field in the prejoin screen.
config.prejoinConfig.hideDisplayName = false;

// List of buttons to hide from the extra join options dropdown on prejoin screen.
// Welcome page.
config.enableWelcomePage = true;

// Close page.
config.enableClosePage = false;

// Default language.
// Require users to always specify a display name.
config.requireDisplayName = false;

// Chrome extension banner.
// Disables profile and the edit of all fields from the profile settings (display name and email)
config.disableProfile = false;

// Room password (false for anything, number for max digits)
config.roomPasswordNumberOfDigits = false;
// Advanced.
//

// Lipsync hack in jicofo, may not be safe.
config.enableLipSync = false;

config.enableRemb = true;
config.enableTcc = true;

// Enable IPv6 support.
config.useIPv6 = true;

// Transcriptions (subtitles and buttons can be configured in interface_config)
config.transcription = { enabled: false };
config.transcription.translationLanguages = [];
config.transcription.translationLanguagesHead = ['en'];
config.transcription.useAppLanguage = true;
config.transcription.preferredLanguage = 'en-US';
config.transcription.disableStartForAll = false;
config.transcription.autoCaptionOnRecord = false;

// Deployment information.
//

if (!config.hasOwnProperty('deploymentInfo')) config.deploymentInfo = {};

// Testing
//

if (!config.hasOwnProperty('testing')) config.testing = {};
if (!config.testing.hasOwnProperty('octo')) config.testing.octo = {};

config.testing.capScreenshareBitrate = 1;
config.testing.octo.probability = 0;

// Deep Linking
config.disableDeepLinking = false;

// P2P preferred codec
// Enable preferred video Codec
if (!config.hasOwnProperty('videoQuality')) config.videoQuality = {};
config.videoQuality.enforcePreferredCodec = false;

if (!config.videoQuality.hasOwnProperty('maxBitratesVideo')) config.videoQuality.maxBitratesVideo = null;
// Reactions
config.disableReactions = false;

// Polls
config.disablePolls = false;

// Configure toolbar buttons
// Hides the buttons at pre-join screen
// Configure remote participant video menu
if (!config.hasOwnProperty('remoteVideoMenu')) config.remoteVideoMenu = {};
config.remoteVideoMenu.disabled = false;
config.remoteVideoMenu.disableKick = false;
config.remoteVideoMenu.disableGrantModerator = false;
config.remoteVideoMenu.disablePrivateChat = false;

// Configure e2eping
if (!config.hasOwnProperty('e2eping')) config.e2eping = {};
config.e2eping.enabled = false;

