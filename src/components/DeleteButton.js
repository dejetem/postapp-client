import React,{useState} from 'react'
import {gql, useMutation} from '@apollo/client'
import {Button, Icon, Confirm, Popup} from 'semantic-ui-react'

import {FETCH_POSTS_QUERY} from '../util/grahpql';


function DeleteButton({commentId, postId, callback}){
    const [confirmOpen, setConfirmOpen] = useState(false);
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy, result){
            setConfirmOpen(false);
            //remove post from cache
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                /*data.getPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data});*/
                let newData = [...data.getPosts];
                newData = [result.data.deletePost, ...newData];
                proxy.writeQuery({
                  query: FETCH_POSTS_QUERY,
                  data: {
                    ...data,
                    getPosts: {
                       newData,
                    },
                  },
               });
            }
            if(callback) callback()
        },
        variables: {
            commentId,
            postId
        }
    });
    return(
        <>
        <Popup 
           content={commentId ? 'Delete Comment' : 'Delete Post'} 
           trigger={
            <Button as='div' color='red' floated='right' onClick={() => setConfirmOpen(true)}>
               <Icon name='trash' style={{ margin: 0}}/>
            </Button>
           } 
        />
        
        <Confirm
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deletePostOrMutation}
        />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
       deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
               id
               username
               createdAt
               body
            }
            commentCount
        }
    }
`;


export default DeleteButton;