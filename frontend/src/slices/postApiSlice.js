import { POST_URL } from '../../constants.js';
import { apiSlice } from './apiSlice.js';
import { userApiSlice } from './userApiSlice.js';

export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        createPost: builder.mutation({
            query: (data)=>({
                url: `${POST_URL}/create`,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5,
        }),
        deletePost: builder.mutation({
            query: (id)=>({
                url: `${POST_URL}/delete/${id}`,
                method: 'DELETE'
            })
        }),
        likePost: builder.mutation({
            query: (id)=>({
                url: `${POST_URL}/like/${id}`,
                method: 'PUT',
            }),
            keepUnusedDataFor: 5,
        }),
        getPosts: builder.query({
            query: (data)=>({
                url: `${POST_URL}/`,
                body: data,
            }),
            keepUnusedDataFor: 5,
        }),
        getPostComment: builder.query({
            query: (id)=>({
                url: `${POST_URL}/comment/${id}`
            }),
            keepUnusedDataFor: 5,
        }),
        postPostComment: builder.mutation({
            query: ({text, postId})=>({
                url: `${POST_URL}/add-comment/${postId}`,
                method: 'POST',
                body: {text}
            }),
            keepUnusedDataFor: 5,
        })
    })
})

export const { 
    useCreatePostMutation, 
    useLikePostMutation,
    useGetPostsQuery,
    useDeletePostMutation,
    useGetPostCommentQuery,
    usePostPostCommentMutation
} = userApiSlice;