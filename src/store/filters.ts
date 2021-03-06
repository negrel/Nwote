import { MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { RootState } from './store';

export interface FilterState {
  filtredList: number[];
  filter: string;
  favorited: number;
}

export const state: FilterState = {
  filtredList: [],
  filter: 'all',
  favorited: 0
};

export const mutations: MutationTree<FilterState> = {
  SET_LIST(state, payload): void{
    state.filtredList = payload;
  },
  SET_FAV(state, payload): void {
    state.favorited = payload;
  },
  SET_FILTER(state, payload): void {
    state.filter = payload;
  }
};

export const actions: ActionTree<FilterState, RootState> = {
  filterByAll({ commit, rootState }: ActionContext<FilterState, RootState>): void {
    const length = rootState.Notes.noteList.length,
      payload = [];

    for (let i = 0; i < length; i++) {
      payload[i] = i;
    }
    commit('SET_LIST', payload);
  },
  filterByFav({ commit, rootState }: ActionContext<FilterState, RootState>): void {
    const noteList = rootState.Notes.noteList,
      payload = [];

    for (let i = 0, length = noteList.length; i < length; i++) {
      const note = noteList[i];
      if (note.favorited) {
        payload.push(i);
      }
    }

    commit('SET_LIST', payload);
  },
  filterByTag({ commit, rootState, state }: ActionContext<FilterState, RootState>): void {
    const noteList = rootState.Notes.noteList,
      length = noteList.length,
      tagName = state.filter,
      payload = [];

    for (let i = 0; i < length; i++) {
      if (noteList[i].matchTag(tagName)) {
        payload.push(i);
      }
    }
    commit('SET_LIST', payload);
  },
  filterBySearch({ commit, rootState, state }: ActionContext<FilterState, RootState>): void {
    const noteList = rootState.Notes.noteList,
      length = noteList.length,
      search = state.filter.replace('search:', ''),
      payload = [];

    for (let i = 0; i < length; i++) {
      if (noteList[i].match(search)) {
        payload.push(i);
      }
    }
    commit('SET_LIST', payload);
  },
  updateFavorited({ rootState, commit }: ActionContext<FilterState, RootState>): void {
    const favorited = rootState.Notes.noteList.filter((el): boolean => el.favorited).length;

    commit('SET_FAV', favorited);
  },
  updateFiltred({ dispatch, state }: ActionContext<FilterState, RootState>): void {
    const filter = state.filter;

    if (filter === 'all') {
      dispatch('filterByAll');
    } else if (filter === 'favorited') {
      dispatch('filterByFav');
    } else if (filter.match(/search:*/)) {
      dispatch('filterBySearch');
    } else {
      dispatch('filterByTag');
    }
    if (state.filtredList.length === 0) {
      dispatch('emptyNoteList', { root: true });
    }
  },
  setFilterAndUpdate({ commit, dispatch, state }: ActionContext<FilterState, RootState>, filter: string): void {
    commit('SET_FILTER', filter);
    dispatch('updateFiltred');
  },
  getFiltredIndex({ state }: ActionContext<FilterState, RootState>, index: number): number {
    return state.filtredList.indexOf(index);
  }
};

export const Filters: Module<FilterState, RootState> = {
  state,
  mutations,
  actions
};

export default Filters;
