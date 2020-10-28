import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql'


function DeleteButton({ postId, commentId, callback }){
  const [confirmOpen, setConfirmOpen] = useState(false)
  
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
  
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy){
      setConfirmOpen(false)
      if(!commentId){
        const newData = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })
        const data = { getPosts : newData.getPosts.filter(p => p.id !== postId)}
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
      }

      if(callback) {
        callback()
      }
    },
    onError(err){
      console.log(err);
    },
    variables: {
      postId,
      commentId
    }
  })

  return (
    <>
      <Popup content={ commentId ? "Delete comment" : "Delete post"} 
        inverted trigger={
        <Button as="div" color="red"
          onClick={() => setConfirmOpen(true)}
          floated="right">
          <Icon name="trash" style={{margin:'0px'}}/>
        </Button>} 
      />
      <Confirm 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment} />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id username createdAt body
      }
      commentCount
    }
  }
`


export default DeleteButton