import React, {useContext, useState, useRef} from 'react'
import {gql, useQuery, useMutation} from '@apollo/client'
import { Grid, Image, Card, Button, Icon, Label, Form, Popup } from 'semantic-ui-react';
import moment from 'moment';

import {AuthContext} from '../context/auth'
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
//import DeleteComment from '../components/DeleteComment';

function SinglePost(props) {
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');
    
    const{data} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables:{
            postId,
            body: comment
        }
    })

    function deletePostCallback(){
        props.history.push('/')
    }

    let postMarkup;
    if(!data){
        postMarkup = <p>Loading post...</p>
    } else{
        const { getPost } = data;
        const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Image
                      floated='right'
                      size='small'
                      src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/OOjs_UI_icon_userAvatar-constructive.svg/120px-OOjs_UI_icon_userAvatar-constructive.svg.png'
                   />
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Card fluid>
                       <Card.Content>
                           <Card.Header>{username}</Card.Header>
                           <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                           <Card.Description>{body}</Card.Description>
                       </Card.Content>
                       <hr/>
                       <Card.Content extra>
                           <LikeButton user={user} post={{ id, likeCount, likes}} />
                           <Popup 
                             content='Comment on post' 
                             trigger={
                                <Button
                                  as='div'
                                  labelPosition='right'
                                  onClick={() => console.log('comment !!!')}
                                >
                                  <Button
                                    basic
                                    color='blue'
                                  >
                                      <Icon name='comments' />
                                  </Button>
                                  <Label
                                    basic
                                    color='blue'
                                    pointing='left'
                                  >
                                      {commentCount}
                                  </Label>
                               </Button>
                             } 
                            />
                           {user && user.username === username && (
                              <DeleteButton postId={id} callback={deletePostCallback}/>
                           )}
                       </Card.Content>
                    </Card>
                    {user && (
                        <Card fluid>
                          <Card.Content>
                          <p>Post a comment</p>
                            <Form>
                                <div className='ui action input fluid'>
                                    <input 
                                       type='text'
                                       placeholder='comment...'
                                       name='comment'
                                       value={comment}
                                       onChange={event => setComment(event.target.value)}
                                       ref={commentInputRef}
                                    />
                                    <button
                                       type='submit'
                                       className='ui button teal'
                                       disabled={comment.trim() === ''}
                                       onClick={submitComment}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </Form>
                          </Card.Content>
                        </Card>
                    )}
                    {comments.map((comment) => (
                        <Card fluid key={comment.id}>
                            <Card.Content>
                                {user && user.username === comment.username &&(
                                   <DeleteButton postId={id} commentId={comment.id} />
                                )}
                                <Card.Header>{comment.username}</Card.Header>
                                <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                    ))}
                  </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
   mutation($postId: String!, $body: String!){
       createComment(postId: $postId, body: $body){
           id
           comments{
               id
               body
               username
               createdAt
           }
           commentCount
       }
   }
`

const FETCH_POST_QUERY = gql`
   query($postId: ID!){
       getPost(postId: $postId){
           id 
           body 
           createdAt 
           username 
           likeCount 
           likes{
               id 
               username
           }
           commentCount
           comments{
               id 
               username 
               createdAt 
               body
           }
       }
   }
`

export default SinglePost;