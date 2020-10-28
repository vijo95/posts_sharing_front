import React, { useContext, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Card, Grid, Image, Icon, Label, Transition, Form } from 'semantic-ui-react'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'



function SinglePost(props) {
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)

  const [comment, setComment] = useState('')

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update(){
      setComment("")
    },
    variables: {
      postId,
      body: comment
    }
  })

  function deletePostCallback(){
    props.history.push('/')
  }

  let postMarkup
  if(!data){
    postMarkup = <p>Loading post..</p>
  } else {
    console.log(data);
    const { 
      id, body, createdAt, 
      username, comments, likes, 
      likeCount, commentCount } = data.getPost

      postMarkup = (
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr/>
                <Card.Content extra>
                  <LikeButton user={user} post={{id, likeCount, likes}}/>
                  <Button as="div" labelPosition="right"
                    onClick={() => console.log("Comment Button")}> 
                    <Button basic color="purple">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="purple" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                  { user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback}/>
                  )}
                </Card.Content>
              </Card>
              { user && (
                <Card fluid>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                      />
                      <button type="submit"
                      className="ui button teal"
                      disabled={comment.trim() === ""}
                      onClick={submitComment}>
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card>
              )}
              { comments.map(com => (
                <Transition.Group key={com.id}>
                  <Card fluid>
                    <Card.Content>
                      { user && user.username === com.username && (
                        <DeleteButton postId={id} commentId={com.id} />
                      )}
                      <Card.Header>{com.username}</Card.Header>
                      <Card.Meta>{moment(com.createdAt).fromNow()}</Card.Meta>
                      <Card.Description>{com.body}</Card.Description>
                    </Card.Content>
                  </Card>
                </Transition.Group>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
  }
  return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id body createdAt username
      }
      commentCount
    }
  }
`

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

export default SinglePost