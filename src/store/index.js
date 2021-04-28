import { createStore } from 'vuex'

export default createStore({
  state: {
    routes: [],
    sessions: {},
    users: [],
    currentSession: null,
    currentUser: JSON.parse(window.sessionStorage.getItem("user")),
    filterKey: '',
    stomp: null,
    isDot: {}
  },
  mutations: {
    login(state, user) {
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      window.localStorage.removeItem('user');
    },
    INIT_CURRENTUSER(state, user) {
      state.currentUser = user;
    },
    initRoutes(state, data) {
      state.routes = data;
    },
    changeCurrentSession(state, currentSession) {
      Vue.set(state.isDot, state.currentUser.username + '#' + currentSession.username, false);
      state.currentSession = currentSession;
    },
    addMessage(state, msg) {
      let mss = state.sessions[state.currentUser.username + '#' + msg.to];
      if (!mss) {
        // state.sessions[state.currentUser.username+'#'+msg.to] = [];
        Vue.set(state.sessions, state.currentUser.username + '#' + msg.to, []);
      }
      state.sessions[state.currentUser.username + '#' + msg.to].push({
        content: msg.content,
        date: new Date(),
        self: !msg.notSelf
      })
    },
    INIT_DATA(state) {
      //浏览器本地的历史聊天记录可以在这里完成
      let data = localStorage.getItem('vue-chat-session');
      if (data) {
        state.sessions = JSON.parse(data);
      }
    },
    INIT_USER(state, data) {
      state.users = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
