import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const SET_LOADING = 'SET_LOADING';
const SET_POSTS = 'SET_POSTS';

export function setLoading(loading) { return { type: SET_LOADING, loading }; }
export function setPosts(posts) { return { type: SET_POSTS, posts }; }

const initialState = { loading: true, posts: [] };

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return { ...state, loading: action.loading };
        case SET_POSTS:
            return { ...state, posts: action.posts }
        default:
            return state;
    }
};

export const appStore = createStore(appReducer, composeWithDevTools());