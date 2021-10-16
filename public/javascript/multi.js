const errors = {
    CURRENTLY_UPDATING: 'Currently updating',
    STREAM_ENDED: 'Stream ended',
    TOO_MANY_EMBEDS: 'Maximum number of embeds reached',
    NO_TEAM: 'Concurrency issue, no current team',
    INVALID_OAUTH_TOKEN: 'Invalid OAuth token',
    CHAT_ALREADY_CONNECTED: 'Already connected to chat'
};
const twitchBadgeCache = { data: { global: {} } };
let currentlyUpdating = false;
let ele = {};
let allEmbeds = [];
let currentTeamName = '';
let is64Bit = navigator.userAgent.includes('x64');
let maxStreamsHard = Math.floor(0x400 * (is64Bit ? 1.8 : 1) / 0x40);
let currentOAuthChatUser = null;

let chatClient = null;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function getChan(channel = '') {
    return channel.replace(/^#/, '');
}

let lastChatChannelJoined = 0;
function joinChatChannel(channel) {
    if (!allEmbeds.some(n => n.channel === channel)) {
        return Promise.resolve();
    }
    let timeSinceLastChatChannelJoined = Date.now() - lastChatChannelJoined;
    if (timeSinceLastChatChannelJoined < 1500) {
        return delay(1500).then(() => joinChatChannel(channel));
    }
    lastChatChannelJoined = Date.now();
    return chatClient && chatClient.join(channel);
}

let lastChatChannelParted = 0;
function partChatChannel(channel) {
    let timeSinceLastChatChannelParted = Date.now() - lastChatChannelParted;
    if (timeSinceLastChatChannelParted < 1500) {
        return delay(1500).then(() => partChatChannel(channel));
    }
    lastChatChannelParted = Date.now();
    return chatClient && chatClient.part(channel);
}

async function request(opts = {}) {
    let {
        baseUrl = '',
        url = '',
        qs = null,
        headers = {},
        json = true
    } = opts;
    let uri = baseUrl + url;
    if (qs) {
        if (typeof qs === 'string') {
            uri += '?' + qs;
        }
        else {
            let qsKeys = Object.keys(qs);
            if (qsKeys.length) {
                let qs_ = qsKeys.reduce((p, key) => {
                    key = encodeURIComponent(key);
                    let n = qs[key];
                    let result = '';
                    if (typeof n === 'string') {
                        result = `${key}=${encodeURIComponent(n)}`;
                    }
                    else if (Array.isArray(n)) {
                        result = n.map(v => `${key}=${encodeURIComponent(v)}`);
                    }
                    else {
                        result = `${key}=${encodeURIComponent(n)}`;
                    }
                    return p.concat(result);
                }, []);
                uri += '?' + qs_.join('&');
            }
        }
    }
    let _headers = Object.assign(
        {},
        { 'Client-ID': '4g5an0yjebpf93392k4c5zll7d7xcec' },
        json && { Accept: 'application/json' },
        headers
    );
    let options = { headers: new Headers(_headers) };
    let res = await fetch(uri, options);
    return json ? res.json() : res;
}

function breakUpAPI(apiCall, data) {
    let prom = Promise.resolve();
    let result = [];
    for (let i = 0; i < data.length; i += 100) {
        let p = () => apiCall(data.slice(i, i + 100));
        prom = prom.then(p).then(data => delay(1000).then(() => result.push(data)));
    }
    return prom.then(() => result.reduce((p, n) => p.concat(n), []));
}

async function getTeam(teamName) {
    let team = await request({
        baseUrl: 'https://api.twitch.tv/kraken/',
        url: `teams/${teamName}`,
        headers: { Accept: 'application/vnd.twitchtv.v5+json' }
    });
    if ('error' in team) {
        throw team;
    }
    return team;
}

// async function getStreams(userIDs) {
// 	if(userIDs.length > 100) {
// 		return breakUpAPI(getStreams, userIDs);
// 	}
// 	let streams = await request({
// 			baseUrl: 'https://api.twitch.tv/helix/', // Uses Helix
// 			url: 'streams',
// 			qs: {
// 				type: 'live',
// 				first: 100,
// 				user_id: userIDs
// 			}
// 		});
// 	if('error' in streams) {
// 		throw streams;
// 	}
// 	return streams.data;
// }

async function getStreams(userIDs) {
    if (userIDs.length > 100) {
        return breakUpAPI(getStreams, userIDs);
    }
    let streams = await request({
        baseUrl: 'https://api.twitch.tv/kraken/', // Uses Kraken
        url: 'streams',
        qs: {
            stream_type: 'live',
            limit: 100,
            channel: userIDs.join(),
            _uncache: Math.random()
        },
        headers: { Accept: 'application/vnd.twitchtv.v5+json' }
    });
    if ('error' in streams) {
        throw streams;
    }
    return streams.streams.filter(n => n.broadcast_platform === 'live');
}

function getBadges(channel) {
    return request({
        baseUrl: 'https://badges.twitch.tv/v1/badges/',
        url: (channel ? `channels/${channel}` : 'global') + '/display',
        qs: { language: 'en' }
    })
        .then(data => data.badge_sets);
}

async function validateOAuthToken(oauth_token = '') {
    let { token } = await request({
        url: 'https://api.twitch.tv/kraken',
        qs: { oauth_token },
        headers: { Accept: 'application/vnd.twitchtv.v5+json' }
    });
    return token;
}



// function getUsersFromIDs(userIDs) {
// 	if(userIDs.length > 100) {
// 		return breakUpAPI(getUsersFromIDs, userIDs);
// 	}
// 	return request({
// 		baseUrl: 'https://api.twitch.tv/helix/',
// 		url: 'users',
// 		qs: { id: userIDs }
// 	})
// 	.then(({ data }) => data);
// }

async function lookupTeamLiveStreamers(teamName) {
    let team = typeof teamName !== 'string' ? teamName : getTeam(teamName);
    let { users } = await team;
    let streams = await getStreams(users.map(n => n._id));
    // let streamerIDs = streams.map(n => n.user_id); // Helix
    let streamerIDs = streams.map(n => '' + n.channel._id); // Kraken, this endpoint returns number IDs instead of strings
    let streamingUsers = users.filter(n => streamerIDs.includes(n._id));
    return { team, users, streams, streamingUsers };
}

async function embedAllStreamers(teamName) {
    let data = await lookupTeamLiveStreamers(teamName);
    let { streamingUsers } = data;
    let streamingUsersNames = streamingUsers.map(n => n.name);
    let toBeRemoved = allEmbeds.filter(e => !streamingUsersNames.includes(e.channel) || !e.online || e.removed);
    toBeRemoved.forEach(e => {
        e.remove();
        let i = allEmbeds.findIndex(n => n.channel === e.channel);
        allEmbeds.splice(i, 1);
    });
    let _i = 0;
    data.embeds = streamingUsers.map(u => {
        let embedExists = allEmbeds.find(e => e.channel === u.name);
        if (embedExists) {
            return embedExists;
        }
        return delay(_i++ * 100).then(() => createEmbed(u.name)).catch(e => console.log(e));
    });
    return data;
}

function waitForEmbed(player, eventName) {
    return new Promise(resolve => player.addEventListener(eventName, resolve));
}

function setLowestQuality(player) {
    if (!player) return null;
    let qualityList = player.getQualities();
    let lowestQuality = qualityList[0];
    if (qualityList.length > 1) {
        lowestQuality = qualityList.filter(n => n.bitrate)
            .sort((a, b) => a.bitrate - b.bitrate)
            .shift();
    }
    // console.log(player.getChannel(), lowestQuality, player.getQualities());
    if (lowestQuality) {
        player.setQuality(lowestQuality.group);
        return lowestQuality;
    }
    return null;
}

let tooManyEmbedsTimeout = null;
function showTooManyEmbeds() {
    ele.tooManyEmbeds.classList.add('show');
    let remove = () => ele.tooManyEmbeds.classList.remove('show');
    clearTimeout(tooManyEmbedsTimeout);
    tooManyEmbedsTimeout = setTimeout(remove, 5 * 1000);
}

let internalServerErrorTimeout = null;
function showInternalServerError() {
    ele.internalServerError.classList.add('show');
    let remove = () => ele.internalServerError.classList.remove('show');
    clearTimeout(internalServerErrorTimeout);
    internalServerErrorTimeout = setTimeout(remove, 5 * 1000);
}

async function createEmbed(channel) {
    if (allEmbeds.length >= maxStreamsHard) {
        showTooManyEmbeds();
        throw errors.TOO_MANY_EMBEDS;
    }
    else if (!currentTeamName) {
        throw errors.NO_TEAM;
    }
    let container = document.createElement('div');
    let channelNameEle = document.createElement('div');
    // let removeButton = document.createElement('div');
    let playerContainer = document.createElement('div');
    container.classList.add('twitch-player');
    channelNameEle.classList.add('channel-name');
    // removeButton.classList.add('player-remove');
    playerContainer.classList.add('player-container');
    container.appendChild(channelNameEle);
    // container.appendChild(removeButton);
    container.appendChild(playerContainer);
    playerContainer.id = `twitch-player-${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`;
    channelNameEle.innerText = channel;
    ele.embedContainer.appendChild(container);
    let removed = false;
    let player = null;
    let online = false;
    let didSetToLowQuality = false;
    let data = {
        container,
        playerContainer,
        channelNameEle,
        get player() { return player; },
        get channel() { return channel; },
        changeChannel(channelName) {
            if (channelName === channel) {
                return;
            }
            channel = channelName;
            channelNameEle.innerText = channel;
            player.setChannel(channel);
        },
        remove() {
            removed = true;
            partChatChannel(channel);
            player.destroy();
            if (container.parentNode) {
                ele.embedContainer.removeChild(container);
            }
        },
        get removed() { return removed; },
        get online() { return online; },
        get lowQuality() { return didSetToLowQuality; },
        setLowQuality() { return didSetToLowQuality = setLowestQuality(player); }
    };
    allEmbeds.push(data);
    // removeButton.addEventLister('click', data.remove);
    player = new Twitch.Player(playerContainer.id, { width: 258, height: 145, channel });
    player.addEventListener(Twitch.Player.ONLINE, () => {
        online = true;
        joinChatChannel(channel);
    });
    player.addEventListener(Twitch.Player.OFFLINE, () => {
        online = false;
        data.remove();
    });
    let autoPause = ele.setting.autoPause.checked;
    let pauseIfHighBR = ele.setting.pauseHighBR.checked;
    player.addEventListener(Twitch.Player.PLAY, () => {
        didSetToLowQuality = setLowestQuality(player);
        setTimeout(() => didSetToLowQuality = setLowestQuality(player), 20 * 1000);
        if (
            autoPause ||
            (pauseIfHighBR && (didSetToLowQuality === null || didSetToLowQuality.group === 'chunked'))
        ) {
            autoPause = false;
            player.pause();
        }
    });
    await waitForEmbed(player, Twitch.Player.READY);
    player.addEventListener(Twitch.Player.ERROR, e => {
        data.remove();
        throw e;
    });
    player.setMuted(false);
    player.setVolume(0.005);
    await Promise.race([
        waitForEmbed(player, Twitch.Player.PLAY),
        waitForEmbed(player, Twitch.Player.PAUSE),
        waitForEmbed(player, Twitch.Player.ENDED),
        waitForEmbed(player, Twitch.Player.OFFLINE),
        delay(10000) // Timeout
    ]);
    if (player.getEnded()) { // TODO
        data.remove();
        throw errors.STREAM_ENDED;
    }
    return data;
}

function playAllEmbeds() {
    ele.setting.autoPause.checked = false;
    allEmbeds.forEach((n, i) => setTimeout(() => n.player.play(), i * 100));
}

function pauseAllEmbeds() {
    ele.setting.autoPause.checked = true;
    allEmbeds.forEach(n => n.player.pause());
}

function muteAllEmbeds() {
    allEmbeds.forEach(n => n.player.setMuted(true));
}

function unmuteAllEmbeds() {
    allEmbeds.forEach(n => n.player.setMuted(false));
}

function quietAllEmbeds() {
    allEmbeds.forEach(n => n.player.setVolume(0.005));
}

function removeAllEmbeds() {
    currentTeamName = '';
    localStorage.removeItem('ttms-twitch-team-name');
    changeTeamNameDisplay('Pick a team');
    let prom = Promise.resolve();
    allEmbeds.forEach(n => prom = prom.then(() => delay(50)).then(() => n.remove()));
    allEmbeds = [];
}

// function removeAllOfflineEmbeds() {
// 	let removedEmbeds = allEmbeds.filter(n => n.player.getEnded());
// 	removedEmbeds.forEach(({ channel, remove }) => {
// 			remove();
// 			let index = allEmbeds.findIndex(n => n.channel === channel);
// 			allEmbeds.splice(index, 1);
// 		});
// }

async function update() {
    if (!currentTeamName && currentlyUpdating) {
        return Promise.reject(errors.CURRENTLY_UPDATING);
    }
    currentlyUpdating = true;
    await embedAllStreamers(currentTeamName);
    currentlyUpdating = false;
}

function getTeamInput() {
    return ele.inputTeam.value.trim().toLowerCase();
}

async function changeTeamNameDisplay(name) {
    if (ele.teamNameDisplay.innerText === name) return;
    ele.teamNameDisplay.classList.remove('show');
    await delay(200);
    ele.teamNameDisplay.innerText = name;
    ele.teamNameDisplay.classList.add('show');
    await delay(200);
}

async function onInputTeam(e) {
    ele.inputTeam.classList.remove('error');
    let input = getTeamInput();
    if (!input.length || e.key !== 'Enter') {
        return;
    }
    ele.inputTeam.disabled = true;
    let data;
    await getTeam(input).then(n => data = n)
        .catch(e => {
            ele.inputTeam.classList.add('error');
            if (e.status === 500) {
                showInternalServerError();
            }
        });
    ele.inputTeam.disabled = false;
    if (data) {
        currentTeamName = input;
        localStorage.setItem('ttms-twitch-team-name', currentTeamName);
        let { display_name } = data;
		/* await */ changeTeamNameDisplay(display_name);
        await embedAllStreamers(data).catch(console.log);
    }
}

function clearAllChat() {
    ele.data.chatLog.innerHTML = '';
}

function addChatLine(chatLine) {
    let { chatLog } = ele.data;
    if (chatLog.childElementCount >= 20) {
        chatLog.removeChild(chatLog.children[0]);
    }
    chatLog.appendChild(chatLine);
}

function removeChatLine(params = {}) {
    if ('channel' in params) {
        params.channel = getChan(params.channel);
    }
    let search = Object.keys(params)
        .map(key => `[${key}="${params[key]}"]`)
        .join('');
    ele.data.chatLog.querySelectorAll(search)
        .forEach(n => ele.data.chatLog.removeChild(n));
}

function addEmoteDOM(ele, data) {
    data.forEach(n => {
        let out = null;
        if (typeof n === 'string') {
            out = document.createTextNode(n);
        }
        else {
            let { type: [type, subtype], code } = n;
            if (type === 'twitch') {
                if (subtype === 'emote') {
                    out = document.createElement('img');
                    out.setAttribute('src', `https://static-cdn.jtvnw.net/emoticons/v1/${n.id}/1.0`);
                    out.setAttribute('alt', code);
                }
            }
        }

        if (out) {
            ele.appendChild(out);
        }
    });
    twemoji.parse(ele);
}

function handleEmotes(channel, emotes, message) {
    let twitchEmoteKeys = Object.keys(emotes);
    let allEmotes = twitchEmoteKeys.reduce((p, id) => {
        let emoteData = emotes[id].map(n => {
            let [a, b] = n.split('-');
            let start = +a;
            let end = +b + 1;
            return {
                start,
                end,
                id,
                code: message.slice(start, end),
                type: ['twitch', 'emote']
            };
        });
        return p.concat(emoteData);
    }, []);
    let seen = [];
    allEmotes = allEmotes.sort((a, b) => a.start - b.start)
        .filter(({ start, end }) => {
            if (seen.length && !seen.every(n => start > n.end)) {
                return false;
            }
            seen.push({ start, end });
            return true;
        });
    if (allEmotes.length) {
        let finalMessage = [message.slice(0, allEmotes[0].start)];
        allEmotes.forEach((n, i) => {
            let p = Object.assign({}, n, { i });
            let { end } = p;
            finalMessage.push(p);
            if (i === allEmotes.length - 1) {
                finalMessage.push(message.slice(end));
            }
            else {
                finalMessage.push(message.slice(end, allEmotes[i + 1].start));
            }
            finalMessage = finalMessage.filter(n => n);
        });
        return finalMessage;
    }
    return [message];
}

function logChatMessage(channel, userstate, message, fromSelf) {
    let chatLine = document.createElement('div');
    let channelEle = document.createElement('span');
    let badgesEle = document.createElement('span');
    let usernameEle = document.createElement('span');
    let messageEle = document.createElement('span');
    chatLine.classList.add('chat-line');
    channelEle.classList.add('chat-channel');
    badgesEle.classList.add('chat-badges');
    usernameEle.classList.add('chat-username');
    messageEle.classList.add('chat-message');
    chatLine.appendChild(channelEle);
    chatLine.appendChild(badgesEle);
    chatLine.appendChild(usernameEle);
    chatLine.appendChild(messageEle);

    let chan = getChan(channel);;

    chatLine.setAttribute('channel', chan);
    'id' in userstate && chatLine.setAttribute('message-id', userstate.id);
    'user-id' in userstate && chatLine.setAttribute('user-id', userstate['user-id']);
    'room-id' in userstate && chatLine.setAttribute('channel-id', userstate['room-id']);
    'username' in userstate && chatLine.setAttribute('username', userstate.username);

    if ('badges' in userstate && userstate.badges !== null) {
        badgesEle.classList.add('badges');
        let badgeGroup = Object.assign({}, twitchBadgeCache.data.global, twitchBadgeCache.data[chan] || {});
        let badges = Object.keys(userstate.badges)
            .forEach(type => {
                let version = userstate.badges[type];
                let group = badgeGroup[type];
                if (group && version in group.versions) {
                    let url = group.versions[version].image_url_1x;
                    let ele = document.createElement('img');
                    ele.setAttribute('src', url);
                    ele.setAttribute('badgeType', type);
                    ele.setAttribute('alt', type);
                    ele.classList.add('badge');
                    badgesEle.appendChild(ele);
                }
            }, []);
    }

    if ('color' in userstate && userstate.color) {
        usernameEle.style.color = userstate.color;
    }

    let msg = handleEmotes(chan, userstate.emotes || {}, message);
    addEmoteDOM(messageEle, msg);

    channelEle.innerText = getChan(channel);;
    usernameEle.innerText = userstate['display-name'] || userstate.username;
    // messageEle.innerText = message;

    addChatLine(chatLine);
}

async function connectToChat() {
    if (chatClient === null) {
        chatClient = new tmi.client({
            connection: {
                secure: true,
                reconnect: true
            },
            identity: currentOAuthChatUser ? {
                username: currentOAuthChatUser.name,
                password: currentOAuthChatUser.token
            } : {}
        });
        chatClient.on('connecting', () => {
            let chatLine = document.createElement('div');
            chatLine.classList.add('chat-line');
            chatLine.innerText = 'Connecting...';
            addChatLine(chatLine);
        });
        chatClient.on('connected', () => {
            let chatLine = document.createElement('div');
            chatLine.classList.add('chat-line');
            chatLine.innerText = 'Connected.';
            addChatLine(chatLine);
        });
        chatClient.on('disconnected', () => {
            let chatLine = document.createElement('div');
            chatLine.classList.add('chat-line');
            chatLine.innerText = 'Disconnected.';
            addChatLine(chatLine);
        });
        chatClient.on('join', (channel, username, self) => {
            if (!self) {
                return;
            }
            let chan = getChan(channel);;
            let chatLine = document.createElement('div');
            chatLine.classList.add('chat-line');
            chatLine.innerText = `Joined ${chan}.`;
            addChatLine(chatLine);
        });
        chatClient.on('part', (channel, username, self) => {
            if (!self) {
                return;
            }
            let chan = getChan(channel);;
            let chatLine = document.createElement('div');
            chatLine.classList.add('chat-line');
            chatLine.innerText = `Parted ${chan}.`;
            addChatLine(chatLine);
        });
        chatClient.on('message', logChatMessage);
        chatClient.on('cheer', logChatMessage);
        return chatClient.connect().catch(e => console.log({ e }));
    }
    throw errors.CHAT_ALREADY_CONNECTED;
}

async function changeOAuthToken(token = null) {
    ele.setting.oauthToken.classList.remove('error');
    if (!token) {
        token = this.value || '';
    }
    let clearToken = token === '';
    if (clearToken) {
        ele.setting.oauthToken.value = '';
        localStorage.removeItem('ttms-twitch-tmi.js-oauth-token');
        if (chatClient) {
            chatClient.disconnect();
            chatClient = null;
            clearAllChat();
        }
    }
    else {
        if (token.indexOf('oauth:') === 0) {
            token = token.slice('oauth:'.length);
        }
        let {
            valid,
            authorization,
            user_name: name,
            user_id: id
        } = await validateOAuthToken(token);
        if (valid && authorization.scopes.includes('chat_login')) {
            currentOAuthChatUser = { name, id, token, authorization };
            localStorage.setItem('ttms-twitch-tmi.js-oauth-token', token);
            ele.setting.oauthToken.value = token;
            if (chatClient) {
                chatClient.disconnect();
                chatClient = null;
                clearAllChat();
            }
            await connectToChat().catch(console.log);
        }
        else {
            // throw errors.INVALID_OAUTH_TOKEN;
            ele.setting.oauthToken.classList.add('error');
            if (chatClient) {
                chatClient.disconnect();
                chatClient = null;
                clearAllChat();
            }
        }
    }
}

function getOAuthToken() {
    let token = ele.setting.oauthToken.value;
    if (token === '') {
        token = localStorage.getItem('ttms-twitch-tmi.js-oauth-token');
    }
    return token || null;
}

function updateData() {
    let embedsPlaying = allEmbeds.filter(n => n.online);
    ele.data.embedCount.innerText = embedsPlaying.length;

    let totalBitrate = embedsPlaying.reduce((p, n) => p + n.player.getPlaybackStats().playbackRate, 0);
    let averageBitrate = embedsPlaying.length ? totalBitrate / embedsPlaying.length : 0;
    ele.data.bitrateTotal.innerText = `${Math.max(0, totalBitrate).toLocaleString()} Kbps`;
    ele.data.bitrateAverage.innerText = `${Math.round(Math.max(0, averageBitrate)).toLocaleString()} Kbps`;

    let totalViewers = embedsPlaying.reduce((p, n) => p + n.player.getViewers(), 0);
    let averageViewers = embedsPlaying.length ? totalViewers / embedsPlaying.length : 0;
    ele.data.viewersTotal.innerText = totalViewers;
    ele.data.viewersAverage.innerText = Math.round(averageViewers).toLocaleString();
}

function toggleFaq() {
    ele.faq.classList.toggle('faq-showing');
}

window.addEventListener('load', () => {

    // chatClient.on('message', (channel, userstate, message, fromSelf) => {
    // 	let chan = getChan(channel);;
    // 	let embed = allEmbeds.find(n => n.channel === chan);
    // 	if(embed) {
    // 		embed.channelNameEle.innerText = message;
    // 	}
    // });

    ele = Object.assign(ele, {
        // inputUser:          document.getElementById('input-user'),
        // testEle:             document.getElementById('test-ele'),
        inputTeam: document.getElementById('input-team'),
        teamLoad: document.getElementById('team-load'),
        teamNameDisplay: document.getElementById('team-name-display'),
        embedContainer: document.getElementById('embeds'),
        playAllEmbeds: document.getElementById('play-all-embeds'),
        pauseAllEmbeds: document.getElementById('pause-all-embeds'),
        removeAllEmbeds: document.getElementById('remove-all-embeds'),
        muteAllEmbeds: document.getElementById('mute-all-embeds'),
        unmuteAllEmbeds: document.getElementById('unmute-all-embeds'),
        quietAllEmbeds: document.getElementById('quiet-all-embeds'),
        tooManyEmbeds: document.getElementById('too-many-embeds'),
        internalServerError: document.getElementById('internal-server-error'),
        faq: document.getElementById('faq'),
        faqMark: document.getElementById('faq-mark'),
        faqClose: document.getElementById('faq-close'),
        setting: {
            autoPause: document.getElementById('auto-pause'),
            pauseHighBR: document.getElementById('pause-highbr'),
            oauthToken: document.getElementById('oauth-token')
        },
        data: {
            embedCount: document.getElementById('embed-count'),
            bitrateTotal: document.getElementById('bitrate-total'),
            bitrateAverage: document.getElementById('bitrate-average'),
            viewersTotal: document.getElementById('viewers-total'),
            viewersAverage: document.getElementById('viewers-average'),
            chatLog: document.getElementById('chat-log'),
        }
    });
    ele.inputTeam.addEventListener('keydown', onInputTeam);
    ele.teamLoad.addEventListener('click', () => onInputTeam({ key: 'Enter' }));
    ele.playAllEmbeds.addEventListener('click', playAllEmbeds);
    ele.pauseAllEmbeds.addEventListener('click', pauseAllEmbeds);
    ele.muteAllEmbeds.addEventListener('click', muteAllEmbeds);
    ele.unmuteAllEmbeds.addEventListener('click', unmuteAllEmbeds);
    ele.quietAllEmbeds.addEventListener('click', quietAllEmbeds);
    ele.removeAllEmbeds.addEventListener('click', removeAllEmbeds);
    ele.faqMark.addEventListener('click', toggleFaq);
    ele.faqClose.addEventListener('click', toggleFaq);
    // ele.testEle.addEventListener('click', () => allEmbeds[0].player.setVolume(1));
    ele.setting.autoPause.addEventListener('click', () => {
        let { checked } = ele.setting.autoPause;
        localStorage.setItem('ttms-auto-pause', checked);
    });
    ele.setting.pauseHighBR.addEventListener('click', () => {
        let { checked } = ele.setting.pauseHighBR;
        localStorage.setItem('ttms-pause-high-br', checked);
    });
    ele.setting.oauthToken.addEventListener('change', function () { changeOAuthToken(this.value); });

    ele.setting.pauseHighBR.checked = localStorage.getItem('ttms-pause-high-br') === 'true';

    let knownTeamName = localStorage.getItem('ttms-twitch-team-name');
    if (knownTeamName) {
        ele.inputTeam.value = knownTeamName;
    }

    let currentOAuthToken = getOAuthToken();
    if (currentOAuthToken) {
        changeOAuthToken(currentOAuthToken);
    }

    getBadges().then(badges => twitchBadgeCache.data.global = badges);

    setInterval(updateData, 2 * 1000);
    setInterval(() => update().catch(e => { }), 3 * 60 * 1000);
});
