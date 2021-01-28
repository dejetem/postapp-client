import React,{useState} from 'react'
import {gql, useMutation} from '@apollo/client'
import {Button, Icon, Confirm} from 'semantic-ui-react'



function DeleteComment({commentId, callback}){
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(proxy){
            setConfirmOpen(false);
            //remove post from cache
            if(callback) callback()
        },
        variables: {
            commentId
        }
    });
    return(
        <>
        <Button as='div' color='red' floated='right' onClick={() => setConfirmOpen(true)}>
            <Icon name='trash' style={{ margin: 0}}/>
        </Button>
        <Confirm
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deleteComment}
        />
        </>
    )
}


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




export default DeleteComment;





