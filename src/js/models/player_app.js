var _ = require('underscore');
var Backbone = require('backbonejs');
var YoutubeMediaProvider = require('./youtube_media_provider.js');
var YoutubeProfileService = require('./youtube_profile_service.js');
var YoutubePlayer = require('./youtube_player.js');
var ProfileService = require('./youtube/ProfileService.js');
var UpdatesService = require('./updates-service.js');

var PlayerModel = Backbone.Model.extend({
	defaults: {
		// results layout state: videos, playlists
		layout: 'videos',
		filter: 'videos',

		// handles the router navigation 'routes' object
		route: null,
		
		// models
		user: null,
		youtube: null,
		player: null,

		// actions
		"mark-as-favorite": false
	},

	safe: 'EchoesPlayerApp',

	// models 
	youtube: new YoutubeMediaProvider(),
	user: new YoutubeProfileService(),
	updates: null,
	player : null,

	initialize: function() {
		// initialize models
		this.clean();
		this.set('youtube', this.youtube);
		this.set('user', this.user);
		this.player = new YoutubePlayer();
		this.updates = new UpdatesService();

		// reset attributes that don't need cache
		this.set('route', null);
		this.set('playlist-add', false);

		this.youtube.set({'feedType': this.get('filter')}, { silent: true });
	},

	clean: function() {
		localStorage.removeItem('EchoesPlayerApp-v20130202');
	},
	
	start: function () {
		
		
	},
	/* handlers */
	onFilterChange: function(model, filter) {
		this.set({ layout: filter });
		// this.youtube.set('feedType', filter);
	},

	/* convinience methods for retrieving models */
	connectUser: function() {
		this.user.fetch();
	},

	connect: function(token) {
		this.user.setToken(token);
	},

	getSignin: function() {
		return this.user.urls.signin;
	},

	getSignout: function() {
		return this.user.urls.signout;
	},

	/**
	 * sets the current visible screen presented to the user
	 * @param {string} screenId
	 */
	route: function(route) {
		this.set({ layout: route });
		// this.set({ filter: route });
	},
	
	playMedia: function(options) {
		this.player.setOptions(options);
	},

	fetchCurrentMediaInfo: function() {
		this.youtube.fetchMediaById(this.player.get('mediaId'));
	},

	fetchPlaylistInfo: function(items) {
		// @todo should be a playlistId and a videoId seperated
		this.youtube.fetchPlaylistInfo(this.player.get('nowPlayingId'));
	}
});

module.exports = PlayerModel;