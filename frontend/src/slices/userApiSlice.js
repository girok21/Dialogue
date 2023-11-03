import { USER_URL, AUTH_URL } from '../../constants.js';


import { apiSlice } from './apiSlice.js';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data,
            }),
            keepUnusedDataFor: 5,
        }),
        register: builder.mutation({
            query: (data)=>({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data,
            }),
            keepUnusedDataFor: 5,
        }),
        getUserProfile: builder.query({
            query: (username)=>({
                url: `${USER_URL}/profile/${username}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getUserById: builder.query({
            query: (id)=>({
                url: `${USER_URL}/profile/id/${id}`,               
            }),
            keepUnusedDataFor: 5,
        }),
        getUserFeed: builder.query({
            query: ()=>({
                url: `${USER_URL}/myfeed`,
            }),
            keepUnusedDataFor: 5
        }),
        updateData: builder.mutation({
            query: (data)=>({
                url: `${USER_URL}`,
                method: 'PUT',
                body: data,
            }),
            keepUnusedDataFor: 5
        }),
        getUserRelationship: builder.query({
            query: (id) => ({
                url: `${USER_URL}/${id}/relation`,
            }),
            keepUnusedDataFor: 5
        }),
        putUserFollowUnfollow: builder.mutation({
            query: (data) =>({
                url: `${USER_URL}/follow`,
                method: 'PUT',
                body: data,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
})

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useGetUserFeedQuery, 
    useUpdateDataMutation, 
    useGetUserProfileQuery,
    useGetUserRelationshipQuery,
    usePutUserFollowUnfollowMutation,
    useGetUserByIdQuery
} = userApiSlice;