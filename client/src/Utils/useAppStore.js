import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setPosts } from './AppStore';

export const useAppStore = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading);
    const posts = useSelector(state => state.posts);

    const setLoadingCallback = useCallback(loading => dispatch(setLoading(loading)), [dispatch]);
    const setPostsCallback = useCallback(posts => dispatch(setPosts(posts)), [dispatch]);

    const result = useMemo(() => {
        return {
            loading, posts,
            setLoading: setLoadingCallback,
            setPosts: setPostsCallback
        };
    }, [loading, posts, setLoadingCallback, setPostsCallback]);

    return result;
};