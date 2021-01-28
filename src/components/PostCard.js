import React, {useContext} from 'react'
import { Card, Label, Icon, Button, Image, Popup } from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import moment from 'moment';

import {AuthContext} from '../context/auth';
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard({post: {body, id, username, createdAt, likeCount, commentCount, likes, comments} }) {
    const {user} = useContext(AuthContext);
    return (
        <div>
            <Card fluid>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/OOjs_UI_icon_userAvatar-constructive.svg/120px-OOjs_UI_icon_userAvatar-constructive.svg.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                   {body}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount}}/>
                <Popup 
                  content='Comment on post' 
                  trigger={
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                      <Button color='blue'basic>
                        <Icon name='comments' />
                      </Button>
                      <Label basic color='blue' pointing='left'>
                       {commentCount}
                      </Label>
                    </Button>
                  } 
                />
                {user  && user.username === username && <DeleteButton postId={id} />}
               </Card.Content>
            </Card>
        </div>
    )
}


export default PostCard;