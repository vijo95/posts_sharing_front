import React from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const newData = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const data = { getPosts :[result.data.createPost, ...newData.getPosts]}
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
      values.body = ''
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <TextArea placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false} 
            style={{marginBottom:'10px'}}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      { error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`

export default PostForm;