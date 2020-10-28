import React from 'react'
import { gql, useQuery } from '@apollo/client'
import PostCard from '../components/PostCard';
import {  Grid } from 'semantic-ui-react'



export default function Profile(props) {
  const username = props.match.params.username

  const { data } = useQuery(FETCH_USER_POSTS_QUERY, {
    variables: {
      username
    }
  })

  return (
    <Grid columns={2} stackable>
      <Grid.Row className="page-title">
        <h1>Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {data &&
          data.getUserPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
      </Grid.Row>
    </Grid>
  )
}


const FETCH_USER_POSTS_QUERY = gql`
  query($username: String!) {
    getUserPosts(username: $username) {
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