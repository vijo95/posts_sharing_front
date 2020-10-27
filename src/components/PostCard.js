import React, { useContext } from 'react'
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import CommentButton from './CommentButton'

function PostCard({post: { body, createdAt, id, username, likeCount, commentCount, likes}}) {
  const { user } = useContext(AuthContext)

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{id, likes, likeCount}} />
        
        <CommentButton commentCount={commentCount} id={id} />
        
        { user && user.username === username && <DeleteButton postId={id}/>}
      </Card.Content>
    </Card>
  )
}

export default PostCard
