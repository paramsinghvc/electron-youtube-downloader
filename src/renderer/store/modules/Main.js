const state = {
	main: 0,
	video: {
		videos: []
	}
};

const mutations = {
	SET_VIDEO(state, payload) {
		state.video = payload;
	}
};

const actions = {
	setVideo({ commit }, video) {
		commit('SET_VIDEO', video);
	}
};

export default {
	state,
	mutations,
	actions
};
